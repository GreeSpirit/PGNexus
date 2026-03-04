import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '100');
  const offset = parseInt(searchParams.get('offset') || '0');

  if (!q.trim()) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const pattern = `%${q}%`;
    const result = await query(
      `SELECT jobid, platform, title, title_zh, url, imgurl, author, author_imgurl,
              pubdate, likes, comments, mediaurl, summary, summary_zh
       FROM social_feeds
       WHERE title ILIKE $1
          OR title_zh ILIKE $1
          OR author ILIKE $1
          OR summary ILIKE $1
          OR summary_zh ILIKE $1
          OR platform ILIKE $1
       ORDER BY jobid DESC, pubdate DESC
       LIMIT $2 OFFSET $3`,
      [pattern, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM social_feeds
       WHERE title ILIKE $1 OR title_zh ILIKE $1 OR author ILIKE $1
          OR summary ILIKE $1 OR summary_zh ILIKE $1 OR platform ILIKE $1`,
      [pattern]
    );
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      feeds: result.rows,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error('Error searching social feeds:', error);
    return NextResponse.json({ error: 'Failed to search social feeds' }, { status: 500 });
  }
}
