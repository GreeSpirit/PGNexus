import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

// Disable caching for this route to always get fresh file list
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {

    const contentDir = join(process.cwd(), 'content', 'daily-updates');

    try {
      const files = await readdir(contentDir);

      // Filter for .md files and extract metadata
      const markdownFiles = files
        .filter(file => file.endsWith('.md'))
        .map(file => {
          // Extract date and jobid from filename
          // Format: YYYY-MM-DD-postgresql-daily-news-{jobid}.md
          const match = file.match(/^(\d{4}-\d{2}-\d{2}).*?-(\d+)\.md$/);

          if (match) {
            return {
              filename: file,
              date: match[1],
              jobid: parseInt(match[2]),
            };
          }

          // Fallback: just use filename
          return {
            filename: file,
            date: file.substring(0, 10), // Try to extract date from start
            jobid: 0,
          };
        })
        .sort((a, b) => {
          // Sort by jobid descending (latest first)
          if (a.jobid !== b.jobid) {
            return b.jobid - a.jobid;
          }
          // Then by date descending
          return b.date.localeCompare(a.date);
        });

      return NextResponse.json({
        files: markdownFiles,
        latest: markdownFiles.length > 0 ? markdownFiles[0] : null,
      });
    } catch (error) {
      // Directory doesn't exist or is empty
      return NextResponse.json({
        files: [],
        latest: null,
      });
    }
  } catch (error) {
    console.error('Error listing daily updates:', error);
    return NextResponse.json(
      { error: 'Failed to list daily updates' },
      { status: 500 }
    );
  }
}
