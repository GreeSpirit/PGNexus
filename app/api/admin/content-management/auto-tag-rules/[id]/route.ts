import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { deleteAutoTagRule, updateAutoTagRule } from "@/lib/db/content-management";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ruleId = Number(params.id);
    if (!Number.isInteger(ruleId) || ruleId <= 0) return NextResponse.json({ error: "Invalid rule id" }, { status: 400 });

    const body = (await request.json()) as {
      name?: string;
      contentType?: string;
      matchMode?: string;
      pattern?: string;
      tagId?: number;
      isEnabled?: boolean;
      priority?: number;
    };

    const name = (body.name || "").trim();
    const pattern = (body.pattern || "").trim();
    const tagId = Number(body.tagId);
    if (!name || !pattern || !Number.isInteger(tagId) || tagId <= 0) {
      return NextResponse.json({ error: "Invalid rule payload" }, { status: 400 });
    }

    const ok = await updateAutoTagRule(ruleId, {
      name,
      contentType: (body.contentType || "all").trim(),
      matchMode: (body.matchMode || "keyword").trim(),
      pattern,
      tagId,
      isEnabled: body.isEnabled !== false,
      priority: Number.isInteger(body.priority) ? Number(body.priority) : 100,
    });

    if (!ok) return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update auto tag rule error:", error);
    return NextResponse.json({ error: "Failed to update auto tag rule" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ruleId = Number(params.id);
    if (!Number.isInteger(ruleId) || ruleId <= 0) return NextResponse.json({ error: "Invalid rule id" }, { status: 400 });

    const ok = await deleteAutoTagRule(ruleId);
    if (!ok) return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete auto tag rule error:", error);
    return NextResponse.json({ error: "Failed to delete auto tag rule" }, { status: 500 });
  }
}
