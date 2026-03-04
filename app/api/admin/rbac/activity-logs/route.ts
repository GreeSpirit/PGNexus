import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { listActivityLogs } from "@/lib/db/rbac";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 200;

    const logs = await listActivityLogs(limit);
    return NextResponse.json({ logs });
  } catch (error) {
    console.error("List activity logs error:", error);
    return NextResponse.json({ error: "Failed to load activity logs" }, { status: 500 });
  }
}
