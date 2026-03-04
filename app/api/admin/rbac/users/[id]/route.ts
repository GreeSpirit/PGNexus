import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { appendActivityLog, replaceUserRoles, updateUserFreezeStatus } from "@/lib/db/rbac";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const actorUserId = await getCurrentUserId();
    if (!actorUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const body = (await request.json()) as {
      isFrozen?: boolean;
      roles?: string[];
    };

    if (typeof body.isFrozen === "boolean") {
      await updateUserFreezeStatus(userId, body.isFrozen);
    }

    if (Array.isArray(body.roles)) {
      const roleNames = body.roles
        .filter((r) => typeof r === "string")
        .map((r) => r.trim())
        .filter(Boolean);
      await replaceUserRoles(userId, roleNames);
    }

    await appendActivityLog({
      actorUserId,
      action: "rbac.user.update",
      targetType: "user",
      targetId: String(userId),
      detail: body as Record<string, unknown>,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user RBAC error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
