import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { listWorkflowRuns } from "@/lib/db/workflow-control";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 200;

    const runs = await listWorkflowRuns(limit);
    return NextResponse.json({ runs });
  } catch (error) {
    console.error("List workflow runs error:", error);
    return NextResponse.json({ error: "Failed to list workflow runs" }, { status: 500 });
  }
}
