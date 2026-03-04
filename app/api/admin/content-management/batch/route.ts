import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { batchUpdateItems } from "@/lib/db/content-management";

export async function POST(request: NextRequest) {
  try {
    const actorUserId = await getCurrentUserId();
    if (!actorUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      itemIds?: number[];
      action?: "hide" | "unhide" | "pin" | "unpin" | "soft_delete" | "restore";
    };

    if (!body.action || !Array.isArray(body.itemIds)) {
      return NextResponse.json({ error: "itemIds and action are required" }, { status: 400 });
    }

    const itemIds = body.itemIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0);
    const affected = await batchUpdateItems({ actorUserId, itemIds, action: body.action });

    return NextResponse.json({ success: true, affected });
  } catch (error) {
    console.error("Batch content action error:", error);
    return NextResponse.json({ error: "Failed to execute batch action" }, { status: 500 });
  }
}
