import { getLatestRssFeeds, getLatestNewsFeeds } from "@/lib/db/feeds";
import { query } from "@/lib/db";
import { HomePageContent } from "@/components/home/HomePageContent";
import type { UnifiedFeed } from "@/lib/types/database";

export const dynamic = 'force-dynamic';

// Domains whose images need server-side proxying (hotlink protection)
const PROXY_DOMAINS = new Set(['mmbiz.qpic.cn', 'mmbiz.qlogo.cn', 'wx.qlogo.cn']);
function proxyImgUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  try {
    const { hostname } = new URL(url);
    if (PROXY_DOMAINS.has(hostname)) {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    }
  } catch { /* invalid URL — pass through */ }
  return url;
}

async function getLatestEmailSubjects(limit: number) {
  const result = await query(
    `
    WITH latest_subjects AS (
      SELECT DISTINCT ON (subject)
        subject,
        subject_zh,
        jobid,
        lastactivity,
        summary,
        summary_zh
      FROM email_feeds
      WHERE subject IS NOT NULL AND subject != ''
      ORDER BY subject, jobid DESC
    )
    SELECT subject, subject_zh, jobid, lastactivity, summary, summary_zh
    FROM latest_subjects
    ORDER BY jobid DESC
    LIMIT $1
    `,
    [limit]
  );
  return result.rows;
}

async function getTopDiscussionSubjects(limit: number) {
  const [subjectsResult, maxJobIdResult] = await Promise.all([
    query(
      `
      SELECT
        subject,
        MAX(subject_zh) as subject_zh,
        COUNT(DISTINCT jobid) as count
      FROM email_feeds
      WHERE subject IS NOT NULL AND subject != ''
      GROUP BY subject
      ORDER BY count DESC
      LIMIT $1
      `,
      [limit]
    ),
    query('SELECT MAX(jobid) as max_jobid FROM poll_jobs')
  ]);

  const maxJobId = maxJobIdResult.rows[0]?.max_jobid || 1;

  return {
    subjects: subjectsResult.rows,
    maxJobId: maxJobId
  };
}

async function getLatestSocialFeeds(limit: number) {
  const result = await query(
    `SELECT jobid, platform, title, title_zh, url, imgurl,
            author, pubdate, summary, summary_zh
     FROM social_feeds
     ORDER BY jobid DESC, pubdate DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export default async function DashboardPage() {
  // Fetch all data in parallel
  const [rssFeeds, emailSubjects, newsFeeds, topSubjects, socialFeeds] = await Promise.all([
    getLatestRssFeeds(3, 0),
    getLatestEmailSubjects(3),
    getLatestNewsFeeds(3, 0),
    getTopDiscussionSubjects(5),
    getLatestSocialFeeds(3),
  ]);

  // Transform feeds to UnifiedFeed format
  const transformedRssFeeds: UnifiedFeed[] = rssFeeds.map((feed) => {
    let displayAuthor = feed.author;
    if (!displayAuthor || displayAuthor === 'N/A' || displayAuthor.trim() === '') {
      try {
        const url = new URL(feed.url);
        displayAuthor = url.hostname;
      } catch {
        displayAuthor = 'Unknown';
      }
    }

    return {
      id: feed.jobid,
      type: 'rss',
      title: feed.title,
      title_zh: feed.title_zh,
      content: feed.content || feed.snippet,
      date: feed.pubdate,
      source: displayAuthor,
      link: `/tech-blogs?url=${encodeURIComponent(feed.url)}`,
      summary_english: feed.summary,
      summary_chinese: feed.summary_zh,
      imgurl: feed.imgurl,
    };
  });

  const transformedEmailFeeds: UnifiedFeed[] = emailSubjects.map((subject: any) => {
    return {
      id: subject.jobid,
      type: 'email',
      title: subject.subject,
      title_zh: subject.subject_zh,
      content: '',
      date: subject.lastactivity,
      source: 'Hacker Discussion',
      link: `/hacker-discussions?subject=${encodeURIComponent(subject.subject)}`,
      summary_english: subject.summary || '',
      summary_chinese: subject.summary_zh || '',
    };
  });

  const transformedNewsFeeds: UnifiedFeed[] = newsFeeds.map((feed) => ({
    id: feed.jobid,
    type: 'news',
    title: feed.subject,
    title_zh: feed.subject_zh,
    content: feed.messages,
    date: feed.pubdate,
    source: feed.source,
    link: `/tech-news?source=${encodeURIComponent(feed.source)}`,
    summary_english: feed.summary,
    summary_chinese: feed.summary_zh,
    imgurl: feed.imgurl,
  }));

  const transformedSocialFeeds: UnifiedFeed[] = socialFeeds.map((feed: any, index: number) => ({
    id: `${feed.jobid}-${feed.url}`,
    type: 'news' as const,
    title: feed.title,
    title_zh: feed.title_zh,
    date: feed.pubdate,
    source: feed.author,
    link: `/social-media?url=${encodeURIComponent(feed.url)}`,
    summary_english: feed.summary,
    summary_chinese: feed.summary_zh,
    // Proxy WeChat CDN images; fall back to default images if none provided
    imgurl: proxyImgUrl(feed.imgurl) ?? `/images/default${(index % 6) + 1}.jpg`,
  }));

  return (
    <HomePageContent
      rssFeeds={transformedRssFeeds}
      emailFeeds={transformedEmailFeeds}
      newsFeeds={transformedNewsFeeds}
      topSubjects={topSubjects.subjects}
      maxJobId={topSubjects.maxJobId}
      socialFeeds={transformedSocialFeeds}
    />
  );
}
