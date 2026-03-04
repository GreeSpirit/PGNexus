import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export interface RbacUser {
  id: number;
  email: string;
  name: string | null;
  isFrozen: boolean;
  createdAt: string;
  roles: string[];
  subscriptionCount: number;
  lastActionAt: string | null;
}

export interface RbacRole {
  id: number;
  name: string;
  description: string | null;
  isSystem: boolean;
  userCount: number;
  permissionCount: number;
  apiPermissionCount: number;
}

export interface RbacPermission {
  id: number;
  code: string;
  name: string;
  module: string;
  description: string | null;
}

export interface RbacApiPermission {
  id: number;
  code: string;
  method: string;
  pathPattern: string;
  name: string;
  description: string | null;
}

export interface RbacActivityLog {
  id: number;
  actorUserId: number | null;
  actorEmail: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  detail: Record<string, unknown>;
  createdAt: string;
}

export interface RbacSourceScope {
  userId: number;
  dataSourceId: number;
  dataSourceName: string;
  accessLevel: "read" | "write" | "admin";
}

export interface RbacDataSourceOption {
  id: number;
  name: string;
}

export async function listRbacUsers(): Promise<RbacUser[]> {
  const result = await query(
    `SELECT
      u.id,
      u.email,
      u.name,
      COALESCE(u.is_frozen, FALSE) AS "isFrozen",
      u.created_at AS "createdAt",
      COALESCE(array_remove(array_agg(DISTINCT r.name), NULL), '{}'::text[]) AS roles,
      COUNT(DISTINCT us.id)::int AS "subscriptionCount",
      MAX(ual.created_at) AS "lastActionAt"
    FROM users u
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    LEFT JOIN roles r ON r.id = ur.role_id
    LEFT JOIN user_subscriptions us ON us.user_id = u.id
    LEFT JOIN user_activity_logs ual ON ual.actor_user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC`
  );

  return result.rows;
}

export async function listRbacRoles(): Promise<RbacRole[]> {
  const result = await query(
    `SELECT
      r.id,
      r.name,
      r.description,
      r.is_system AS "isSystem",
      COUNT(DISTINCT ur.user_id)::int AS "userCount",
      COUNT(DISTINCT rp.permission_id)::int AS "permissionCount",
      COUNT(DISTINCT rap.api_permission_id)::int AS "apiPermissionCount"
    FROM roles r
    LEFT JOIN user_roles ur ON ur.role_id = r.id
    LEFT JOIN role_permissions rp ON rp.role_id = r.id
    LEFT JOIN role_api_permissions rap ON rap.role_id = r.id
    GROUP BY r.id
    ORDER BY r.is_system DESC, r.name ASC`
  );

  return result.rows;
}

export async function createRole(params: {
  name: string;
  description?: string;
}): Promise<{ id: number; name: string; description: string | null }> {
  const result = await query(
    `INSERT INTO roles (name, description, is_system)
     VALUES ($1, $2, FALSE)
     RETURNING id, name, description`,
    [params.name, params.description || null]
  );
  return result.rows[0];
}

export async function updateRole(
  roleId: number,
  params: { name?: string; description?: string | null }
): Promise<boolean> {
  const result = await query(
    `UPDATE roles
     SET
       name = COALESCE($2, name),
       description = $3
     WHERE id = $1 AND is_system = FALSE`,
    [roleId, params.name ?? null, params.description ?? null]
  );

  return (result.rowCount ?? 0) > 0;
}

export async function deleteRole(roleId: number): Promise<boolean> {
  const result = await query(`DELETE FROM roles WHERE id = $1 AND is_system = FALSE`, [roleId]);
  return (result.rowCount ?? 0) > 0;
}

export async function listPermissions(): Promise<RbacPermission[]> {
  const result = await query(
    `SELECT id, code, name, module, description
    FROM permissions
    ORDER BY module ASC, code ASC`
  );

  return result.rows;
}

export async function listApiPermissions(): Promise<RbacApiPermission[]> {
  const result = await query(
    `SELECT
      id,
      code,
      method,
      path_pattern AS "pathPattern",
      name,
      description
    FROM api_permissions
    ORDER BY method ASC, path_pattern ASC`
  );

  return result.rows;
}

export async function listDataSourceOptions(): Promise<RbacDataSourceOption[]> {
  const result = await query(`SELECT id, name FROM data_sources ORDER BY name ASC`);
  return result.rows;
}

