import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { query } from "@/lib/db";

// GET - Fetch the current user's submitted articles from social_sources
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);

    const result = await query(
      "SELECT id, platform, url, status FROM social_sources WHERE userid = $1 ORDER BY id DESC",
      [userId]
    );

    return NextResponse.json({ submissions: result.rows });
  } catch (error) {
    console.error("Error fetching suggested articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// POST - Submit a new article URL
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);
    const body = await request.json();
    const { platform, url } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { error: "platform and url are required" },
        { status: 400 }
      );
    }

    // Sanity-check the URL against the platform
    const urlPrefixes: Record<string, string> = {
      x: "https://x.com",
      linkedin: "https://linkedin.com",
      wechat: "https://mp.weixin.qq.com/",
    };

    const expectedPrefix = urlPrefixes[platform];
    if (!expectedPrefix) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    if (!url.startsWith(expectedPrefix)) {
      return NextResponse.json(
        { error: `URL must start with ${expectedPrefix}` },
        { status: 400 }
      );
    }

    // Insert the record
    const result = await query(
      `INSERT INTO social_sources (userid, platform, url, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id, platform, url, status`,
      [userId, platform, url]
    );

    return NextResponse.json({ submission: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    // Catch unique constraint violations (duplicate URL per user)
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "duplicate" },
        { status: 409 }
      );
    }
    console.error("Error submitting article:", error);
    return NextResponse.json(
      { error: "Failed to submit article" },
      { status: 500 }
    );
  }
}
