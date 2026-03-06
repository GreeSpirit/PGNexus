import { NextRequest, NextResponse } from "next/server";
import { deleteDataSource, updateDataSource, type DataSourceInput, type FeedSourceType } from "@/lib/db/data-sources";
import { getCurrentUserId } from "@/lib/auth";

const sourceTypes = new Set<FeedSourceType>(["rss_feeds", "email_feeds", "news_feeds", "social_feeds", "event_feeds"]);

function parseDataSourceInput(payload: unknown): { value?: DataSourceInput; error?: string } {
  if (!payload || typeof payload !== "object") {
    return { error: "Invalid payload" };
  }

  const p = payload as Record<string, unknown>;
  const name = typeof p.name === "string" ? p.name.trim() : "";
  const type = String(p.type) as FeedSourceType;
  const platform = typeof p.platform === "string" ? p.platform.trim() : "";
  const url = typeof p.url === "string" ? p.url.trim() : "";
  const email = typeof p.email === "string" ? p.email.trim() : "";

  if (!name) return { error: "Name is required" };
  if (!sourceTypes.has(type)) return { error: "Invalid type" };

  if (url && email) {
    return { error: "Only one identifier is allowed: url or email" };
  }

  if (type === "rss_feeds" && !url) return { error: "rss_feeds requires url" };
  if (type === "event_feeds" && !url) return { error: "event_feeds requires url" };
  if (type === "email_feeds" && !email) return { error: "email_feeds requires email" };
  if (type === "social_feeds") {
    if (!url) return { error: "social_feeds requires url" };
    if (!platform) return { error: "social_feeds requires platform" };
  }
  if (type === "news_feeds" && !url && !email) return { error: "news_feeds requires url or email" };

  const value: DataSourceInput = {
    name,
    type,
    platform: type === "social_feeds" ? platform || null : null,
    url: url || null,
    email: email || null,
    isActive: p.isActive === undefined ? true : Boolean(p.isActive),
  };

  return { value };
}

async function ensureAuthenticated() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return null;
}

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authError = await ensureAuthenticated();
    if (authError) return authError;

    const id = parseId(params.id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = await request.json();
    const parsed = parseDataSourceInput(body);

    if (parsed.error || !parsed.value) {
      return NextResponse.json({ error: parsed.error ?? "Invalid payload" }, { status: 400 });
    }

    const dataSource = await updateDataSource(id, parsed.value);
    if (!dataSource) {
      return NextResponse.json({ error: "Data source not found" }, { status: 404 });
    }

    return NextResponse.json({ dataSource });
  } catch (error) {
    console.error("Error updating data source:", error);
    return NextResponse.json({ error: "Failed to update data source" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authError = await ensureAuthenticated();
    if (authError) return authError;

    const id = parseId(params.id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const deleted = await deleteDataSource(id);
    if (!deleted) {
      return NextResponse.json({ error: "Data source not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting data source:", error);
    return NextResponse.json({ error: "Failed to delete data source" }, { status: 500 });
  }
}
