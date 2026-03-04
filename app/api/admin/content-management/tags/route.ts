import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { createTag, listTags } from "@/lib/db/content-management";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tags = await listTags();
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("List tags error:", error);
    return NextResponse.json({ error: "Failed to list tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { name?: string; color?: string };
    const name = (body.name || "").trim();
    if (!name) return NextResponse.json({ error: "Tag name is required" }, { status: 400 });

    const tag = await createTag(name, body.color?.trim() || null);
    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    console.error("Create tag error:", error);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}
