import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { listReviewQueue } from "@/lib/db/content-management";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const queue = await listReviewQueue();
    return NextResponse.json({ queue });
  } catch (error) {
    console.error("Review queue error:", error);
    return NextResponse.json({ error: "Failed to list review queue" }, { status: 500 });
  }
}
