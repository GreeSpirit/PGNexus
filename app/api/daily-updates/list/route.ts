import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface DailyUpdateEntry {
  source: 'file' | 'db';
  date: string;
  jobid: number;
  filename?: string;
}

export async function GET() {
  const entries: DailyUpdateEntry[] = [];
  const seenJobIds = new Set<number>();

  // 1. Fetch DB entries (future updates — highest priority)
  try {
    const result = await query(
      'SELECT DISTINCT ON (jobid) jobid, day FROM daily_updates ORDER BY jobid DESC',
      []
    );
    for (const row of result.rows) {
      const jobid = Number(row.jobid);
      const date = row.day instanceof Date
        ? row.day.toISOString().substring(0, 10)
        : String(row.day).substring(0, 10);
      entries.push({ source: 'db', date, jobid });
      seenJobIds.add(jobid);
    }
  } catch (err) {
    console.error('Error fetching from daily_updates table:', err);
  }

  // 2. Fetch file-based entries (backward compat — skipped if jobid already in DB)
  try {
    const contentDir = join(process.cwd(), 'content', 'daily-updates');
    const files = await readdir(contentDir);

    for (const file of files) {
      if (!file.endsWith('.md') || file.match(/_[a-z]{2}\.md$/)) continue;

      const match = file.match(/^(\d{4}-\d{2}-\d{2}).*?-(\d+)\.md$/);
      const date = match ? match[1] : file.substring(0, 10);
      const jobid = match ? parseInt(match[2]) : 0;

      if (!seenJobIds.has(jobid)) {
        entries.push({ source: 'file', date, jobid, filename: file });
        seenJobIds.add(jobid);
      }
    }
  } catch {
    // Directory doesn't exist or is empty
  }

  entries.sort((a, b) => b.jobid - a.jobid);

  return NextResponse.json({
    entries,
    latest: entries.length > 0 ? entries[0] : null,
  });
}
