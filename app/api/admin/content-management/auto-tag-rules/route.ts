import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { createAutoTagRule, listAutoTagRules } from "@/lib/db/content-management";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rules = await listAutoTagRules();
    return NextResponse.json({ rules });
  } catch (error) {
    console.error("List auto tag rules error:", error);
    return NextResponse.json({ error: "Failed to list auto tag rules" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    const rule = await createAutoTagRule({
      name,
      contentType: (body.contentType || "all").trim(),
      matchMode: (body.matchMode || "keyword").trim(),
      pattern,
      tagId,
      isEnabled: body.isEnabled !== false,
      priority: Number.isInteger(body.priority) ? Number(body.priority) : 100,
    });

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    console.error("Create auto tag rule error:", error);
    return NextResponse.json({ error: "Failed to create auto tag rule" }, { status: 500 });
  }
}
