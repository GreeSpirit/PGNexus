import { getLatestRssFeeds, getLatestNewsFeeds } from "@/lib/db/feeds";
import { query } from "@/lib/db";
import { HomePageContent } from "@/components/home/HomePageContent";
import type { UnifiedFeed } from "@/lib/types/database";

export const dynamic = 'force-dynamic';

async function getLatestEmailSubjects(limit: number) {
  const result = await query(
    `
    WITH latest_subjects AS (
      SELECT DISTINCT ON (subject)
        subject,
        jobid,
        lastactivity,
        summary,
        summary_zh
      FROM email_feeds
      WHERE subject IS NOT NULL AND subject != ''
      ORDER BY subject, jobid DESC
    )
    SELECT subject, jobid, lastactivity, summary, summary_zh
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

export default async function DashboardPage() {
  // Fetch latest feeds from each type in parallel (only 3 for card view)
  const [rssFeeds, emailSubjects, newsFeeds, topSubjects] = await Promise.all([
    getLatestRssFeeds(3, 0),
    getLatestEmailSubjects(3),
    getLatestNewsFeeds(3, 0),
    getTopDiscussionSubjects(5),
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
    content: feed.messages,
    date: feed.pubdate,
    source: feed.source,
    link: `/tech-news?source=${encodeURIComponent(feed.source)}`,
    summary_english: feed.summary,
    summary_chinese: feed.summary_zh,
    imgurl: feed.imgurl,
  }));

  return (
    <HomePageContent
      rssFeeds={transformedRssFeeds}
      emailFeeds={transformedEmailFeeds}
      newsFeeds={transformedNewsFeeds}
      topSubjects={topSubjects.subjects}
      maxJobId={topSubjects.maxJobId}
    />
  );
}
