import { NextRequest, NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import { join } from 'path';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filename = searchParams.get('filename');
  const jobidStr = searchParams.get('jobid');
  const language = searchParams.get('language') || 'en';

  // File-based download: serve the physical MD file
  if (filename) {
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }
    if (!filename.endsWith('.md')) {
      return NextResponse.json({ error: 'Only markdown files are allowed' }, { status: 400 });
    }

    const contentDir = join(process.cwd(), 'content', 'daily-updates');
    let fileToLoad = filename;

    if (language === 'zh') {
      const zhFilename = filename.replace(/\.md$/, '') + '_zh.md';
      try {
        await access(join(contentDir, zhFilename));
        fileToLoad = zhFilename;
      } catch {
        // fallback to English
      }
    }

    try {
      const content = await readFile(join(contentDir, fileToLoad), 'utf-8');
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileToLoad)}`,
        },
      });
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  }

  // DB-based download: construct MD from stored content
  if (jobidStr) {
    const jobid = parseInt(jobidStr);
    if (isNaN(jobid)) {
      return NextResponse.json({ error: 'Invalid jobid' }, { status: 400 });
    }
    try {
      const result = await query(
        'SELECT title, title_zh, content, content_zh FROM daily_updates WHERE jobid = $1 LIMIT 1',
        [jobid]
      );
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      const row = result.rows[0];
      const content = language === 'zh' && row.content_zh ? row.content_zh : row.content;
      const title = language === 'zh' && row.title_zh ? row.title_zh : row.title;
      const downloadFilename = `${title}.md`;
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(downloadFilename)}`,
        },
      });
    } catch (err) {
      console.error('Error fetching daily update for download:', err);
      return NextResponse.json({ error: 'Failed to fetch daily update' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'filename or jobid parameter is required' }, { status: 400 });
}
