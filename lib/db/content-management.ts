import { query } from "@/lib/db";

export interface CmItem {
  id: number;
  contentType: "blog" | "email" | "patch" | "news" | "user_submission";
  title: string;
  body: string | null;
  blogSummary: string | null;
  emailSummary: string | null;
  patchSummary: string | null;
  newsSummary: string | null;
  status: string;
  reviewStatus: string;
  trustScore: number;
  credibilityScore: number;
  aiSummaryVersion: number;
  aiLastRunAt: string | null;
  isPinned: boolean;
  isHidden: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  categories: string[];
}

export interface CmTag { id: number; name: string; color: string | null }
export interface CmCategory { id: number; name: string; description: string | null }
export interface CmAutoTagRule {
  id: number;
  name: string;
  contentType: string;
  matchMode: string;
  pattern: string;
  tagId: number;
  tagName: string;
  isEnabled: boolean;
  priority: number;
}

export interface CmReviewQueueItem {
  id: number;
  contentType: string;
  title: string;
  reviewStatus: string;
  status: string;
  createdAt: string;
}

export interface CmReviewLog {
  id: number;
  contentItemId: number;
  reviewerId: number | null;
  action: string;
  note: string | null;
  createdAt: string;
}

export interface CmHackerEmailDebug {
  id: number;
  threadid: string | null;
  subject: string | null;
  score: number;
  reason: string | null;
  createdAt: string;
}

export async function listCmItems(): Promise<CmItem[]> {
  const result = await query(
    `SELECT
      i.id,
      i.content_type AS "contentType",
      i.title,
      i.body,
      i.blog_summary AS "blogSummary",
      i.email_summary AS "emailSummary",
      i.patch_summary AS "patchSummary",
      i.news_summary AS "newsSummary",
      i.status,
      i.review_status AS "reviewStatus",
      i.trust_score AS "trustScore",
      i.credibility_score AS "credibilityScore",
      i.ai_summary_version AS "aiSummaryVersion",
      i.ai_last_run_at AS "aiLastRunAt",
      i.is_pinned AS "isPinned",
      i.is_hidden AS "isHidden",
      i.deleted_at AS "deletedAt",
      i.created_at AS "createdAt",
      i.updated_at AS "updatedAt",
      COALESCE(array_remove(array_agg(DISTINCT t.name), NULL), '{}'::text[]) AS tags,
      COALESCE(array_remove(array_agg(DISTINCT c.name), NULL), '{}'::text[]) AS categories
    FROM cm_content_items i
    LEFT JOIN cm_content_item_tags cit ON cit.content_item_id = i.id
    LEFT JOIN cm_tags t ON t.id = cit.tag_id
    LEFT JOIN cm_content_item_categories cic ON cic.content_item_id = i.id
    LEFT JOIN cm_categories c ON c.id = cic.category_id
    GROUP BY i.id
    ORDER BY i.updated_at DESC, i.id DESC`
  );

  return result.rows;
}

export async function updateCmItem(
  itemId: number,
  actorUserId: number,
  payload: Partial<{
    title: string;
    body: string | null;
    blogSummary: string | null;
    emailSummary: string | null;
    patchSummary: string | null;
    newsSummary: string | null;
    trustScore: number;
    credibilityScore: number;
    isPinned: boolean;
    isHidden: boolean;
    status: string;
    reviewStatus: string;
    softDelete: boolean;
    restore: boolean;
  }>
): Promise<boolean> {
  const result = await query(
    `UPDATE cm_content_items
     SET
       title = COALESCE($3, title),
       body = $4,
       blog_summary = $5,
       email_summary = $6,
       patch_summary = $7,
       news_summary = $8,
       trust_score = COALESCE($9, trust_score),
       credibility_score = COALESCE($10, credibility_score),
       is_pinned = COALESCE($11, is_pinned),
       is_hidden = COALESCE($12, is_hidden),
       status = COALESCE($13, status),
       review_status = COALESCE($14, review_status),
       deleted_at = CASE
         WHEN $15 THEN NOW()
         WHEN $16 THEN NULL
         ELSE deleted_at
       END,
       updated_by = $2,
       updated_at = NOW()
     WHERE id = $1`,
    [
      itemId,
      actorUserId,
      payload.title ?? null,
      payload.body ?? null,
      payload.blogSummary ?? null,
      payload.emailSummary ?? null,
      payload.patchSummary ?? null,
      payload.newsSummary ?? null,
      payload.trustScore ?? null,
      payload.credibilityScore ?? null,
      typeof payload.isPinned === "boolean" ? payload.isPinned : null,
      typeof payload.isHidden === "boolean" ? payload.isHidden : null,
      payload.status ?? null,
      payload.reviewStatus ?? null,
      Boolean(payload.softDelete),
      Boolean(payload.restore),
    ]
  );

  return (result.rowCount ?? 0) > 0;
}

export async function setItemTags(itemId: number, tagIds: number[]): Promise<void> {
  await query(`DELETE FROM cm_content_item_tags WHERE content_item_id = $1`, [itemId]);
  for (const tagId of tagIds) {
    await query(
      `INSERT INTO cm_content_item_tags (content_item_id, tag_id)
       VALUES ($1, $2)
       ON CONFLICT (content_item_id, tag_id) DO NOTHING`,
      [itemId, tagId]
    );
  }
}

