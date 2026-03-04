import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { setItemCategories, setItemTags, updateCmItem } from "@/lib/db/content-management";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const actorUserId = await getCurrentUserId();
    if (!actorUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const itemId = Number(params.id);
    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json({ error: "Invalid item id" }, { status: 400 });
    }

    const body = (await request.json()) as Record<string, unknown>;

    const ok = await updateCmItem(itemId, actorUserId, {
      title: typeof body.title === "string" ? body.title : undefined,
      body: typeof body.body === "string" || body.body === null ? (body.body as string | null) : undefined,
      blogSummary: typeof body.blogSummary === "string" || body.blogSummary === null ? (body.blogSummary as string | null) : undefined,
      emailSummary: typeof body.emailSummary === "string" || body.emailSummary === null ? (body.emailSummary as string | null) : undefined,
      patchSummary: typeof body.patchSummary === "string" || body.patchSummary === null ? (body.patchSummary as string | null) : undefined,
      newsSummary: typeof body.newsSummary === "string" || body.newsSummary === null ? (body.newsSummary as string | null) : undefined,
      trustScore: typeof body.trustScore === "number" ? body.trustScore : undefined,
      credibilityScore: typeof body.credibilityScore === "number" ? body.credibilityScore : undefined,
      isPinned: typeof body.isPinned === "boolean" ? body.isPinned : undefined,
      isHidden: typeof body.isHidden === "boolean" ? body.isHidden : undefined,
      status: typeof body.status === "string" ? body.status : undefined,
      reviewStatus: typeof body.reviewStatus === "string" ? body.reviewStatus : undefined,
      softDelete: Boolean(body.softDelete),
      restore: Boolean(body.restore),
    });

    const tagIds = Array.isArray(body.tagIds)
      ? body.tagIds.map((v) => Number(v)).filter((v) => Number.isInteger(v) && v > 0)
      : null;
    const categoryIds = Array.isArray(body.categoryIds)
      ? body.categoryIds.map((v) => Number(v)).filter((v) => Number.isInteger(v) && v > 0)
      : null;

    if (tagIds) await setItemTags(itemId, tagIds);
    if (categoryIds) await setItemCategories(itemId, categoryIds);

    if (!ok && !tagIds && !categoryIds) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update content item error:", error);
    return NextResponse.json({ error: "Failed to update content item" }, { status: 500 });
  }
}
