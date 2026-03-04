import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { createReview } from "@/lib/db/content-management";

export async function POST(request: NextRequest) {
  try {
    const reviewerId = await getCurrentUserId();
    if (!reviewerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      contentItemId?: number;
      action?: "approve" | "reject" | "request_changes" | "hide" | "unhide" | "pin" | "unpin";
      note?: string;
    };

    const contentItemId = Number(body.contentItemId);
    if (!Number.isInteger(contentItemId) || contentItemId <= 0 || !body.action) {
      return NextResponse.json({ error: "Invalid review payload" }, { status: 400 });
    }

    await createReview({
      contentItemId,
      reviewerId,
      action: body.action,
      note: body.note,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review action error:", error);
    return NextResponse.json({ error: "Failed to review content" }, { status: 500 });
  }
}
