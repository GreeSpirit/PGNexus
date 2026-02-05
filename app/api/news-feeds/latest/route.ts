import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get latest news feeds ordered by jobid (since pubdate might be null)
    const result = await query(
      `
      SELECT
        jobid,
        subject,
        source,
        pubdate,
        messages,
        summary,
        summary_zh,
        imgurl
      FROM news_feeds
      ORDER BY COALESCE(pubdate, '1970-01-01'::timestamp) DESC, jobid DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM news_feeds`
    );

    const total = parseInt(countResult.rows[0].total);
    const hasMore = offset + limit < total;

    return NextResponse.json({
      feeds: result.rows,
      total,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching news feeds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news feeds' },
      { status: 500 }
    );
  }
}
