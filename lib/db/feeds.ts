import { query } from '../db';
import type { RssFeed, EmailFeed, NewsFeed, UnifiedFeed, FeedResponse } from '../types/database';

/**
 * Get latest RSS feeds with optional filtering by user subscriptions
 */
export async function getLatestRssFeeds(
  limit: number = 50,
  offset: number = 0,
  userSubscriptions?: string[]
): Promise<RssFeed[]> {
  let queryText = `
    SELECT jobid, title, title_zh, url, author, pubdate, content, snippet, summary, summary_zh, imgurl FROM rss_feeds
  `;
  const params: any[] = [];

  if (userSubscriptions && userSubscriptions.length > 0) {
    queryText += ` WHERE author = ANY($1)`;
    params.push(userSubscriptions);
  }

  queryText += ` ORDER BY pubdate DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await query(queryText, params);
  return result.rows;
}

/**
 * Get latest email feeds with optional filtering by user subscriptions
 */
export async function getLatestEmailFeeds(
  limit: number = 50,
  offset: number = 0,
  userSubscriptions?: string[]
): Promise<EmailFeed[]> {
  let queryText = `
    SELECT jobid, threadid, subject, subject_zh, participants, messages, summary, summary_zh, lastactivity FROM email_feeds
  `;
  const params: any[] = [];

  if (userSubscriptions && userSubscriptions.length > 0) {
    queryText += ` WHERE threadid = ANY($1)`;
    params.push(userSubscriptions);
  }

  queryText += ` ORDER BY lastactivity DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await query(queryText, params);
  return result.rows;
}

/**
 * Get latest news feeds with optional filtering by user subscriptions
 */
export async function getLatestNewsFeeds(
  limit: number = 50,
  offset: number = 0,
  userSubscriptions?: string[]
): Promise<NewsFeed[]> {
  let queryText = `
    SELECT jobid, subject, subject_zh, source, pubdate, messages, summary, summary_zh, imgurl FROM news_feeds
  `;
  const params: any[] = [];

  if (userSubscriptions && userSubscriptions.length > 0) {
    queryText += ` WHERE source = ANY($1)`;
    params.push(userSubscriptions);
  }

  queryText += ` ORDER BY pubdate DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await query(queryText, params);
  return result.rows;
}

/**
 * Get all feeds combined and sorted by date
 */
export async function getAllFeeds(
  limit: number = 50,
  offset: number = 0,
  subscriptions?: { rss?: string[]; email?: string[]; news?: string[] }
): Promise<FeedResponse> {
  const unifiedFeeds: UnifiedFeed[] = [];

  // Fetch from all three tables
  const [rssFeeds, emailFeeds, newsFeeds] = await Promise.all([
    getLatestRssFeeds(limit, 0, subscriptions?.rss),
    getLatestEmailFeeds(limit, 0, subscriptions?.email),
    getLatestNewsFeeds(limit, 0, subscriptions?.news),
  ]);

  // Transform RSS feeds
  rssFeeds.forEach((feed) => {
    // If author is 'N/A' or empty, extract domain from URL
    let displayAuthor = feed.author;
    if (!displayAuthor || displayAuthor === 'N/A' || displayAuthor.trim() === '') {
      try {
        const url = new URL(feed.url);
        displayAuthor = url.hostname;
      } catch {
        displayAuthor = 'Unknown';
      }
    }

    unifiedFeeds.push({
      id: feed.jobid,
      type: 'rss',
      title: feed.title,
      title_zh: feed.title_zh,
      content: feed.content || feed.snippet,
      date: feed.pubdate,
      source: displayAuthor,
      link: feed.url,
      summary_english: feed.summary,
      summary_chinese: feed.summary_zh,
      imgurl: feed.imgurl,
    });
  });

  // Transform email feeds
  emailFeeds.forEach((feed) => {
    // Extract messageId from messages JSON array to construct URL
    let emailUrl: string | undefined = undefined;
    if (feed.messages) {
      try {
        const messages = JSON.parse(feed.messages);
        if (Array.isArray(messages) && messages.length > 0 && messages[0].messageId) {
          emailUrl = `https://www.postgresql.org/message-id/${messages[0].messageId}`;
        }
      } catch (e) {
        // If parsing fails, leave URL as undefined
      }
    }

    unifiedFeeds.push({
      id: feed.jobid,
      type: 'email',
      title: feed.subject,
      title_zh: feed.subject_zh,
      content: feed.messages,
      date: feed.lastactivity,
      source: feed.threadid,
      link: emailUrl,
      summary_english: feed.summary,
      summary_chinese: feed.summary_zh,
    });
  });

  // Transform news feeds
  newsFeeds.forEach((feed) => {
    unifiedFeeds.push({
      id: feed.jobid,
      type: 'news',
      title: feed.subject,
      title_zh: feed.subject_zh,
      content: feed.messages,
      date: feed.pubdate,
      source: feed.source,
      link: undefined,
      summary_english: feed.summary,
      summary_chinese: feed.summary_zh,
      imgurl: feed.imgurl,
    });
  });

  // Sort by date descending (handle null dates by putting them at the end)
  unifiedFeeds.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
  });

  // Apply pagination
  const paginatedFeeds = unifiedFeeds.slice(offset, offset + limit);
  const hasMore = unifiedFeeds.length > offset + limit;

  return {
    feeds: paginatedFeeds,
    total: unifiedFeeds.length,
    hasMore,
  };
}

