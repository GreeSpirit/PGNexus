import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { appendActivityLog, createRole, listRbacRoles } from "@/lib/db/rbac";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roles = await listRbacRoles();
    return NextResponse.json({ roles });
  } catch (error) {
    console.error("List roles error:", error);
    return NextResponse.json({ error: "Failed to list roles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const actorUserId = await getCurrentUserId();
    if (!actorUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { name?: string; description?: string };
    const name = (body.name || "").trim();
    const description = (body.description || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    const role = await createRole({ name, description });

    await appendActivityLog({
      actorUserId,
      action: "rbac.role.create",
      targetType: "role",
      targetId: String(role.id),
      detail: { name },
    });

    return NextResponse.json({ role }, { status: 201 });
  } catch (error) {
    console.error("Create role error:", error);
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }
}
