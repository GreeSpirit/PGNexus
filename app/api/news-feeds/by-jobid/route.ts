import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobid = searchParams.get('jobid');
    const source = searchParams.get('source');

    if (!jobid && !source) {
      return NextResponse.json(
        { error: 'jobid or source parameter is required' },
        { status: 400 }
      );
    }

    // Get specific news feed by source (more specific) or jobid
    let result;
    if (source) {
      result = await query(
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
        WHERE source = $1
        `,
        [source]
      );
    } else {
      result = await query(
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
        WHERE jobid = $1
        `,
        [parseInt(jobid!)]
      );
    }

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'News feed not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      feed: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching news feed by jobid:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news feed' },
      { status: 500 }
    );
  }
}
