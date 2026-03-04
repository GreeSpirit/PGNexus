import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { listAgentPrompts, listGlobalSettings, updateGlobalSettings } from "@/lib/db/workflow-control";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [prompts, globalSettings] = await Promise.all([listAgentPrompts(), listGlobalSettings()]);
    return NextResponse.json({ prompts, globalSettings });
  } catch (error) {
    console.error("List agent prompts error:", error);
    return NextResponse.json({ error: "Failed to list agent prompts" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      defaultModel?: "claude" | "minimax" | "gpt";
      bilingualEnabled?: boolean;
      globalQueueConcurrency?: number;
      globalWorkerCount?: number;
    };

    await updateGlobalSettings({
      defaultModel: body.defaultModel,
      bilingualEnabled: body.bilingualEnabled,
      globalQueueConcurrency: body.globalQueueConcurrency,
      globalWorkerCount: body.globalWorkerCount,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update global workflow settings error:", error);
    return NextResponse.json({ error: "Failed to update global settings" }, { status: 500 });
  }
}
