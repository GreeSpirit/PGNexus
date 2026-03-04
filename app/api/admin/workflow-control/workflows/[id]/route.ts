import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { updateWorkflow } from "@/lib/db/workflow-control";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const workflowId = Number(params.id);
    if (!Number.isInteger(workflowId) || workflowId <= 0) {
      return NextResponse.json({ error: "Invalid workflow id" }, { status: 400 });
    }

    const body = (await request.json()) as Record<string, unknown>;

    const ok = await updateWorkflow(workflowId, {
      name: typeof body.name === "string" ? body.name : undefined,
      description: typeof body.description === "string" || body.description === null ? (body.description as string | null) : undefined,
      isEnabled: typeof body.isEnabled === "boolean" ? body.isEnabled : undefined,
      triggerMode: typeof body.triggerMode === "string" ? (body.triggerMode as "scheduled" | "manual" | "event" | "hybrid") : undefined,
      retryCount: typeof body.retryCount === "number" ? body.retryCount : undefined,
      alertOnFailure: typeof body.alertOnFailure === "boolean" ? body.alertOnFailure : undefined,
      alertRule: typeof body.alertRule === "object" && body.alertRule !== null ? (body.alertRule as Record<string, unknown>) : undefined,
      queueConcurrency: typeof body.queueConcurrency === "number" ? body.queueConcurrency : undefined,
      workerCount: typeof body.workerCount === "number" ? body.workerCount : undefined,
      filterStrategy: typeof body.filterStrategy === "object" && body.filterStrategy !== null ? (body.filterStrategy as Record<string, unknown>) : undefined,
      aiModel: typeof body.aiModel === "string" ? (body.aiModel as "claude" | "minimax" | "gpt") : undefined,
      bilingualEnabled: typeof body.bilingualEnabled === "boolean" ? body.bilingualEnabled : undefined,
    });

    if (!ok) return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update workflow error:", error);
    return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 });
  }
}
