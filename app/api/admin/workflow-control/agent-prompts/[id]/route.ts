import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { updateAgentPrompt } from "@/lib/db/workflow-control";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const promptId = Number(params.id);
    if (!Number.isInteger(promptId) || promptId <= 0) {
      return NextResponse.json({ error: "Invalid prompt id" }, { status: 400 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const ok = await updateAgentPrompt(promptId, {
      name: typeof body.name === "string" ? body.name : undefined,
      content: typeof body.content === "string" ? body.content : undefined,
      language: typeof body.language === "string" ? (body.language as "en" | "zh" | "bilingual") : undefined,
      model: typeof body.model === "string" ? (body.model as "claude" | "minimax" | "gpt") : undefined,
      isEnabled: typeof body.isEnabled === "boolean" ? body.isEnabled : undefined,
    });

    if (!ok) return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update agent prompt error:", error);
    return NextResponse.json({ error: "Failed to update prompt" }, { status: 500 });
  }
}
