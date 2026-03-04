import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { createHackerEmailDebug, listHackerEmailDebug } from "@/lib/db/content-management";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 120;
    const rows = await listHackerEmailDebug(limit);
    return NextResponse.json({ rows });
  } catch (error) {
    console.error("List hacker email debug error:", error);
    return NextResponse.json({ error: "Failed to list debug rows" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      threadid?: string;
      subject?: string;
      score?: number;
      reason?: string;
      weights?: Record<string, unknown>;
    };

    if (typeof body.score !== "number") {
      return NextResponse.json({ error: "score is required" }, { status: 400 });
    }

    await createHackerEmailDebug({
      threadid: body.threadid,
      subject: body.subject,
      score: body.score,
      reason: body.reason,
      weights: body.weights,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Create hacker email debug error:", error);
    return NextResponse.json({ error: "Failed to create debug row" }, { status: 500 });
  }
}
