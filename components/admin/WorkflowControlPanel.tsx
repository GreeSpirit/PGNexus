"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";
import { Play, RefreshCw, Settings, Siren, Bot, Languages } from "lucide-react";

type WorkflowTab = "workflows" | "runs" | "errors" | "strategy" | "prompts";
type WorkflowModal = null | "workflow-settings" | "global-settings" | "prompt-settings";

type Workflow = {
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
};

type WorkflowRun = {
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
};

type WorkflowError = {
  id: number;
  workflowId: number;
  workflowName: string;
  runId: number | null;
  level: string;
  message: string;
  createdAt: string;
};

type AgentPrompt = {
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
};

type GlobalSettings = {
  defaultModel: "claude" | "minimax" | "gpt";
  bilingualEnabled: boolean;
  globalQueueConcurrency: number | null;
  globalWorkerCount: number | null;
  updatedAt: string;
};

const defaultWorkflowEditor = {
  id: 0,
  name: "",
  description: "",
  isEnabled: true,
  triggerMode: "scheduled" as "scheduled" | "manual" | "event" | "hybrid",
  retryCount: 3,
  alertOnFailure: true,
  alertEmailEnabled: true,
  alertWebhookEnabled: false,
  alertConsecutiveFailures: 1,
  alertSilenceMinutes: 10,
  queueConcurrency: 1,
  workerCount: 1,
  filterWeightScoring: true,
  filterContentRelevance: true,
  filterMinScore: 0.7,
  filterIncludeKeywords: "",
  filterExcludeKeywords: "",
  aiModel: "gpt" as "claude" | "minimax" | "gpt",
  bilingualEnabled: true,
};

const defaultPromptEditor = {
  id: 0,
  name: "",
  content: "",
  language: "bilingual" as "en" | "zh" | "bilingual",
  model: "gpt" as "claude" | "minimax" | "gpt",
  isEnabled: true,
};

