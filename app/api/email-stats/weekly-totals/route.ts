import { NextResponse } from "next/server";
import { getWeeklyEmailTotals } from "@/lib/db/feeds";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const totals = await getWeeklyEmailTotals();
    return NextResponse.json(totals);
  } catch (error) {
    console.error("Error fetching weekly email totals:", error);
    return NextResponse.json(
      { error: "Failed to fetch weekly email totals" },
      { status: 500 }
    );
  }
}
