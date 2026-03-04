import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { appendActivityLog, setUserDataSourceScopes } from "@/lib/db/rbac";

export async function POST(request: NextRequest) {
  try {
    const actorUserId = await getCurrentUserId();
    if (!actorUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      userId?: number;
      scopes?: Array<{ dataSourceId: number; accessLevel: "read" | "write" | "admin" }>;
    };

    const userId = Number(body.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const scopes = Array.isArray(body.scopes)
      ? body.scopes
          .map((scope) => ({
            dataSourceId: Number(scope.dataSourceId),
            accessLevel: scope.accessLevel,
          }))
          .filter((scope) => Number.isInteger(scope.dataSourceId) && scope.dataSourceId > 0)
      : [];

    await setUserDataSourceScopes(userId, scopes);

    await appendActivityLog({
      actorUserId,
      action: "rbac.user.source_scopes.update",
      targetType: "user",
      targetId: String(userId),
      detail: { scopes },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set source scopes error:", error);
    return NextResponse.json({ error: "Failed to set source scopes" }, { status: 500 });
  }
}
