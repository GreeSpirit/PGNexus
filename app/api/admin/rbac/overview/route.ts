import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import {
  listActivityLogs,
  listApiPermissions,
  listDataSourceOptions,
  listPermissions,
  listRbacRoles,
  listRbacUsers,
  listSourceScopes,
} from "@/lib/db/rbac";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [users, roles, permissions, apiPermissions, sourceScopes, dataSources, activityLogs] = await Promise.all([
      listRbacUsers(),
      listRbacRoles(),
      listPermissions(),
      listApiPermissions(),
      listSourceScopes(),
      listDataSourceOptions(),
      listActivityLogs(120),
    ]);

    return NextResponse.json({
      users,
      roles,
      permissions,
      apiPermissions,
      sourceScopes,
      dataSources,
      activityLogs,
    });
  } catch (error) {
    console.error("RBAC overview error:", error);
    return NextResponse.json(
      { error: "Failed to load RBAC overview. Please apply RBAC SQL migration first." },
      { status: 500 }
    );
  }
}
