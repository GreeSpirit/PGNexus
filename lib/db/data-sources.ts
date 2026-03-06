import { query } from "@/lib/db";

export type FeedSourceType = "rss_feeds" | "email_feeds" | "news_feeds" | "social_feeds" | "event_feeds";

export interface DataSourceRecord {
  id: number;
  name: string;
  type: FeedSourceType;
  platform: string | null;
  url: string | null;
  email: string | null;
  config: string | null;
  isActive: boolean;
  lastError: string | null;
  errorCount: number;
  ownerId: number | null;
  ownerName: string | null;
  createdAt: string;
  updatedAt: string;
  lastFetchedAt: string | null;
}

export interface DataSourceInput {
  name: string;
  type: FeedSourceType;
  platform?: string | null;
  url?: string | null;
  email?: string | null;
  isActive?: boolean;
}

export interface ListDataSourcesParams {
  page?: number;
  pageSize?: number;
  type?: FeedSourceType;
  isActive?: boolean;
  q?: string;
}

const selectFields = `
  SELECT
    fs.id,
    fs.name,
    fs.type,
    fs.platform,
    fs.url,
    fs.email,
    fs.config,
    fs.is_active AS "isActive",
    fs.last_error AS "lastError",
    fs.error_count AS "errorCount",
    fs.owner_id AS "ownerId",
    u.name AS "ownerName",
    fs.created_at AS "createdAt",
    fs.updated_at AS "updatedAt",
    fs.last_fetched_at AS "lastFetchedAt"
  FROM feed_sources fs
  LEFT JOIN users u ON u.id = fs.owner_id
`;

export async function listDataSources(
  params: ListDataSourcesParams = {}
): Promise<{ items: DataSourceRecord[]; total: number; page: number; pageSize: number }> {
  const page = Math.max(1, Math.floor(params.page ?? 1));
  const pageSize = Math.max(1, Math.min(100, Math.floor(params.pageSize ?? 20)));

  const whereClauses: string[] = [];
  const values: Array<string | boolean | number> = [];

  if (params.type) {
    values.push(params.type);
    whereClauses.push(`fs.type = $${values.length}`);
  }
  if (typeof params.isActive === "boolean") {
    values.push(params.isActive);
    whereClauses.push(`fs.is_active = $${values.length}`);
  }
  if (params.q && params.q.trim()) {
    values.push(`%${params.q.trim()}%`);
    const idx = values.length;
    whereClauses.push(`(fs.name ILIKE $${idx} OR fs.url ILIKE $${idx} OR fs.email ILIKE $${idx} OR fs.platform ILIKE $${idx})`);
  }

  const whereSql = whereClauses.length ? ` WHERE ${whereClauses.join(" AND ")}` : "";

  const countResult = await query(`SELECT COUNT(*)::int AS count FROM feed_sources fs${whereSql}`, values);
  const total = Number(countResult.rows[0]?.count ?? 0);

  const offset = (page - 1) * pageSize;
  const listValues = [...values, pageSize, offset];
  const result = await query(
    `${selectFields}${whereSql} ORDER BY fs.type ASC, fs.updated_at DESC, fs.id DESC LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
    listValues
  );

  return { items: result.rows, total, page, pageSize };
}

export async function createDataSource(input: DataSourceInput, ownerId: number): Promise<DataSourceRecord> {
  const result = await query(
    `INSERT INTO feed_sources (name, type, platform, url, email, is_active, owner_id, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
     RETURNING
      id,
      name,
      type,
      platform,
      url,
      email,
      config,
      is_active AS "isActive",
      last_error AS "lastError",
      error_count AS "errorCount",
      owner_id AS "ownerId",
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      last_fetched_at AS "lastFetchedAt"`,
    [
      input.name,
      input.type,
      input.platform ?? null,
      input.url ?? null,
      input.email ?? null,
      input.isActive ?? true,
      ownerId,
    ]
  );

  const row = result.rows[0] as Omit<DataSourceRecord, "ownerName">;
  if (!row.ownerId) return { ...row, ownerName: null };

  const owner = await query(`SELECT name FROM users WHERE id = $1`, [row.ownerId]);
  return { ...row, ownerName: owner.rows[0]?.name ?? null };
}

export async function updateDataSource(id: number, input: DataSourceInput): Promise<DataSourceRecord | null> {
  const result = await query(
    `UPDATE feed_sources
     SET
      name = $2,
      type = $3,
      platform = $4,
      url = $5,
      email = $6,
      is_active = $7,
      updated_at = NOW()
     WHERE id = $1
     RETURNING
      id,
      name,
      type,
      platform,
      url,
      email,
      config,
      is_active AS "isActive",
      last_error AS "lastError",
      error_count AS "errorCount",
      owner_id AS "ownerId",
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      last_fetched_at AS "lastFetchedAt"`,
    [id, input.name, input.type, input.platform ?? null, input.url ?? null, input.email ?? null, input.isActive ?? true]
  );

  if (!result.rows[0]) return null;
  const row = result.rows[0] as Omit<DataSourceRecord, "ownerName">;
  if (!row.ownerId) return { ...row, ownerName: null };

  const owner = await query(`SELECT name FROM users WHERE id = $1`, [row.ownerId]);
  return { ...row, ownerName: owner.rows[0]?.name ?? null };
}

export async function deleteDataSource(id: number): Promise<boolean> {
  const result = await query(`DELETE FROM feed_sources WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
}