export async function setItemCategories(itemId: number, categoryIds: number[]): Promise<void> {
  await query(`DELETE FROM cm_content_item_categories WHERE content_item_id = $1`, [itemId]);
  for (const categoryId of categoryIds) {
    await query(
      `INSERT INTO cm_content_item_categories (content_item_id, category_id)
       VALUES ($1, $2)
       ON CONFLICT (content_item_id, category_id) DO NOTHING`,
      [itemId, categoryId]
    );
  }
}

export async function bumpAiSummaryVersion(itemId: number): Promise<void> {
  await query(
    `UPDATE cm_content_items
     SET ai_summary_version = ai_summary_version + 1,
         ai_last_run_at = NOW(),
         updated_at = NOW()
     WHERE id = $1`,
    [itemId]
  );
}

export async function listReviewQueue(): Promise<CmReviewQueueItem[]> {
  const result = await query(
    `SELECT
      id,
      content_type AS "contentType",
      title,
      review_status AS "reviewStatus",
      status,
      created_at AS "createdAt"
    FROM cm_content_items
    WHERE deleted_at IS NULL
      AND review_status = 'pending'
    ORDER BY created_at ASC`
  );
  return result.rows;
}

export async function createReview(params: {
  contentItemId: number;
  reviewerId: number;
  action: "approve" | "reject" | "request_changes" | "hide" | "unhide" | "pin" | "unpin";
  note?: string;
}): Promise<void> {
  await query(
    `INSERT INTO cm_reviews (content_item_id, reviewer_id, action, note)
     VALUES ($1, $2, $3, $4)`,
    [params.contentItemId, params.reviewerId, params.action, params.note ?? null]
  );

  if (params.action === "approve") {
    await query(
      `UPDATE cm_content_items
       SET review_status = 'approved', status = 'published', updated_at = NOW(), updated_by = $2
       WHERE id = $1`,
      [params.contentItemId, params.reviewerId]
    );
  } else if (params.action === "reject") {
    await query(
      `UPDATE cm_content_items
       SET review_status = 'rejected', status = 'rejected', updated_at = NOW(), updated_by = $2
       WHERE id = $1`,
      [params.contentItemId, params.reviewerId]
    );
  } else if (params.action === "request_changes") {
    await query(
      `UPDATE cm_content_items
       SET review_status = 'changes_requested', updated_at = NOW(), updated_by = $2
       WHERE id = $1`,
      [params.contentItemId, params.reviewerId]
    );
  } else if (params.action === "hide") {
    await query(`UPDATE cm_content_items SET is_hidden = TRUE, status = 'hidden', updated_at = NOW(), updated_by = $2 WHERE id = $1`, [params.contentItemId, params.reviewerId]);
  } else if (params.action === "unhide") {
    await query(`UPDATE cm_content_items SET is_hidden = FALSE, status = 'published', updated_at = NOW(), updated_by = $2 WHERE id = $1`, [params.contentItemId, params.reviewerId]);
  } else if (params.action === "pin") {
    await query(`UPDATE cm_content_items SET is_pinned = TRUE, updated_at = NOW(), updated_by = $2 WHERE id = $1`, [params.contentItemId, params.reviewerId]);
  } else if (params.action === "unpin") {
    await query(`UPDATE cm_content_items SET is_pinned = FALSE, updated_at = NOW(), updated_by = $2 WHERE id = $1`, [params.contentItemId, params.reviewerId]);
  }
}

export async function batchUpdateItems(params: {
  actorUserId: number;
  itemIds: number[];
  action: "hide" | "unhide" | "pin" | "unpin" | "soft_delete" | "restore";
}): Promise<number> {
  if (params.itemIds.length === 0) return 0;

  const result = await query(
    `UPDATE cm_content_items
     SET
       is_hidden = CASE
         WHEN $2 = 'hide' THEN TRUE
         WHEN $2 = 'unhide' THEN FALSE
         ELSE is_hidden
       END,
       is_pinned = CASE
         WHEN $2 = 'pin' THEN TRUE
         WHEN $2 = 'unpin' THEN FALSE
         ELSE is_pinned
       END,
       deleted_at = CASE
         WHEN $2 = 'soft_delete' THEN NOW()
         WHEN $2 = 'restore' THEN NULL
         ELSE deleted_at
       END,
       updated_at = NOW(),
       updated_by = $3
     WHERE id = ANY($1::bigint[])`,
    [params.itemIds, params.action, params.actorUserId]
  );

  return result.rowCount ?? 0;
}

export async function listTags(): Promise<CmTag[]> {
  const result = await query(`SELECT id, name, color FROM cm_tags ORDER BY name ASC`);
  return result.rows;
}

export async function createTag(name: string, color: string | null): Promise<CmTag> {
  const result = await query(
    `INSERT INTO cm_tags (name, color)
     VALUES ($1, $2)
     RETURNING id, name, color`,
    [name, color]
  );
  return result.rows[0];
}

