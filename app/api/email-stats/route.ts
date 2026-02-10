import { NextResponse } from "next/server";
import { getDailyEmailStats } from "@/lib/db/feeds";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getDailyEmailStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching email stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch email stats" },
      { status: 500 }
    );
  }
}
