import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobid = searchParams.get('jobid');
    const patchfile = searchParams.get('patchfile');
    const threadid = searchParams.get('threadid');

    if (!jobid || !patchfile || !threadid) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const result = await query(
      `SELECT jobid, threadid, messageid, patchfile, summary, summary_zh, risk, risk_zh, details
       FROM patch_reports
       WHERE jobid = $1 AND patchfile = $2 AND threadid = $3
       LIMIT 1`,
      [parseInt(jobid), patchfile, threadid]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Patch not found' }, { status: 404 });
    }

    const row = result.rows[0];
    let parsedDetails = null;
    if (row.details) {
      try {
        parsedDetails = JSON.parse(row.details);
      } catch {
        parsedDetails = null;
      }
    }

    return NextResponse.json({ patch: { ...row, details: parsedDetails } });
  } catch (error) {
    console.error('Error fetching patch detail:', error);
    return NextResponse.json({ error: 'Failed to fetch patch detail' }, { status: 500 });
  }
}
