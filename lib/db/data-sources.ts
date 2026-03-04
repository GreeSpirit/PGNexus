import { query } from "@/lib/db";

export type DataSourceType = "rss" | "url" | "api" | "email" | "other";
export type DataSourceCategory = "blog" | "mailing_list" | "patch" | "news" | "event" | "other";
export type FrequencyMode = "hourly" | "daily" | "cron";
export type AuthType = "none" | "api_key" | "oauth";
export type DedupeStrategy = "hash" | "timestamp" | "hash_and_timestamp" | "none";

export interface DataSourceRecord {
  id: number;
  name: string;
  description: string | null;
  sourceType: DataSourceType;
  category: DataSourceCategory;
  endpoint: string;
  isEnabled: boolean;
  frequencyMode: FrequencyMode;
  frequencyValue: string | null;
  authType: AuthType;
  authConfig: Record<string, unknown>;
  timeoutSeconds: number;
  retryCount: number;
  retryBackoffSeconds: number;
  dedupeStrategy: DedupeStrategy;
  dedupeField: string | null;
  maxFetchItems: number;
  lastSuccessAt: string | null;
  lastSuccessDedupeTs: string | null;
  lastErrorLog: string | null;
  avgProcessingMs: number | null;
  anomalyAlertEnabled: boolean;
  anomalyThresholdPct: number;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface DataSourceInput {
  name: string;
  description?: string | null;
  sourceType: DataSourceType;
  category: DataSourceCategory;
  endpoint: string;
  isEnabled?: boolean;
  frequencyMode: FrequencyMode;
  frequencyValue?: string | null;
  authType: AuthType;
  authConfig?: Record<string, unknown>;
  timeoutSeconds: number;
  retryCount: number;
  retryBackoffSeconds: number;
  dedupeStrategy: DedupeStrategy;
  dedupeField?: string | null;
  maxFetchItems: number;
  anomalyAlertEnabled?: boolean;
  anomalyThresholdPct: number;
}

const selectFields = `
  SELECT
    id,
    name,
    description,
    source_type AS "sourceType",
    category,
    endpoint,
    is_enabled AS "isEnabled",
    frequency_mode AS "frequencyMode",
    frequency_value AS "frequencyValue",
    auth_type AS "authType",
    auth_config AS "authConfig",
    timeout_seconds AS "timeoutSeconds",
    retry_count AS "retryCount",
    retry_backoff_seconds AS "retryBackoffSeconds",
    dedupe_strategy AS "dedupeStrategy",
    dedupe_field AS "dedupeField",
    max_fetch_items AS "maxFetchItems",
    last_success_at AS "lastSuccessAt",
    last_success_dedupe_ts AS "lastSuccessDedupeTs",
    last_error_log AS "lastErrorLog",
    avg_processing_ms AS "avgProcessingMs",
    anomaly_alert_enabled AS "anomalyAlertEnabled",
    anomaly_threshold_pct AS "anomalyThresholdPct",
    created_by AS "createdBy",
    created_at AS "createdAt",
    updated_at AS "updatedAt"
  FROM data_sources
`;

export async function listDataSources(): Promise<DataSourceRecord[]> {
  const result = await query(`${selectFields} ORDER BY updated_at DESC, id DESC`);
  return result.rows;
}

export async function createDataSource(input: DataSourceInput, createdBy: number): Promise<DataSourceRecord> {
  const result = await query(
    `INSERT INTO data_sources (
      name, description, source_type, category, endpoint, is_enabled,
      frequency_mode, frequency_value,
      auth_type, auth_config,
      timeout_seconds, retry_count, retry_backoff_seconds,
      dedupe_strategy, dedupe_field, max_fetch_items,
      anomaly_alert_enabled, anomaly_threshold_pct,
      created_by, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8,
      $9, $10::jsonb,
      $11, $12, $13,
      $14, $15, $16,
      $17, $18,
      $19, NOW()
    )
    RETURNING
      id,
      name,
      description,
      source_type AS "sourceType",
      category,
      endpoint,
      is_enabled AS "isEnabled",
      frequency_mode AS "frequencyMode",
      frequency_value AS "frequencyValue",
      auth_type AS "authType",
      auth_config AS "authConfig",
      timeout_seconds AS "timeoutSeconds",
      retry_count AS "retryCount",
      retry_backoff_seconds AS "retryBackoffSeconds",
      dedupe_strategy AS "dedupeStrategy",
      dedupe_field AS "dedupeField",
      max_fetch_items AS "maxFetchItems",
      last_success_at AS "lastSuccessAt",
      last_success_dedupe_ts AS "lastSuccessDedupeTs",
      last_error_log AS "lastErrorLog",
      avg_processing_ms AS "avgProcessingMs",
      anomaly_alert_enabled AS "anomalyAlertEnabled",
      anomaly_threshold_pct AS "anomalyThresholdPct",
      created_by AS "createdBy",
      created_at AS "createdAt",
      updated_at AS "updatedAt"`,
    [
      input.name,
      input.description ?? null,
      input.sourceType,
      input.category,
      input.endpoint,
      input.isEnabled ?? true,
      input.frequencyMode,
      input.frequencyValue ?? null,
      input.authType,
      JSON.stringify(input.authConfig ?? {}),
      input.timeoutSeconds,
      input.retryCount,
      input.retryBackoffSeconds,
      input.dedupeStrategy,
      input.dedupeField ?? null,
      input.maxFetchItems,
      input.anomalyAlertEnabled ?? true,
      input.anomalyThresholdPct,
      createdBy,
    ]
  );

  return result.rows[0];
}

export async function updateDataSource(id: number, input: DataSourceInput): Promise<DataSourceRecord | null> {
  const result = await query(
    `UPDATE data_sources
    SET
      name = $2,
      description = $3,
      source_type = $4,
      category = $5,
      endpoint = $6,
      is_enabled = $7,
      frequency_mode = $8,
      frequency_value = $9,
      auth_type = $10,
      auth_config = $11::jsonb,
      timeout_seconds = $12,
      retry_count = $13,
      retry_backoff_seconds = $14,
      dedupe_strategy = $15,
      dedupe_field = $16,
      max_fetch_items = $17,
      anomaly_alert_enabled = $18,
      anomaly_threshold_pct = $19,
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      name,
      description,
      source_type AS "sourceType",
      category,
      endpoint,
      is_enabled AS "isEnabled",
      frequency_mode AS "frequencyMode",
      frequency_value AS "frequencyValue",
      auth_type AS "authType",
      auth_config AS "authConfig",
      timeout_seconds AS "timeoutSeconds",
      retry_count AS "retryCount",
      retry_backoff_seconds AS "retryBackoffSeconds",
      dedupe_strategy AS "dedupeStrategy",
      dedupe_field AS "dedupeField",
      max_fetch_items AS "maxFetchItems",
      last_success_at AS "lastSuccessAt",
      last_success_dedupe_ts AS "lastSuccessDedupeTs",
      last_error_log AS "lastErrorLog",
      avg_processing_ms AS "avgProcessingMs",
      anomaly_alert_enabled AS "anomalyAlertEnabled",
      anomaly_threshold_pct AS "anomalyThresholdPct",
      created_by AS "createdBy",
      created_at AS "createdAt",
      updated_at AS "updatedAt"`,
    [
      id,
      input.name,
      input.description ?? null,
      input.sourceType,
      input.category,
      input.endpoint,
      input.isEnabled ?? true,
      input.frequencyMode,
      input.frequencyValue ?? null,
      input.authType,
      JSON.stringify(input.authConfig ?? {}),
      input.timeoutSeconds,
      input.retryCount,
      input.retryBackoffSeconds,
      input.dedupeStrategy,
      input.dedupeField ?? null,
      input.maxFetchItems,
      input.anomalyAlertEnabled ?? true,
      input.anomalyThresholdPct,
    ]
  );

  return result.rows[0] ?? null;
}

export async function deleteDataSource(id: number): Promise<boolean> {
  const result = await query(`DELETE FROM data_sources WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
}
