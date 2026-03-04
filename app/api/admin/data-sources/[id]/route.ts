import { NextRequest, NextResponse } from "next/server";
import { deleteDataSource, updateDataSource, type DataSourceInput } from "@/lib/db/data-sources";
import { getCurrentUserId } from "@/lib/auth";

const sourceTypes = new Set(["rss", "url", "api", "email", "other"]);
const categories = new Set(["blog", "mailing_list", "patch", "news", "event", "other"]);
const frequencyModes = new Set(["hourly", "daily", "cron"]);
const authTypes = new Set(["none", "api_key", "oauth"]);
const dedupeStrategies = new Set(["hash", "timestamp", "hash_and_timestamp", "none"]);

function parseDataSourceInput(payload: unknown): { value?: DataSourceInput; error?: string } {
  if (!payload || typeof payload !== "object") {
    return { error: "Invalid payload" };
  }

  const p = payload as Record<string, unknown>;
  const name = typeof p.name === "string" ? p.name.trim() : "";
  const endpoint = typeof p.endpoint === "string" ? p.endpoint.trim() : "";

  if (!name) return { error: "Name is required" };
  if (!endpoint) return { error: "Endpoint is required" };

  if (!sourceTypes.has(String(p.sourceType))) return { error: "Invalid sourceType" };
  if (!categories.has(String(p.category))) return { error: "Invalid category" };
  if (!frequencyModes.has(String(p.frequencyMode))) return { error: "Invalid frequencyMode" };
  if (!authTypes.has(String(p.authType))) return { error: "Invalid authType" };
  if (!dedupeStrategies.has(String(p.dedupeStrategy))) return { error: "Invalid dedupeStrategy" };

  const timeoutSeconds = Number(p.timeoutSeconds);
  const retryCount = Number(p.retryCount);
  const retryBackoffSeconds = Number(p.retryBackoffSeconds);
  const maxFetchItems = Number(p.maxFetchItems);
  const anomalyThresholdPct = Number(p.anomalyThresholdPct);

  if (!Number.isInteger(timeoutSeconds) || timeoutSeconds <= 0 || timeoutSeconds > 600) {
    return { error: "timeoutSeconds must be an integer between 1 and 600" };
  }
  if (!Number.isInteger(retryCount) || retryCount < 0 || retryCount > 10) {
    return { error: "retryCount must be an integer between 0 and 10" };
  }
  if (!Number.isInteger(retryBackoffSeconds) || retryBackoffSeconds < 0 || retryBackoffSeconds > 3600) {
    return { error: "retryBackoffSeconds must be an integer between 0 and 3600" };
  }
  if (!Number.isInteger(maxFetchItems) || maxFetchItems <= 0 || maxFetchItems > 5000) {
    return { error: "maxFetchItems must be an integer between 1 and 5000" };
  }
  if (!Number.isInteger(anomalyThresholdPct) || anomalyThresholdPct < 100 || anomalyThresholdPct > 1000) {
    return { error: "anomalyThresholdPct must be an integer between 100 and 1000" };
  }

  let authConfig: Record<string, unknown> = {};
  if (p.authConfig && typeof p.authConfig === "object" && !Array.isArray(p.authConfig)) {
    authConfig = p.authConfig as Record<string, unknown>;
  }

  const isEnabled = p.isEnabled === undefined ? true : Boolean(p.isEnabled);
  const anomalyAlertEnabled = p.anomalyAlertEnabled === undefined ? true : Boolean(p.anomalyAlertEnabled);

  const value: DataSourceInput = {
    name,
    description: typeof p.description === "string" ? p.description.trim() : null,
    sourceType: p.sourceType as DataSourceInput["sourceType"],
    category: p.category as DataSourceInput["category"],
    endpoint,
    isEnabled,
    frequencyMode: p.frequencyMode as DataSourceInput["frequencyMode"],
    frequencyValue: typeof p.frequencyValue === "string" ? p.frequencyValue.trim() || null : null,
    authType: p.authType as DataSourceInput["authType"],
    authConfig,
    timeoutSeconds,
    retryCount,
    retryBackoffSeconds,
    dedupeStrategy: p.dedupeStrategy as DataSourceInput["dedupeStrategy"],
    dedupeField: typeof p.dedupeField === "string" ? p.dedupeField.trim() || null : null,
    maxFetchItems,
    anomalyAlertEnabled,
    anomalyThresholdPct,
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