/**
 * Search feeds across all types
 */
export async function searchFeeds(
  searchQuery: string,
  feedType?: 'rss' | 'email' | 'news',
  dateFrom?: Date,
  dateTo?: Date,
  limit: number = 50,
  offset: number = 0
): Promise<FeedResponse> {
  const unifiedFeeds: UnifiedFeed[] = [];
  const searchPattern = `%${searchQuery}%`;

  // Search RSS feeds
  if (!feedType || feedType === 'rss') {
    let rssQuery = `
      SELECT jobid, title, title_zh, url, author, pubdate, content, snippet, summary, summary_zh, imgurl FROM rss_feeds
      WHERE (title ILIKE $1 OR title_zh ILIKE $1 OR content ILIKE $1 OR snippet ILIKE $1 OR summary ILIKE $1 OR summary_zh ILIKE $1)
    `;
    const rssParams: any[] = [searchPattern];

    if (dateFrom) {
      rssQuery += ` AND pubdate >= $${rssParams.length + 1}`;
      rssParams.push(dateFrom);
    }
    if (dateTo) {
      rssQuery += ` AND pubdate <= $${rssParams.length + 1}`;
      rssParams.push(dateTo);
    }

    rssQuery += ` ORDER BY pubdate DESC LIMIT $${rssParams.length + 1}`;
    rssParams.push(limit);

    const rssResult = await query(rssQuery, rssParams);
    rssResult.rows.forEach((feed: RssFeed) => {
      // If author is 'N/A' or empty, extract domain from URL
      let displayAuthor = feed.author;
      if (!displayAuthor || displayAuthor === 'N/A' || displayAuthor.trim() === '') {
        try {
          const url = new URL(feed.url);
          displayAuthor = url.hostname;
        } catch {
          displayAuthor = 'Unknown';
        }
      }

      unifiedFeeds.push({
        id: feed.jobid,
        type: 'rss',
        title: feed.title,
        title_zh: feed.title_zh,
        content: feed.content || feed.snippet,
        date: feed.pubdate,
        source: displayAuthor,
        link: feed.url,
        summary_english: feed.summary,
        summary_chinese: feed.summary_zh,
        imgurl: feed.imgurl,
      });
    });
  }

  // Search email feeds
  if (!feedType || feedType === 'email') {
    let emailQuery = `
      SELECT jobid, threadid, subject, subject_zh, participants, messages, summary, summary_zh, lastactivity FROM email_feeds
      WHERE (subject ILIKE $1 OR subject_zh ILIKE $1 OR messages ILIKE $1 OR summary ILIKE $1 OR summary_zh ILIKE $1)
    `;
    const emailParams: any[] = [searchPattern];

    if (dateFrom) {
      emailQuery += ` AND lastactivity >= $${emailParams.length + 1}`;
      emailParams.push(dateFrom);
    }
    if (dateTo) {
      emailQuery += ` AND lastactivity <= $${emailParams.length + 1}`;
      emailParams.push(dateTo);
    }

    emailQuery += ` ORDER BY lastactivity DESC LIMIT $${emailParams.length + 1}`;
    emailParams.push(limit);

    const emailResult = await query(emailQuery, emailParams);
    emailResult.rows.forEach((feed: EmailFeed) => {
      // Extract messageId from messages JSON array to construct URL
      let emailUrl: string | undefined = undefined;
      if (feed.messages) {
        try {
          const messages = JSON.parse(feed.messages);
          if (Array.isArray(messages) && messages.length > 0 && messages[0].messageId) {
            emailUrl = `https://www.postgresql.org/message-id/${messages[0].messageId}`;
          }
        } catch (e) {
          // If parsing fails, leave URL as undefined
        }
      }

      unifiedFeeds.push({
        id: feed.jobid,
        type: 'email',
        title: feed.subject,
        title_zh: feed.subject_zh,
        content: feed.messages,
        date: feed.lastactivity,
        source: feed.threadid,
        link: emailUrl,
        summary_english: feed.summary,
        summary_chinese: feed.summary_zh,
      });
    });
  }

  // Search news feeds
  if (!feedType || feedType === 'news') {
    let newsQuery = `
      SELECT jobid, subject, subject_zh, source, pubdate, messages, summary, summary_zh, imgurl FROM news_feeds
      WHERE (subject ILIKE $1 OR subject_zh ILIKE $1 OR messages ILIKE $1 OR summary ILIKE $1 OR summary_zh ILIKE $1)
    `;
    const newsParams: any[] = [searchPattern];

    if (dateFrom) {
      newsQuery += ` AND pubdate >= $${newsParams.length + 1}`;
      newsParams.push(dateFrom);
    }
    if (dateTo) {
      newsQuery += ` AND pubdate <= $${newsParams.length + 1}`;
      newsParams.push(dateTo);
    }

    newsQuery += ` ORDER BY pubdate DESC LIMIT $${newsParams.length + 1}`;
    newsParams.push(limit);

    const newsResult = await query(newsQuery, newsParams);
    newsResult.rows.forEach((feed: NewsFeed) => {
      unifiedFeeds.push({
        id: feed.jobid,
        type: 'news',
        title: feed.subject,
        title_zh: feed.subject_zh,
        content: feed.messages,
        date: feed.pubdate,
        source: feed.source,
        link: undefined,
        summary_english: feed.summary,
        summary_chinese: feed.summary_zh,
        imgurl: feed.imgurl,
      });
    });
  }

  // Sort by date descending (handle null dates by putting them at the end)
  unifiedFeeds.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
  });

  // Apply pagination
  const paginatedFeeds = unifiedFeeds.slice(offset, offset + limit);
  const hasMore = unifiedFeeds.length > offset + limit;

  return {
    feeds: paginatedFeeds,
    total: unifiedFeeds.length,
    hasMore,
  };
}