export default function WorkflowControlPanel() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<WorkflowTab>("workflows");
  const [modal, setModal] = useState<WorkflowModal>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [errors, setErrors] = useState<WorkflowError[]>([]);
  const [prompts, setPrompts] = useState<AgentPrompt[]>([]);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(null);

  const [workflowEditor, setWorkflowEditor] = useState(defaultWorkflowEditor);
  const [promptEditor, setPromptEditor] = useState(defaultPromptEditor);
  const [globalEditor, setGlobalEditor] = useState({
    defaultModel: "gpt" as "claude" | "minimax" | "gpt",
    bilingualEnabled: true,
    globalQueueConcurrency: 2,
    globalWorkerCount: 2,
  });

  // Load workflows, recent runs, errors, prompts, and global defaults.
  const refresh = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/workflow-control/overview");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load workflow panel");
      setWorkflows(data.workflows || []);
      setRuns(data.runs || []);
      setErrors(data.errors || []);
      setPrompts(data.prompts || []);
      setGlobalSettings(data.globalSettings || null);

      if (data.globalSettings) {
        setGlobalEditor({
          defaultModel: data.globalSettings.defaultModel,
          bilingualEnabled: Boolean(data.globalSettings.bilingualEnabled),
          globalQueueConcurrency: data.globalSettings.globalQueueConcurrency ?? 2,
          globalWorkerCount: data.globalSettings.globalWorkerCount ?? 2,
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : t(trans.workflowControl.loadFailed) });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    setIsClient(true);
    refresh();
  }, [refresh]);

  // Populate workflow editor modal from selected workflow record.
  const openWorkflowSettings = (workflow: Workflow) => {
    const alertRule = workflow.alertRule || {};
    const filterStrategy = workflow.filterStrategy || {};
    setWorkflowEditor({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description || "",
      isEnabled: workflow.isEnabled,
      triggerMode: workflow.triggerMode,
      retryCount: workflow.retryCount,
      alertOnFailure: workflow.alertOnFailure,
      alertEmailEnabled: Boolean(alertRule.emailEnabled ?? true),
      alertWebhookEnabled: Boolean(alertRule.webhookEnabled ?? false),
      alertConsecutiveFailures: Number(alertRule.consecutiveFailures ?? 1) || 1,
      alertSilenceMinutes: Number(alertRule.silenceMinutes ?? 10) || 10,
      queueConcurrency: workflow.queueConcurrency || 1,
      workerCount: workflow.workerCount || 1,
      filterWeightScoring: Boolean(filterStrategy.weightScoring ?? true),
      filterContentRelevance: Boolean(filterStrategy.contentRelevance ?? true),
      filterMinScore: Number(filterStrategy.minScore ?? 0.7) || 0,
      filterIncludeKeywords: Array.isArray(filterStrategy.includeKeywords)
        ? (filterStrategy.includeKeywords as string[]).join(", ")
        : "",
      filterExcludeKeywords: Array.isArray(filterStrategy.excludeKeywords)
        ? (filterStrategy.excludeKeywords as string[]).join(", ")
        : "",
      aiModel: workflow.aiModel,
      bilingualEnabled: workflow.bilingualEnabled,
    });
    setModal("workflow-settings");
  };

  // Populate prompt editor modal from selected prompt record.
  const openPromptSettings = (prompt: AgentPrompt) => {
    setPromptEditor({
      id: prompt.id,
      name: prompt.name,
      content: prompt.content,
      language: prompt.language,
      model: prompt.model,
      isEnabled: prompt.isEnabled,
    });
    setModal("prompt-settings");
  };

  // Persist workflow-level strategy, retry, filtering, and model settings.
  const saveWorkflowSettings = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const toKeywordArray = (value: string) =>
        value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

      const alertRule: Record<string, unknown> = {
        emailEnabled: workflowEditor.alertEmailEnabled,
        webhookEnabled: workflowEditor.alertWebhookEnabled,
        consecutiveFailures: Math.max(1, Number(workflowEditor.alertConsecutiveFailures) || 1),
        silenceMinutes: Math.max(0, Number(workflowEditor.alertSilenceMinutes) || 0),
      };

      const filterStrategy: Record<string, unknown> = {
        weightScoring: workflowEditor.filterWeightScoring,
        contentRelevance: workflowEditor.filterContentRelevance,
        minScore: Math.max(0, Number(workflowEditor.filterMinScore) || 0),
        includeKeywords: toKeywordArray(workflowEditor.filterIncludeKeywords),
        excludeKeywords: toKeywordArray(workflowEditor.filterExcludeKeywords),
      };

      const res = await fetch(`/api/admin/workflow-control/workflows/${workflowEditor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workflowEditor.name,
          description: workflowEditor.description,
          isEnabled: workflowEditor.isEnabled,
          triggerMode: workflowEditor.triggerMode,
          retryCount: workflowEditor.retryCount,
          alertOnFailure: workflowEditor.alertOnFailure,
          alertRule,
          queueConcurrency: workflowEditor.queueConcurrency,
          workerCount: workflowEditor.workerCount,
          filterStrategy,
          aiModel: workflowEditor.aiModel,
          bilingualEnabled: workflowEditor.bilingualEnabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t(trans.workflowControl.failedToSaveWorkflow));
      setModal(null);
      setMessage({ type: "success", text: t(trans.workflowControl.workflowUpdated) });
      refresh();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : t(trans.workflowControl.saveFailed) });
    } finally {
      setSaving(false);
    }
  };

  // Persist selected AI prompt content and runtime options.
  const savePromptSettings = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/workflow-control/agent-prompts/${promptEditor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: promptEditor.name,
          content: promptEditor.content,
          language: promptEditor.language,
          model: promptEditor.model,
          isEnabled: promptEditor.isEnabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t(trans.workflowControl.failedToSavePrompt));
      setModal(null);
      setMessage({ type: "success", text: t(trans.workflowControl.promptUpdated) });
      refresh();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : t(trans.workflowControl.saveFailed) });
    } finally {
      setSaving(false);
    }
  };

  // Persist global defaults shared by all workflows.
  const saveGlobalSettings = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/workflow-control/agent-prompts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(globalEditor),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t(trans.workflowControl.failedToSaveGlobal));
      setModal(null);
      setMessage({ type: "success", text: t(trans.workflowControl.globalUpdated) });
      refresh();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : t(trans.workflowControl.saveFailed) });
    } finally {
      setSaving(false);
    }
  };

  // Quick enable/disable switch for a workflow.
  const toggleWorkflow = async (workflow: Workflow) => {
    const res = await fetch(`/api/admin/workflow-control/workflows/${workflow.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isEnabled: !workflow.isEnabled }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: data.error || t(trans.workflowControl.toggleFailed) });
      return;
    }
    refresh();
  };

  // Trigger a one-off run for the selected workflow.
  const triggerRun = async (workflowId: number) => {
    const res = await fetch(`/api/admin/workflow-control/workflows/${workflowId}/trigger`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: data.error || t(trans.workflowControl.triggerFailed) });
      return;
    }
    setMessage({ type: "success", text: `${t(trans.workflowControl.triggeredRun)} #${data.runId}` });
    refresh();
  };

  // Render modal outside page flow to avoid clipping by parent containers.
  const modalNode = isClient && modal
    ? createPortal(
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/60 p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-5 py-4 backdrop-blur">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {modal === "workflow-settings" && t(trans.workflowControl.modalWorkflowSettings)}
                {modal === "global-settings" && t(trans.workflowControl.modalGlobalSettings)}
                {modal === "prompt-settings" && t(trans.workflowControl.modalPromptSettings)}
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={() => setModal(null)}>{t(trans.workflowControl.close)}</Button>
            </div>

            <div className="max-h-[calc(90vh-72px)] overflow-y-auto space-y-4 px-5 py-4 [scrollbar-width:thin] [scrollbar-color:rgb(148_163_184)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
              {modal === "workflow-settings" && (
                <div className="space-y-3">
                  <Input value={workflowEditor.name} onChange={(e) => setWorkflowEditor((p) => ({ ...p, name: e.target.value }))} placeholder={t(trans.workflowControl.workflowName)} />
                  <Input value={workflowEditor.description} onChange={(e) => setWorkflowEditor((p) => ({ ...p, description: e.target.value }))} placeholder={t(trans.workflowControl.workflowDescription)} />
                  <div className="grid grid-cols-2 gap-3">
                    <select value={workflowEditor.triggerMode} onChange={(e) => setWorkflowEditor((p) => ({ ...p, triggerMode: e.target.value as Workflow["triggerMode"] }))} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                      <option value="scheduled">scheduled</option>
                      <option value="manual">manual</option>
                      <option value="event">event</option>
                      <option value="hybrid">hybrid</option>
                    </select>
                    <select value={workflowEditor.aiModel} onChange={(e) => setWorkflowEditor((p) => ({ ...p, aiModel: e.target.value as Workflow["aiModel"] }))} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                      <option value="gpt">GPT</option>
                      <option value="claude">Claude</option>
                      <option value="minimax">MiniMax</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input type="number" value={workflowEditor.retryCount} onChange={(e) => setWorkflowEditor((p) => ({ ...p, retryCount: Number(e.target.value) || 0 }))} placeholder={t(trans.workflowControl.retryCount)} />
                    <Input type="number" value={workflowEditor.queueConcurrency} onChange={(e) => setWorkflowEditor((p) => ({ ...p, queueConcurrency: Number(e.target.value) || 1 }))} placeholder={t(trans.workflowControl.queueConcurrency)} />
                    <Input type="number" value={workflowEditor.workerCount} onChange={(e) => setWorkflowEditor((p) => ({ ...p, workerCount: Number(e.target.value) || 1 }))} placeholder={t(trans.workflowControl.workerCount)} />
                  </div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={workflowEditor.isEnabled} onChange={(e) => setWorkflowEditor((p) => ({ ...p, isEnabled: e.target.checked }))} />{t(trans.workflowControl.enableWorkflow)}</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={workflowEditor.alertOnFailure} onChange={(e) => setWorkflowEditor((p) => ({ ...p, alertOnFailure: e.target.checked }))} />{t(trans.workflowControl.alertOnFailure)}</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={workflowEditor.bilingualEnabled} onChange={(e) => setWorkflowEditor((p) => ({ ...p, bilingualEnabled: e.target.checked }))} />{t(trans.workflowControl.bilingualSwitch)}</label>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 space-y-3">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{t(trans.workflowControl.failureAlertRules)}</div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={workflowEditor.alertEmailEnabled}
                          onChange={(e) => setWorkflowEditor((p) => ({ ...p, alertEmailEnabled: e.target.checked }))}
                        />
                        {t(trans.workflowControl.emailAlert)}
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={workflowEditor.alertWebhookEnabled}
                          onChange={(e) => setWorkflowEditor((p) => ({ ...p, alertWebhookEnabled: e.target.checked }))}
                        />
                        {t(trans.workflowControl.webhookAlert)}
                      </label>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        type="number"
                        value={workflowEditor.alertConsecutiveFailures}
                        onChange={(e) => setWorkflowEditor((p) => ({ ...p, alertConsecutiveFailures: Number(e.target.value) || 1 }))}
                        placeholder={t(trans.workflowControl.consecutiveFailureThreshold)}
                      />
                      <Input
                        type="number"
                        value={workflowEditor.alertSilenceMinutes}
                        onChange={(e) => setWorkflowEditor((p) => ({ ...p, alertSilenceMinutes: Number(e.target.value) || 0 }))}
                        placeholder={t(trans.workflowControl.silenceWindowMinutes)}
                      />
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 space-y-3">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{t(trans.workflowControl.dataFilterStrategy)}</div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={workflowEditor.filterWeightScoring}
                          onChange={(e) => setWorkflowEditor((p) => ({ ...p, filterWeightScoring: e.target.checked }))}
                        />
                        {t(trans.workflowControl.enableWeightScoring)}
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={workflowEditor.filterContentRelevance}
                          onChange={(e) => setWorkflowEditor((p) => ({ ...p, filterContentRelevance: e.target.checked }))}
                        />
                        {t(trans.workflowControl.enableContentRelevance)}
                      </label>
                    </div>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      value={workflowEditor.filterMinScore}
                      onChange={(e) => setWorkflowEditor((p) => ({ ...p, filterMinScore: Number(e.target.value) || 0 }))}
                      placeholder={t(trans.workflowControl.minimumScoreThreshold)}
                    />
                    <Input
                      value={workflowEditor.filterIncludeKeywords}
                      onChange={(e) => setWorkflowEditor((p) => ({ ...p, filterIncludeKeywords: e.target.value }))}
                      placeholder={t(trans.workflowControl.includeKeywords)}
                    />
                    <Input
                      value={workflowEditor.filterExcludeKeywords}
                      onChange={(e) => setWorkflowEditor((p) => ({ ...p, filterExcludeKeywords: e.target.value }))}
                      placeholder={t(trans.workflowControl.excludeKeywords)}
                    />
                  </div>
                  <Button onClick={saveWorkflowSettings} disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{t(trans.workflowControl.saveWorkflowSettings)}</Button>
                </div>
              )}

              {modal === "prompt-settings" && (
                <div className="space-y-3">
                  <Input value={promptEditor.name} onChange={(e) => setPromptEditor((p) => ({ ...p, name: e.target.value }))} placeholder={t(trans.workflowControl.promptName)} />
                  <textarea rows={8} value={promptEditor.content} onChange={(e) => setPromptEditor((p) => ({ ...p, content: e.target.value }))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" placeholder={t(trans.workflowControl.promptContent)} />
                  <div className="grid grid-cols-2 gap-3">
                    <select value={promptEditor.model} onChange={(e) => setPromptEditor((p) => ({ ...p, model: e.target.value as AgentPrompt["model"] }))} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                      <option value="gpt">GPT</option>
                      <option value="claude">Claude</option>
                      <option value="minimax">MiniMax</option>
                    </select>
                    <select value={promptEditor.language} onChange={(e) => setPromptEditor((p) => ({ ...p, language: e.target.value as AgentPrompt["language"] }))} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                      <option value="bilingual">{t(trans.workflowControl.bilingual)}</option>
                      <option value="en">{t(trans.workflowControl.english)}</option>
                      <option value="zh">{t(trans.workflowControl.chinese)}</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={promptEditor.isEnabled} onChange={(e) => setPromptEditor((p) => ({ ...p, isEnabled: e.target.checked }))} />{t(trans.workflowControl.enableThisPrompt)}</label>
                  <Button onClick={savePromptSettings} disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{t(trans.workflowControl.savePrompt)}</Button>
                </div>
              )}

              {modal === "global-settings" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <select value={globalEditor.defaultModel} onChange={(e) => setGlobalEditor((p) => ({ ...p, defaultModel: e.target.value as GlobalSettings["defaultModel"] }))} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                      <option value="gpt">GPT</option>
                      <option value="claude">Claude</option>
                      <option value="minimax">MiniMax</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={globalEditor.bilingualEnabled} onChange={(e) => setGlobalEditor((p) => ({ ...p, bilingualEnabled: e.target.checked }))} />{t(trans.workflowControl.bilingualSwitch)}</label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input type="number" value={globalEditor.globalQueueConcurrency} onChange={(e) => setGlobalEditor((p) => ({ ...p, globalQueueConcurrency: Number(e.target.value) || 1 }))} placeholder={t(trans.workflowControl.globalQueueConcurrency)} />
                    <Input type="number" value={globalEditor.globalWorkerCount} onChange={(e) => setGlobalEditor((p) => ({ ...p, globalWorkerCount: Number(e.target.value) || 1 }))} placeholder={t(trans.workflowControl.globalWorkerCount)} />
                  </div>
                  <Button onClick={saveGlobalSettings} disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{t(trans.workflowControl.saveGlobalStrategy)}</Button>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div className="max-w-6xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t(trans.workflowControl.title)}</h2>
            <p className="text-slate-600 dark:text-slate-400">{t(trans.workflowControl.subtitle)}</p>
          </div>
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />{t(trans.workflowControl.refresh)}
          </Button>
        </div>

        {message && <div className={`p-4 rounded-lg border text-sm font-medium ${message.type === "success" ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400"}`}>{message.text}</div>}

        <div className="flex flex-wrap gap-2">
          {[
            { id: "workflows", label: t(trans.workflowControl.tabWorkflows) },
            { id: "runs", label: t(trans.workflowControl.tabRuns) },
            { id: "errors", label: t(trans.workflowControl.tabErrors) },
            { id: "strategy", label: t(trans.workflowControl.tabStrategies) },
            { id: "prompts", label: t(trans.workflowControl.tabPrompts) },
          ].map((x) => (
            <button key={x.id} onClick={() => setTab(x.id as WorkflowTab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === x.id ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>{x.label}</button>
          ))}
        </div>

        {tab === "workflows" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="text-sm text-slate-500">{t(trans.workflowControl.workflowsHint)}</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2">{t(trans.workflowControl.workflow)}</th>
                    <th className="py-2">{t(trans.workflowControl.triggerMode)}</th>
                    <th className="py-2">{t(trans.workflowControl.status)}</th>
                    <th className="py-2">{t(trans.workflowControl.modelLanguage)}</th>
                    <th className="py-2">{t(trans.workflowControl.actions)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {workflows.map((w) => (
                    <tr key={w.id}>
                      <td className="py-2">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{w.name}</div>
                        <div className="text-xs text-slate-500">{w.code}</div>
                      </td>
                      <td className="py-2">{w.triggerMode}</td>
                      <td className="py-2">{w.isEnabled ? t(trans.workflowControl.enabled) : t(trans.workflowControl.disabled)}</td>
                      <td className="py-2">{w.aiModel} / {w.bilingualEnabled ? t(trans.workflowControl.bilingual) : t(trans.workflowControl.single)}</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => toggleWorkflow(w)}>{w.isEnabled ? t(trans.workflowControl.disable) : t(trans.workflowControl.enable)}</Button>
                          <Button size="sm" variant="outline" onClick={() => triggerRun(w.id)}><Play className="h-4 w-4 mr-1" />{t(trans.workflowControl.triggerOnce)}</Button>
                          <Button size="sm" variant="outline" onClick={() => openWorkflowSettings(w)}><Settings className="h-4 w-4 mr-1" />{t(trans.workflowControl.configure)}</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "runs" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500"><th className="py-2">{t(trans.workflowControl.time)}</th><th className="py-2">{t(trans.workflowControl.workflow)}</th><th className="py-2">{t(trans.workflowControl.trigger)}</th><th className="py-2">{t(trans.workflowControl.status)}</th><th className="py-2">{t(trans.workflowControl.durationMs)}</th><th className="py-2">{t(trans.workflowControl.error)}</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {runs.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="py-2">{r.workflowName}</td>
                    <td className="py-2">{r.triggerType}</td>
                    <td className="py-2">{r.status}</td>
                    <td className="py-2">{r.durationMs ?? "-"}</td>
                    <td className="py-2">{r.errorMessage || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "errors" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500"><th className="py-2">{t(trans.workflowControl.time)}</th><th className="py-2">{t(trans.workflowControl.workflow)}</th><th className="py-2">{t(trans.workflowControl.level)}</th><th className="py-2">{t(trans.workflowControl.message)}</th><th className="py-2">{t(trans.workflowControl.run)}</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {errors.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2">{new Date(e.createdAt).toLocaleString()}</td>
                    <td className="py-2">{e.workflowName}</td>
                    <td className="py-2">{e.level}</td>
                    <td className="py-2">{e.message}</td>
                    <td className="py-2">{e.runId ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "strategy" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <div className="text-xs text-slate-500">{t(trans.workflowControl.globalDefaultModel)}</div>
                <div className="font-semibold">{globalSettings?.defaultModel || "-"}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <div className="text-xs text-slate-500">{t(trans.workflowControl.bilingualSwitch)}</div>
                <div className="font-semibold">{globalSettings?.bilingualEnabled ? t(trans.workflowControl.on) : t(trans.workflowControl.off)}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <div className="text-xs text-slate-500">{t(trans.workflowControl.globalQueueConcurrency)}</div>
                <div className="font-semibold">{globalSettings?.globalQueueConcurrency ?? "-"}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <div className="text-xs text-slate-500">{t(trans.workflowControl.globalWorkerCount)}</div>
                <div className="font-semibold">{globalSettings?.globalWorkerCount ?? "-"}</div>
              </div>
            </div>
            <Button onClick={() => setModal("global-settings")} className="bg-blue-600 hover:bg-blue-700 text-white"><Siren className="h-4 w-4 mr-1" />{t(trans.workflowControl.editStrategy)}</Button>
          </div>
        )}

        {tab === "prompts" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="text-sm text-slate-500 flex items-center gap-2"><Bot className="h-4 w-4" />{t(trans.workflowControl.promptsHint)}</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500"><th className="py-2">{t(trans.workflowControl.type)}</th><th className="py-2">{t(trans.workflowControl.name)}</th><th className="py-2">{t(trans.workflowControl.workflow)}</th><th className="py-2">{t(trans.workflowControl.model)}</th><th className="py-2">{t(trans.workflowControl.language)}</th><th className="py-2">{t(trans.workflowControl.actions)}</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {prompts.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2">{p.promptType}</td>
                      <td className="py-2">{p.name}</td>
                      <td className="py-2">{p.workflowName || t(trans.workflowControl.global)}</td>
                      <td className="py-2">{p.model}</td>
                      <td className="py-2">{p.language}</td>
                      <td className="py-2">
                        <Button size="sm" variant="outline" onClick={() => openPromptSettings(p)}>
                          <Languages className="h-4 w-4 mr-1" />{t(trans.workflowControl.editPrompt)}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {modalNode}
    </>
  );
}
