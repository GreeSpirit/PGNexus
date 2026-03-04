import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'url parameter is required' }, { status: 400 });
  }

  try {
    const result = await query(
      `SELECT jobid, platform, title, title_zh, url, imgurl, author, author_imgurl,
              pubdate, likes, comments, mediaurl, summary, summary_zh
       FROM social_feeds WHERE url = $1 LIMIT 1`,
      [url]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Feed not found' }, { status: 404 });
    }

    return NextResponse.json({ feed: result.rows[0] });
  } catch (error) {
    console.error('Error fetching social feed by url:', error);
    return NextResponse.json({ error: 'Failed to fetch social feed' }, { status: 500 });
  }
}
