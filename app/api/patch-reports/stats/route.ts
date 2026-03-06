import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Must match AREAS_CONFIG keys in community-patches page
const AREA_KEYS = [
  'catalog',
  'wal',
  'locking',
  'guc',
  'replication',
  'logical_decoding_or_slots',
  'extension_visible_api',
] as const;

export async function GET() {
  try {
    // Build one query that counts total patches and each area in a single pass.
    // details is a JSON text column; index 0 holds the analysis object.
    const areaCases = AREA_KEYS.map(
      (k) =>
        `SUM(CASE WHEN (details::jsonb->0->'areas_touched'->'${k}'->>'involved') = 'true' THEN 1 ELSE 0 END)::int AS "${k}"`
    ).join(',\n  ');

    const statsResult = await query(
      `SELECT COUNT(*)::int AS total,
  ${areaCases}
FROM patch_reports
WHERE details IS NOT NULL AND details <> '' AND details <> 'null' AND details <> '[]'`,
      []
    );

    const recentResult = await query(
      `SELECT jobid, threadid, messageid, patchfile, summary, summary_zh, risk, risk_zh
       FROM patch_reports
       ORDER BY jobid DESC
       LIMIT 3`,
      []
    );

    const row = statsResult.rows[0];
    const areasData = AREA_KEYS.map((k) => ({ key: k, count: row[k] ?? 0 })).filter(
      (a) => a.count > 0
    );

    return NextResponse.json({
      totalPatches: row.total ?? 0,
      areasData,
      recentPatches: recentResult.rows,
    });
  } catch (error) {
    console.error('Error fetching patch stats:', error);
    return NextResponse.json({ error: 'Failed to fetch patch stats' }, { status: 500 });
  }
}
