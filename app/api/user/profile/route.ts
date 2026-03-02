import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { query } from "@/lib/db";

// GET - Fetch current user's profile data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);

    const result = await query(
      "SELECT name, bio, country, organization, position FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// PATCH - Update current user's profile data
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);
    const body = await request.json();
    const { name, bio, country, organization, position } = body;

    if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
      return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
    }

    const result = await query(
      `UPDATE users
       SET name         = COALESCE($2, name),
           bio          = $3,
           country      = $4,
           organization = $5,
           position     = $6
       WHERE id = $1
       RETURNING name, bio, country, organization, position`,
      [
        userId,
        name?.trim() || null,
        bio?.trim() || null,
        country || null,
        organization?.trim() || null,
        position?.trim() || null,
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
