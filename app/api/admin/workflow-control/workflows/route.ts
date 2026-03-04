import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { listWorkflows } from "@/lib/db/workflow-control";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const workflows = await listWorkflows();
    return NextResponse.json({ workflows });
  } catch (error) {
    console.error("List workflows error:", error);
    return NextResponse.json({ error: "Failed to list workflows" }, { status: 500 });
  }
}
