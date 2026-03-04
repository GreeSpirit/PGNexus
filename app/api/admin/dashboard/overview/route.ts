import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { getAdminDashboardOverview } from "@/lib/db/admin-dashboard";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userName = (session.user.name || "").trim().toLowerCase();
    if (userName !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const overview = await getAdminDashboardOverview();
    return NextResponse.json(overview);
  } catch (error) {
    console.error("Admin dashboard overview error:", error);
    return NextResponse.json({ error: "Failed to load admin dashboard overview" }, { status: 500 });
  }
}
