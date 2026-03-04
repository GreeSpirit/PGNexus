import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { triggerWorkflow } from "@/lib/db/workflow-control";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const workflowId = Number(params.id);
    if (!Number.isInteger(workflowId) || workflowId <= 0) {
      return NextResponse.json({ error: "Invalid workflow id" }, { status: 400 });
    }

    const runId = await triggerWorkflow(workflowId, userId);
    return NextResponse.json({ success: true, runId }, { status: 201 });
  } catch (error) {
    console.error("Trigger workflow error:", error);
    return NextResponse.json({ error: "Failed to trigger workflow" }, { status: 500 });
  }
}
