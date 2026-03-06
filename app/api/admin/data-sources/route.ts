import { NextRequest, NextResponse } from "next/server";
import { createDataSource, listDataSources, type DataSourceInput, type FeedSourceType } from "@/lib/db/data-sources";
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
  if (!userId) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  return { userId };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await ensureAuthenticated();
    if ("error" in auth) return auth.error;

    const search = request.nextUrl.searchParams;
    const page = Number(search.get("page") || "1");
    const pageSize = Number(search.get("pageSize") || "20");
    const typeRaw = search.get("type");
    const isActiveRaw = search.get("isActive");
    const q = search.get("q") || "";

    const type = typeRaw && sourceTypes.has(typeRaw as FeedSourceType) ? (typeRaw as FeedSourceType) : undefined;
    const isActive = isActiveRaw === null ? undefined : isActiveRaw === "true";

    const dataSources = await listDataSources({ page, pageSize, type, isActive, q });
    return NextResponse.json({ dataSources: dataSources.items, pagination: { total: dataSources.total, page: dataSources.page, pageSize: dataSources.pageSize } });
  } catch (error) {
    console.error("Error listing data sources:", error);
    return NextResponse.json({ error: "Failed to list data sources" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await ensureAuthenticated();
    if ("error" in auth) return auth.error;

    const body = await request.json();
    const parsed = parseDataSourceInput(body);

    if (parsed.error || !parsed.value) {
      return NextResponse.json({ error: parsed.error ?? "Invalid payload" }, { status: 400 });
    }

    const dataSource = await createDataSource(parsed.value, auth.userId);
    return NextResponse.json({ dataSource }, { status: 201 });
  } catch (error) {
    console.error("Error creating data source:", error);
    return NextResponse.json({ error: "Failed to create data source" }, { status: 500 });
  }
}
