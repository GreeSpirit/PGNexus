import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { listCmItems } from "@/lib/db/content-management";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await listCmItems();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("List content items error:", error);
    return NextResponse.json({ error: "Failed to list content items" }, { status: 500 });
  }
}
