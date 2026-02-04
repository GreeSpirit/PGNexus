import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!searchQuery.trim()) {
      return NextResponse.json({
        feeds: [],
        total: 0,
        hasMore: false,
      });
    }

    // Search in title, author, summary, and summary_zh
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
      WHERE
        pubdate IS NOT NULL
        AND (
          title ILIKE $1
          OR author ILIKE $1
          OR summary ILIKE $1
          OR summary_zh ILIKE $1
        )
      ORDER BY pubdate DESC
      LIMIT $2 OFFSET $3
      `,
      [`%${searchQuery}%`, limit, offset]
    );

    // Get total count for search results
    const countResult = await query(
      `
      SELECT COUNT(*) as total
      FROM rss_feeds
      WHERE
        pubdate IS NOT NULL
        AND (
          title ILIKE $1
          OR author ILIKE $1
          OR summary ILIKE $1
          OR summary_zh ILIKE $1
        )
      `,
      [`%${searchQuery}%`]
    );

    const total = parseInt(countResult.rows[0].total);
    const hasMore = offset + limit < total;

    return NextResponse.json({
      feeds: result.rows,
      total,
      hasMore,
    });
  } catch (error) {
    console.error('Error searching RSS feeds:', error);
    return NextResponse.json(
      { error: 'Failed to search RSS feeds' },
      { status: 500 }
    );
  }
}
