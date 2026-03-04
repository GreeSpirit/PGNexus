import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { appendActivityLog, setRoleApiPermissions } from "@/lib/db/rbac";

export async function POST(request: NextRequest) {
  try {
    const actorUserId = await getCurrentUserId();
    if (!actorUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { roleId?: number; apiPermissionIds?: number[] };
    const roleId = Number(body.roleId);
    const apiPermissionIds = Array.isArray(body.apiPermissionIds)
      ? body.apiPermissionIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
      : [];

    if (!Number.isInteger(roleId) || roleId <= 0) {
      return NextResponse.json({ error: "Invalid roleId" }, { status: 400 });
    }

    await setRoleApiPermissions(roleId, apiPermissionIds);

    await appendActivityLog({
      actorUserId,
      action: "rbac.role.api_permissions.update",
      targetType: "role",
      targetId: String(roleId),
      detail: { apiPermissionIds },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set role API permissions error:", error);
    return NextResponse.json({ error: "Failed to set role API permissions" }, { status: 500 });
  }
}
