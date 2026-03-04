import { query } from "@/lib/db";

export interface Workflow {
  id: number;
  code: string;
  name: string;
  description: string | null;
  isEnabled: boolean;
  triggerMode: "scheduled" | "manual" | "event" | "hybrid";
  retryCount: number;
  alertOnFailure: boolean;
  alertRule: Record<string, unknown>;
  queueConcurrency: number | null;
  workerCount: number | null;
  filterStrategy: Record<string, unknown>;
  aiModel: "claude" | "minimax" | "gpt";
  bilingualEnabled: boolean;
  updatedAt: string;
}

export interface WorkflowRun {
  id: number;
  workflowId: number;
  workflowName: string;
  triggerType: string;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
  retryAttempt: number;
  errorMessage: string | null;
  createdAt: string;
}

export interface WorkflowError {
  id: number;
  workflowId: number;
  workflowName: string;
  runId: number | null;
  level: string;
  message: string;
  createdAt: string;
}

export interface AgentPrompt {
  id: number;
  workflowId: number | null;
  workflowName: string | null;
  promptType: string;
  name: string;
  content: string;
  language: "en" | "zh" | "bilingual";
  model: "claude" | "minimax" | "gpt";
  isEnabled: boolean;
  updatedAt: string;
}

export interface WorkflowGlobalSettings {
  defaultModel: "claude" | "minimax" | "gpt";
  bilingualEnabled: boolean;
  globalQueueConcurrency: number | null;
  globalWorkerCount: number | null;
  updatedAt: string;
}

export async function listWorkflows(): Promise<Workflow[]> {
  const result = await query(
    `SELECT
      id,
      code,
      name,
      description,
      is_enabled AS "isEnabled",
      trigger_mode AS "triggerMode",
      retry_count AS "retryCount",
      alert_on_failure AS "alertOnFailure",
      alert_rule AS "alertRule",
      queue_concurrency AS "queueConcurrency",
      worker_count AS "workerCount",
      filter_strategy AS "filterStrategy",
      ai_model AS "aiModel",
      bilingual_enabled AS "bilingualEnabled",
      updated_at AS "updatedAt"
    FROM wf_workflows
    ORDER BY updated_at DESC, id DESC`
  );
  return result.rows;
}

