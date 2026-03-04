import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { listWorkflowErrors } from "@/lib/db/workflow-control";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 200;

    const errors = await listWorkflowErrors(limit);
    return NextResponse.json({ errors });
  } catch (error) {
    console.error("List workflow errors error:", error);
    return NextResponse.json({ error: "Failed to list workflow errors" }, { status: 500 });
  }
}
