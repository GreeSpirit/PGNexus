import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let rows, countRow;

    if (q) {
      [{ rows }, { rows: [countRow] }] = await Promise.all([
        query(
          `SELECT jobid, threadid, messageid, patchfile
           FROM patch_reports
           WHERE patchfile ILIKE $1
           ORDER BY jobid DESC, patchfile
           LIMIT $2 OFFSET $3`,
          [`%${q}%`, limit, offset]
        ),
        query(
          `SELECT COUNT(*)::int AS count FROM patch_reports WHERE patchfile ILIKE $1`,
          [`%${q}%`]
        ),
      ]);
    } else {
      [{ rows }, { rows: [countRow] }] = await Promise.all([
        query(
          `SELECT jobid, threadid, messageid, patchfile
           FROM patch_reports
           ORDER BY jobid DESC, patchfile
           LIMIT $1 OFFSET $2`,
          [limit, offset]
        ),
        query(`SELECT COUNT(*)::int AS count FROM patch_reports`, []),
      ]);
    }

    return NextResponse.json({ patches: rows, total: countRow?.count ?? 0 });
  } catch (error) {
    console.error('Error fetching patch list:', error);
    return NextResponse.json({ error: 'Failed to fetch patches' }, { status: 500 });
  }
}