export async function updateWorkflow(
  workflowId: number,
  payload: Partial<{
    name: string;
    description: string | null;
    isEnabled: boolean;
    triggerMode: "scheduled" | "manual" | "event" | "hybrid";
    retryCount: number;
    alertOnFailure: boolean;
    alertRule: Record<string, unknown>;
    queueConcurrency: number | null;
    workerCount: number | null;
    filterStrategy: Record<string, unknown>;
    aiModel: "claude" | "minimax" | "gpt";
    bilingualEnabled: boolean;
  }>
): Promise<boolean> {
  const result = await query(
    `UPDATE wf_workflows
     SET
       name = COALESCE($2, name),
       description = $3,
       is_enabled = COALESCE($4, is_enabled),
       trigger_mode = COALESCE($5, trigger_mode),
       retry_count = COALESCE($6, retry_count),
       alert_on_failure = COALESCE($7, alert_on_failure),
       alert_rule = COALESCE($8::jsonb, alert_rule),
       queue_concurrency = COALESCE($9, queue_concurrency),
       worker_count = COALESCE($10, worker_count),
       filter_strategy = COALESCE($11::jsonb, filter_strategy),
       ai_model = COALESCE($12, ai_model),
       bilingual_enabled = COALESCE($13, bilingual_enabled),
       updated_at = NOW()
     WHERE id = $1`,
    [
      workflowId,
      payload.name ?? null,
      payload.description ?? null,
      typeof payload.isEnabled === "boolean" ? payload.isEnabled : null,
      payload.triggerMode ?? null,
      typeof payload.retryCount === "number" ? payload.retryCount : null,
      typeof payload.alertOnFailure === "boolean" ? payload.alertOnFailure : null,
      payload.alertRule ? JSON.stringify(payload.alertRule) : null,
      typeof payload.queueConcurrency === "number" ? payload.queueConcurrency : null,
      typeof payload.workerCount === "number" ? payload.workerCount : null,
      payload.filterStrategy ? JSON.stringify(payload.filterStrategy) : null,
      payload.aiModel ?? null,
      typeof payload.bilingualEnabled === "boolean" ? payload.bilingualEnabled : null,
    ]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function triggerWorkflow(workflowId: number, userId: number): Promise<number> {
  const result = await query(
    `INSERT INTO wf_runs (workflow_id, trigger_type, status, created_by, created_at)
     VALUES ($1, 'manual', 'queued', $2, NOW())
     RETURNING id`,
    [workflowId, userId]
  );
  return result.rows[0].id as number;
}

export async function listWorkflowRuns(limit = 200): Promise<WorkflowRun[]> {
  const result = await query(
    `SELECT
      r.id,
      r.workflow_id AS "workflowId",
      w.name AS "workflowName",
      r.trigger_type AS "triggerType",
      r.status,
      r.started_at AS "startedAt",
      r.finished_at AS "finishedAt",
      r.duration_ms AS "durationMs",
      r.retry_attempt AS "retryAttempt",
      r.error_message AS "errorMessage",
      r.created_at AS "createdAt"
    FROM wf_runs r
    JOIN wf_workflows w ON w.id = r.workflow_id
    ORDER BY r.created_at DESC
    LIMIT $1`,
    [Math.max(1, Math.min(limit, 1000))]
  );
  return result.rows;
}

export async function listWorkflowErrors(limit = 200): Promise<WorkflowError[]> {
  const result = await query(
    `SELECT
      e.id,
      e.workflow_id AS "workflowId",
      w.name AS "workflowName",
      e.run_id AS "runId",
      e.level,
      e.message,
      e.created_at AS "createdAt"
    FROM wf_errors e
    JOIN wf_workflows w ON w.id = e.workflow_id
    ORDER BY e.created_at DESC
    LIMIT $1`,
    [Math.max(1, Math.min(limit, 1000))]
  );
  return result.rows;
}

export async function listAgentPrompts(): Promise<AgentPrompt[]> {
  const result = await query(
    `SELECT
      p.id,
      p.workflow_id AS "workflowId",
      w.name AS "workflowName",
      p.prompt_type AS "promptType",
      p.name,
      p.content,
      p.language,
      p.model,
      p.is_enabled AS "isEnabled",
      p.updated_at AS "updatedAt"
    FROM wf_agent_prompts p
    LEFT JOIN wf_workflows w ON w.id = p.workflow_id
    ORDER BY p.updated_at DESC, p.id DESC`
  );
  return result.rows;
}

export async function updateAgentPrompt(
  promptId: number,
  payload: Partial<{
    name: string;
    content: string;
    language: "en" | "zh" | "bilingual";
    model: "claude" | "minimax" | "gpt";
    isEnabled: boolean;
  }>
): Promise<boolean> {
  const result = await query(
    `UPDATE wf_agent_prompts
     SET
      name = COALESCE($2, name),
      content = COALESCE($3, content),
      language = COALESCE($4, language),
      model = COALESCE($5, model),
      is_enabled = COALESCE($6, is_enabled),
      updated_at = NOW()
     WHERE id = $1`,
    [
      promptId,
      payload.name ?? null,
      payload.content ?? null,
      payload.language ?? null,
      payload.model ?? null,
      typeof payload.isEnabled === "boolean" ? payload.isEnabled : null,
    ]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function listGlobalSettings(): Promise<WorkflowGlobalSettings | null> {
  const result = await query(
    `SELECT
      default_model AS "defaultModel",
      bilingual_enabled AS "bilingualEnabled",
      global_queue_concurrency AS "globalQueueConcurrency",
      global_worker_count AS "globalWorkerCount",
      updated_at AS "updatedAt"
    FROM wf_global_settings
    WHERE id = 1`
  );
  return result.rows[0] || null;
}

export async function updateGlobalSettings(payload: Partial<{
  defaultModel: "claude" | "minimax" | "gpt";
  bilingualEnabled: boolean;
  globalQueueConcurrency: number | null;
  globalWorkerCount: number | null;
}>): Promise<void> {
  await query(
    `UPDATE wf_global_settings
     SET
      default_model = COALESCE($1, default_model),
      bilingual_enabled = COALESCE($2, bilingual_enabled),
      global_queue_concurrency = COALESCE($3, global_queue_concurrency),
      global_worker_count = COALESCE($4, global_worker_count),
      updated_at = NOW()
     WHERE id = 1`,
    [
      payload.defaultModel ?? null,
      typeof payload.bilingualEnabled === "boolean" ? payload.bilingualEnabled : null,
      typeof payload.globalQueueConcurrency === "number" ? payload.globalQueueConcurrency : null,
      typeof payload.globalWorkerCount === "number" ? payload.globalWorkerCount : null,
    ]
  );
}