export async function listSourceScopes(): Promise<RbacSourceScope[]> {
  const result = await query(
    `SELECT
      uds.user_id AS "userId",
      uds.data_source_id AS "dataSourceId",
      ds.name AS "dataSourceName",
      uds.access_level AS "accessLevel"
    FROM user_data_source_scopes uds
    JOIN data_sources ds ON ds.id = uds.data_source_id
    ORDER BY uds.user_id ASC, ds.name ASC`
  );
  return result.rows;
}

export async function listActivityLogs(limit: number = 200): Promise<RbacActivityLog[]> {
  const result = await query(
    `SELECT
      l.id,
      l.actor_user_id AS "actorUserId",
      u.email AS "actorEmail",
      l.action,
      l.target_type AS "targetType",
      l.target_id AS "targetId",
      l.detail,
      l.created_at AS "createdAt"
    FROM user_activity_logs l
    LEFT JOIN users u ON u.id = l.actor_user_id
    ORDER BY l.created_at DESC
    LIMIT $1`,
    [Math.max(1, Math.min(limit, 500))]
  );

  return result.rows;
}

export async function createManualUser(params: {
  email: string;
  password: string;
  name?: string;
  roleName: string;
}): Promise<{ id: number; email: string; name: string | null }> {
  const existing = await query(`SELECT id FROM users WHERE email = $1`, [params.email]);
  if (existing.rows.length > 0) {
    throw new Error("User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(params.password, 10);

  const userResult = await query(
    `INSERT INTO users (email, password_hash, name, is_frozen)
     VALUES ($1, $2, $3, FALSE)
     RETURNING id, email, name`,
    [params.email, passwordHash, params.name || null]
  );

  const user = userResult.rows[0] as { id: number; email: string; name: string | null };

  const roleResult = await query(`SELECT id FROM roles WHERE name = $1`, [params.roleName]);
  if (roleResult.rows.length > 0) {
    await query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, role_id) DO NOTHING`,
      [user.id, roleResult.rows[0].id]
    );
  }

  return user;
}

export async function updateUserFreezeStatus(userId: number, isFrozen: boolean): Promise<void> {
  await query(`UPDATE users SET is_frozen = $2 WHERE id = $1`, [userId, isFrozen]);
}

export async function replaceUserRoles(userId: number, roleNames: string[]): Promise<void> {
  await query(`DELETE FROM user_roles WHERE user_id = $1`, [userId]);

  if (roleNames.length === 0) return;

  const roleResult = await query(`SELECT id, name FROM roles WHERE name = ANY($1::text[])`, [roleNames]);
  for (const row of roleResult.rows as Array<{ id: number }>) {
    await query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, role_id) DO NOTHING`,
      [userId, row.id]
    );
  }
}

export async function setRolePermissions(roleId: number, permissionIds: number[]): Promise<void> {
  await query(`DELETE FROM role_permissions WHERE role_id = $1`, [roleId]);

  for (const permissionId of permissionIds) {
    await query(
      `INSERT INTO role_permissions (role_id, permission_id)
       VALUES ($1, $2)
       ON CONFLICT (role_id, permission_id) DO NOTHING`,
      [roleId, permissionId]
    );
  }
}

export async function setRoleApiPermissions(roleId: number, apiPermissionIds: number[]): Promise<void> {
  await query(`DELETE FROM role_api_permissions WHERE role_id = $1`, [roleId]);

  for (const apiPermissionId of apiPermissionIds) {
    await query(
      `INSERT INTO role_api_permissions (role_id, api_permission_id)
       VALUES ($1, $2)
       ON CONFLICT (role_id, api_permission_id) DO NOTHING`,
      [roleId, apiPermissionId]
    );
  }
}

export async function setUserDataSourceScopes(
  userId: number,
  scopes: Array<{ dataSourceId: number; accessLevel: "read" | "write" | "admin" }>
): Promise<void> {
  await query(`DELETE FROM user_data_source_scopes WHERE user_id = $1`, [userId]);

  for (const scope of scopes) {
    await query(
      `INSERT INTO user_data_source_scopes (user_id, data_source_id, access_level)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, data_source_id)
       DO UPDATE SET access_level = EXCLUDED.access_level`,
      [userId, scope.dataSourceId, scope.accessLevel]
    );
  }
}

export async function appendActivityLog(params: {
  actorUserId: number | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  detail?: Record<string, unknown>;
}): Promise<void> {
  await query(
    `INSERT INTO user_activity_logs (actor_user_id, action, target_type, target_id, detail)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [
      params.actorUserId,
      params.action,
      params.targetType,
      params.targetId ?? null,
      JSON.stringify(params.detail ?? {}),
    ]
  );
}
