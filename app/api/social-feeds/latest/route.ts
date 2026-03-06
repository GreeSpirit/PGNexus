import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '100');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const result = await query(
      `SELECT jobid, platform, title, title_zh, url, imgurl, author, author_imgurl,
              pubdate, likes, comments, mediaurl, summary, summary_zh
       FROM social_feeds
       ORDER BY jobid DESC, pubdate DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM social_feeds', []);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      feeds: result.rows,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error('Error fetching social feeds:', error);
    return NextResponse.json({ error: 'Failed to fetch social feeds' }, { status: 500 });
  }
}
