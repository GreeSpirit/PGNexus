import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { appendActivityLog, createManualUser } from "@/lib/db/rbac";

export async function POST(request: NextRequest) {
  try {
    const actorUserId = await getCurrentUserId();
    if (!actorUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      email?: string;
      password?: string;
      name?: string;
      roleName?: string;
    };

    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";
    const name = (body.name || "").trim();
    const roleName = (body.roleName || "member").trim();

    if (!email || !password) {
      return NextResponse.json({ error: "email and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "password must be at least 8 characters" }, { status: 400 });
    }

    const user = await createManualUser({
      email,
      password,
      name,
      roleName,
    });

    await appendActivityLog({
      actorUserId,
      action: "rbac.user.create",
      targetType: "user",
      targetId: String(user.id),
      detail: { email, roleName },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Create manual user error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create user" },
      { status: 500 }
    );
  }
}
