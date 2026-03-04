import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { deleteTag, updateTag } from "@/lib/db/content-management";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tagId = Number(params.id);
    if (!Number.isInteger(tagId) || tagId <= 0) return NextResponse.json({ error: "Invalid tag id" }, { status: 400 });

    const body = (await request.json()) as { name?: string; color?: string };
    const name = (body.name || "").trim();
    if (!name) return NextResponse.json({ error: "Tag name is required" }, { status: 400 });

    const ok = await updateTag(tagId, name, body.color?.trim() || null);
    if (!ok) return NextResponse.json({ error: "Tag not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update tag error:", error);
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tagId = Number(params.id);
    if (!Number.isInteger(tagId) || tagId <= 0) return NextResponse.json({ error: "Invalid tag id" }, { status: 400 });

    const ok = await deleteTag(tagId);
    if (!ok) return NextResponse.json({ error: "Tag not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete tag error:", error);
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}
