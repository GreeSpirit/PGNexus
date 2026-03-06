import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    let result, countResult;

    if (q.trim()) {
      const pattern = `%${q}%`;
      result = await query(
        `SELECT jobid, threadid, messageid, patchfile, summary, summary_zh, risk, risk_zh
         FROM patch_reports
         WHERE patchfile ILIKE $1
            OR summary ILIKE $1
            OR summary_zh ILIKE $1
            OR risk ILIKE $1
            OR risk_zh ILIKE $1
         ORDER BY jobid DESC
         LIMIT $2 OFFSET $3`,
        [pattern, limit, offset]
      );
      countResult = await query(
        `SELECT COUNT(*) FROM patch_reports
         WHERE patchfile ILIKE $1 OR summary ILIKE $1 OR summary_zh ILIKE $1
            OR risk ILIKE $1 OR risk_zh ILIKE $1`,
        [pattern]
      );
    } else {
      result = await query(
        `SELECT jobid, threadid, messageid, patchfile, summary, summary_zh, risk, risk_zh
         FROM patch_reports
         ORDER BY jobid DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      countResult = await query('SELECT COUNT(*) FROM patch_reports', []);
    }

    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      patches: result.rows,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error('Error searching patch reports:', error);
    return NextResponse.json({ error: 'Failed to search patch reports' }, { status: 500 });
  }
}
