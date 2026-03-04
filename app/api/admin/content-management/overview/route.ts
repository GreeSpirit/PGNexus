import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import {
  listAutoTagRules,
  listCategories,
  listCmItems,
  listHackerEmailDebug,
  listReviewQueue,
  listReviews,
  listTags,
} from "@/lib/db/content-management";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [items, queue, reviewLogs, tags, categories, autoTagRules, hackerEmailDebug] = await Promise.all([
      listCmItems(),
      listReviewQueue(),
      listReviews(120),
      listTags(),
      listCategories(),
      listAutoTagRules(),
      listHackerEmailDebug(120),
    ]);

    return NextResponse.json({ items, queue, reviewLogs, tags, categories, autoTagRules, hackerEmailDebug });
  } catch (error) {
    console.error("Content management overview error:", error);
    return NextResponse.json(
      { error: "Failed to load content management overview. Please apply SQL migration first." },
      { status: 500 }
    );
  }
}