/**
 * Get available sources for each feed type
 */
export async function getAvailableSources(): Promise<{
  rss: string[];
  email: string[];
  news: string[];
}> {
  const [rssResult, emailResult, newsResult] = await Promise.all([
    query('SELECT DISTINCT author FROM rss_feeds WHERE author IS NOT NULL AND author != \'\' ORDER BY author'),
    query('SELECT DISTINCT threadid FROM email_feeds WHERE threadid IS NOT NULL AND threadid != \'\' ORDER BY threadid'),
    query('SELECT DISTINCT source FROM news_feeds WHERE source IS NOT NULL AND source != \'\' ORDER BY source'),
  ]);

  return {
    rss: rssResult.rows.map((row) => row.author),
    email: emailResult.rows.map((row) => row.threadid),
    news: newsResult.rows.map((row) => row.source),
  };
}

/**
 * Get daily email statistics for the last 7 days
 */
export async function getDailyEmailStats(): Promise<Array<{
  day: string;
  total_message: number;
  attachment_count: number;
  unique_contrib_count: number;
}>> {
  const queryText = `
    SELECT day, total_message, attachment_count, unique_contrib_count
    FROM daily_email_stats
    WHERE type = 'hacker'
    ORDER BY day DESC
    LIMIT 7
  `;

  const result = await query(queryText);
  // Reverse to get oldest first (for chart display)
  return result.rows.reverse();
}

/**
 * Get weekly totals for email statistics from the most recent week
 * Also calculates percentage change compared to previous week
 */
export async function getWeeklyEmailTotals(): Promise<{
  totalEmails: number;
  totalPatches: number;
  totalContributors: number;
  emailsChange?: number;
  patchesChange?: number;
  contributorsChange?: number;
}> {
  const queryText = `
    SELECT
      COALESCE(total_message, 0) as total_emails,
      COALESCE(unique_patch_count, 0) as total_patches,
      COALESCE(unique_contrib_count, 0) as total_contributors
    FROM weekly_email_stats
    WHERE type = 'hacker'
    ORDER BY day DESC
    LIMIT 2
  `;

  const result = await query(queryText);

  if (result.rows.length === 0) {
    return {
      totalEmails: 0,
      totalPatches: 0,
      totalContributors: 0,
    };
  }

  const currentWeek = {
    totalEmails: parseInt(result.rows[0].total_emails) || 0,
    totalPatches: parseInt(result.rows[0].total_patches) || 0,
    totalContributors: parseInt(result.rows[0].total_contributors) || 0,
  };

  // Calculate percentage change if we have previous week data
  if (result.rows.length > 1) {
    const previousWeek = {
      totalEmails: parseInt(result.rows[1].total_emails) || 0,
      totalPatches: parseInt(result.rows[1].total_patches) || 0,
      totalContributors: parseInt(result.rows[1].total_contributors) || 0,
    };

    const calculateChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      ...currentWeek,
      emailsChange: calculateChange(currentWeek.totalEmails, previousWeek.totalEmails),
      patchesChange: calculateChange(currentWeek.totalPatches, previousWeek.totalPatches),
      contributorsChange: calculateChange(currentWeek.totalContributors, previousWeek.totalContributors),
    };
  }

  return currentWeek;
}
