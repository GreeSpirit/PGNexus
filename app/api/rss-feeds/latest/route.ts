import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get latest RSS feeds ordered by pubdate
    const result = await query(
      `
      SELECT
        jobid,
        title,
        url,
        author,
        pubdate,
        summary,
        summary_zh,
        imgurl
      FROM rss_feeds
      WHERE pubdate IS NOT NULL
      ORDER BY pubdate DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM rss_feeds WHERE pubdate IS NOT NULL`
    );

    const total = parseInt(countResult.rows[0].total);
    const hasMore = offset + limit < total;

    return NextResponse.json({
      feeds: result.rows,
      total,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSS feeds' },
      { status: 500 }
    );
  }
}
