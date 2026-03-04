import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { bumpAiSummaryVersion } from "@/lib/db/content-management";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const itemId = Number(params.id);
    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json({ error: "Invalid item id" }, { status: 400 });
    }

    await bumpAiSummaryVersion(itemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("AI resummary error:", error);
    return NextResponse.json({ error: "Failed to rerun AI summary" }, { status: 500 });
  }
}
