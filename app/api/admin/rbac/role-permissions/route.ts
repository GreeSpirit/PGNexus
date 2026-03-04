import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { appendActivityLog, setRolePermissions } from "@/lib/db/rbac";

export async function POST(request: NextRequest) {
  try {
    const actorUserId = await getCurrentUserId();
    if (!actorUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { roleId?: number; permissionIds?: number[] };
    const roleId = Number(body.roleId);
    const permissionIds = Array.isArray(body.permissionIds)
      ? body.permissionIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
      : [];

    if (!Number.isInteger(roleId) || roleId <= 0) {
      return NextResponse.json({ error: "Invalid roleId" }, { status: 400 });
    }

    await setRolePermissions(roleId, permissionIds);

    await appendActivityLog({
      actorUserId,
      action: "rbac.role.permissions.update",
      targetType: "role",
      targetId: String(roleId),
      detail: { permissionIds },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set role permissions error:", error);
    return NextResponse.json({ error: "Failed to set role permissions" }, { status: 500 });
  }
}
