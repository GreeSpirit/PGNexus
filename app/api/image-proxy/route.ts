import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Domains that block browser hotlinking and need server-side proxying.
// Requests are made from the Next.js server so browser Referer/Origin checks are bypassed.
const ALLOWED_DOMAINS: Record<string, string> = {
  'mmbiz.qpic.cn':  'https://mp.weixin.qq.com/',
  'mmbiz.qlogo.cn': 'https://mp.weixin.qq.com/',
  'wx.qlogo.cn':    'https://mp.weixin.qq.com/',
};

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'url parameter required' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const referer = ALLOWED_DOMAINS[parsed.hostname];
  if (!referer) {
    return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        Referer: referer,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!upstream.ok) {
      return new NextResponse(null, { status: upstream.status });
    }

    const contentType = upstream.headers.get('Content-Type') || 'image/jpeg';
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  } catch (err) {
    console.error('Image proxy error:', err);
    return new NextResponse(null, { status: 502 });
  }
}