export async function updateTag(tagId: number, name: string, color: string | null): Promise<boolean> {
  const result = await query(`UPDATE cm_tags SET name = $2, color = $3 WHERE id = $1`, [tagId, name, color]);
  return (result.rowCount ?? 0) > 0;
}

export async function deleteTag(tagId: number): Promise<boolean> {
  const result = await query(`DELETE FROM cm_tags WHERE id = $1`, [tagId]);
  return (result.rowCount ?? 0) > 0;
}

export async function listCategories(): Promise<CmCategory[]> {
  const result = await query(`SELECT id, name, description FROM cm_categories ORDER BY name ASC`);
  return result.rows;
}

export async function createCategory(name: string, description: string | null): Promise<CmCategory> {
  const result = await query(
    `INSERT INTO cm_categories (name, description)
     VALUES ($1, $2)
     RETURNING id, name, description`,
    [name, description]
  );
  return result.rows[0];
}

export async function updateCategory(categoryId: number, name: string, description: string | null): Promise<boolean> {
  const result = await query(`UPDATE cm_categories SET name = $2, description = $3 WHERE id = $1`, [categoryId, name, description]);
  return (result.rowCount ?? 0) > 0;
}

export async function deleteCategory(categoryId: number): Promise<boolean> {
  const result = await query(`DELETE FROM cm_categories WHERE id = $1`, [categoryId]);
  return (result.rowCount ?? 0) > 0;
}

export async function listAutoTagRules(): Promise<CmAutoTagRule[]> {
  const result = await query(
    `SELECT
      r.id,
      r.name,
      r.content_type AS "contentType",
      r.match_mode AS "matchMode",
      r.pattern,
      r.tag_id AS "tagId",
      t.name AS "tagName",
      r.is_enabled AS "isEnabled",
      r.priority
    FROM cm_auto_tag_rules r
    JOIN cm_tags t ON t.id = r.tag_id
    ORDER BY r.priority ASC, r.id ASC`
  );
  return result.rows;
}

export async function createAutoTagRule(params: {
  name: string;
  contentType: string;
  matchMode: string;
  pattern: string;
  tagId: number;
  isEnabled: boolean;
  priority: number;
}): Promise<CmAutoTagRule> {
  const result = await query(
    `INSERT INTO cm_auto_tag_rules (name, content_type, match_mode, pattern, tag_id, is_enabled, priority)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING
       id,
       name,
       content_type AS "contentType",
       match_mode AS "matchMode",
       pattern,
       tag_id AS "tagId",
       is_enabled AS "isEnabled",
       priority`,
    [params.name, params.contentType, params.matchMode, params.pattern, params.tagId, params.isEnabled, params.priority]
  );

  const row = result.rows[0] as Omit<CmAutoTagRule, "tagName">;
  const tag = await query(`SELECT name FROM cm_tags WHERE id = $1`, [row.tagId]);
  return { ...row, tagName: tag.rows[0]?.name ?? "" };
}

export async function updateAutoTagRule(
  ruleId: number,
  params: {
    name: string;
    contentType: string;
    matchMode: string;
    pattern: string;
    tagId: number;
    isEnabled: boolean;
    priority: number;
  }
): Promise<boolean> {
  const result = await query(
    `UPDATE cm_auto_tag_rules
     SET name = $2,
         content_type = $3,
         match_mode = $4,
         pattern = $5,
         tag_id = $6,
         is_enabled = $7,
         priority = $8
     WHERE id = $1`,
    [ruleId, params.name, params.contentType, params.matchMode, params.pattern, params.tagId, params.isEnabled, params.priority]
  );

  return (result.rowCount ?? 0) > 0;
}

export async function deleteAutoTagRule(ruleId: number): Promise<boolean> {
  const result = await query(`DELETE FROM cm_auto_tag_rules WHERE id = $1`, [ruleId]);
  return (result.rowCount ?? 0) > 0;
}

export async function listHackerEmailDebug(limit: number = 120): Promise<CmHackerEmailDebug[]> {
  const result = await query(
    `SELECT id, threadid, subject, score, reason, created_at AS "createdAt"
     FROM cm_hacker_email_debug
     ORDER BY created_at DESC
     LIMIT $1`,
    [Math.max(1, Math.min(limit, 500))]
  );
  return result.rows;
}

export async function createHackerEmailDebug(params: {
  threadid?: string;
  subject?: string;
  score: number;
  reason?: string;
  weights?: Record<string, unknown>;
}): Promise<void> {
  await query(
    `INSERT INTO cm_hacker_email_debug (threadid, subject, score, reason, weights)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [params.threadid ?? null, params.subject ?? null, params.score, params.reason ?? null, JSON.stringify(params.weights ?? {})]
  );
}

export async function listReviews(limit: number = 200): Promise<CmReviewLog[]> {
  const result = await query(
    `SELECT
      id,
      content_item_id AS "contentItemId",
      reviewer_id AS "reviewerId",
      action,
      note,
      created_at AS "createdAt"
     FROM cm_reviews
     ORDER BY created_at DESC
     LIMIT $1`,
    [Math.max(1, Math.min(limit, 500))]
  );
  return result.rows;
}
