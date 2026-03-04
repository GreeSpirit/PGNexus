import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import {
  listAgentPrompts,
  listGlobalSettings,
  listWorkflowErrors,
  listWorkflowRuns,
  listWorkflows,
} from "@/lib/db/workflow-control";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [workflows, runs, errors, prompts, globalSettings] = await Promise.all([
      listWorkflows(),
      listWorkflowRuns(200),
      listWorkflowErrors(200),
      listAgentPrompts(),
      listGlobalSettings(),
    ]);

    return NextResponse.json({ workflows, runs, errors, prompts, globalSettings });
  } catch (error) {
    console.error("Workflow overview error:", error);
    return NextResponse.json({ error: "Failed to load workflow overview. Please apply SQL migration first." }, { status: 500 });
  }
}
