import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { appendActivityLog, deleteRole, updateRole } from "@/lib/db/rbac";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const actorUserId = await getCurrentUserId();
    if (!actorUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roleId = Number(params.id);
    if (!Number.isInteger(roleId) || roleId <= 0) {
      return NextResponse.json({ error: "Invalid role id" }, { status: 400 });
    }

    const body = (await request.json()) as { name?: string; description?: string | null };
    const updated = await updateRole(roleId, {
      name: body.name?.trim(),
      description: body.description ?? null,
    });

    if (!updated) {
      return NextResponse.json({ error: "Role not found or cannot be edited" }, { status: 404 });
    }

    await appendActivityLog({
      actorUserId,
      action: "rbac.role.update",
      targetType: "role",
      targetId: String(roleId),
      detail: body as Record<string, unknown>,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const actorUserId = await getCurrentUserId();
    if (!actorUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roleId = Number(params.id);
    if (!Number.isInteger(roleId) || roleId <= 0) {
      return NextResponse.json({ error: "Invalid role id" }, { status: 400 });
    }

    const deleted = await deleteRole(roleId);
    if (!deleted) {
      return NextResponse.json({ error: "Role not found or cannot be deleted" }, { status: 404 });
    }

    await appendActivityLog({
      actorUserId,
      action: "rbac.role.delete",
      targetType: "role",
      targetId: String(roleId),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete role error:", error);
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 });
  }
}
