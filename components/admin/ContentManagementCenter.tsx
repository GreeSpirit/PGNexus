"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";
import { RefreshCw, Plus, Pencil, Sparkles, Pin, PinOff, EyeOff, Eye, Trash2, RotateCcw } from "lucide-react";

type CmTab = "feeds" | "review" | "tags-categories" | "auto-rules" | "hacker-debug";
type CmModal = null | "edit-item" | "tag" | "category" | "rule" | "debug";

interface CmItem {
  id: number;
  contentType: string;
  title: string;
  body: string | null;
  blogSummary: string | null;
  emailSummary: string | null;
  patchSummary: string | null;
  newsSummary: string | null;
  status: string;
  reviewStatus: string;
  trustScore: number;
  credibilityScore: number;
  isPinned: boolean;
  isHidden: boolean;
  deletedAt: string | null;
  tags: string[];
  categories: string[];
}

interface CmQueueItem {
  id: number;
  contentType: string;
  title: string;
  reviewStatus: string;
  status: string;
  createdAt: string;
}

interface CmTag { id: number; name: string; color: string | null }
interface CmCategory { id: number; name: string; description: string | null }
interface CmRule {
  id: number;
  name: string;
  contentType: string;
  matchMode: string;
  pattern: string;
  tagId: number;
  tagName: string;
  isEnabled: boolean;
  priority: number;
}
interface CmDebug {
  id: number;
  threadid: string | null;
  subject: string | null;
  score: number;
  reason: string | null;
  createdAt: string;
}

const defaultItemEditor = {
  id: 0,
  title: "",
  blogSummary: "",
  emailSummary: "",
  patchSummary: "",
  newsSummary: "",
  trustScore: 0,
  credibilityScore: 0,
  tagIdsText: "",
  categoryIdsText: "",
};

export default function ContentManagementCenter() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<CmTab>("feeds");
  const [modal, setModal] = useState<CmModal>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [items, setItems] = useState<CmItem[]>([]);
  const [queue, setQueue] = useState<CmQueueItem[]>([]);
  const [tags, setTags] = useState<CmTag[]>([]);
  const [categories, setCategories] = useState<CmCategory[]>([]);
  const [rules, setRules] = useState<CmRule[]>([]);
  const [debugRows, setDebugRows] = useState<CmDebug[]>([]);

  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [itemEditor, setItemEditor] = useState(defaultItemEditor);

  const [tagForm, setTagForm] = useState({ id: 0, name: "", color: "#3B82F6" });
  const [categoryForm, setCategoryForm] = useState({ id: 0, name: "", description: "" });
  const [ruleForm, setRuleForm] = useState({ id: 0, name: "", contentType: "all", matchMode: "keyword", pattern: "", tagId: 0, isEnabled: true, priority: 100 });
  const [debugForm, setDebugForm] = useState({ threadid: "", subject: "", score: 0, reason: "" });

  // Load all admin content-center datasets for tabs and dialogs.
  const refresh = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content-management/overview");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load content center");
      setItems(data.items || []);
      setQueue(data.queue || []);
      setTags(data.tags || []);
      setCategories(data.categories || []);
      setRules(data.autoTagRules || []);
      setDebugRows(data.hackerEmailDebug || []);
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : t(trans.contentManagement.loadFailed) });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    setIsClient(true);
    refresh();
  }, [refresh]);

  const tagByName = useMemo(() => new Map(tags.map((t) => [t.name, t.id])), [tags]);
  const categoryByName = useMemo(() => new Map(categories.map((c) => [c.name, c.id])), [categories]);

  // Prefill content editor fields using selected item data.
  const openItemEditor = (item: CmItem) => {
    setItemEditor({
      id: item.id,
      title: item.title,
      blogSummary: item.blogSummary || "",
      emailSummary: item.emailSummary || "",
      patchSummary: item.patchSummary || "",
      newsSummary: item.newsSummary || "",
      trustScore: Number(item.trustScore || 0),
      credibilityScore: Number(item.credibilityScore || 0),
      tagIdsText: item.tags.map((n) => tagByName.get(n)).filter(Boolean).join(","),
      categoryIdsText: item.categories.map((n) => categoryByName.get(n)).filter(Boolean).join(","),
    });
    setModal("edit-item");
  };

  // Persist manual edits for summaries, scores, and tag/category bindings.
  const updateItem = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const tagIds = itemEditor.tagIdsText.split(",").map((s) => Number(s.trim())).filter((n) => Number.isInteger(n) && n > 0);
      const categoryIds = itemEditor.categoryIdsText.split(",").map((s) => Number(s.trim())).filter((n) => Number.isInteger(n) && n > 0);

      const res = await fetch(`/api/admin/content-management/items/${itemEditor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: itemEditor.title,
          blogSummary: itemEditor.blogSummary,
          emailSummary: itemEditor.emailSummary,
          patchSummary: itemEditor.patchSummary,
          newsSummary: itemEditor.newsSummary,
          trustScore: itemEditor.trustScore,
          credibilityScore: itemEditor.credibilityScore,
          tagIds,
          categoryIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t(trans.contentManagement.updateFailed));
      setModal(null);
      setMessage({ type: "success", text: t(trans.contentManagement.contentUpdated) });
      refresh();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : t(trans.contentManagement.updateFailed) });
    } finally {
      setSaving(false);
    }
  };

  // Trigger backend to regenerate AI summary for one content item.
  const rerunAiSummary = async (id: number) => {
    const res = await fetch(`/api/admin/content-management/items/${id}/ai-resummary`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: data.error || t(trans.contentManagement.rerunAiFailed) });
      return;
    }
    setMessage({ type: "success", text: t(trans.contentManagement.rerunAiTriggered) });
    refresh();
  };

  // Generic patch helper for item-level visibility/pin/delete updates.
  const quickAction = async (id: number, payload: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/content-management/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: data.error || t(trans.contentManagement.actionFailed) });
      return;
    }
    refresh();
  };

  // Execute bulk operations for selected content items.
  const batchAction = async (action: "hide" | "unhide" | "pin" | "unpin" | "soft_delete" | "restore") => {
    if (selectedItemIds.length === 0) {
      setMessage({ type: "error", text: t(trans.contentManagement.selectAtLeastOne) });
      return;
    }
    const res = await fetch("/api/admin/content-management/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemIds: selectedItemIds, action }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: data.error || t(trans.contentManagement.batchFailed) });
      return;
    }
    setSelectedItemIds([]);
    setMessage({ type: "success", text: `${t(trans.contentManagement.batchDonePrefix)} ${data.affected} ${t(trans.contentManagement.itemsUnit)}` });
    refresh();
  };

  // Submit moderation decision for user-submitted content.
  const reviewAction = async (contentItemId: number, action: "approve" | "reject" | "request_changes") => {
    const res = await fetch("/api/admin/content-management/moderation/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentItemId, action }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: data.error || t(trans.contentManagement.reviewFailed) });
      return;
    }
    setMessage({ type: "success", text: t(trans.contentManagement.reviewDone) });
    refresh();
  };

  // Create or update a tag definition.
  const saveTag = async () => {
    const isEdit = tagForm.id > 0;
    const url = isEdit ? `/api/admin/content-management/tags/${tagForm.id}` : "/api/admin/content-management/tags";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tagForm.name, color: tagForm.color }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: data.error || t(trans.contentManagement.saveTagFailed) });
      return;
    }
    setModal(null);
    setTagForm({ id: 0, name: "", color: "#3B82F6" });
    refresh();
  };

  // Create or update a category definition.
  const saveCategory = async () => {
    const isEdit = categoryForm.id > 0;
    const url = isEdit ? `/api/admin/content-management/categories/${categoryForm.id}` : "/api/admin/content-management/categories";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryForm.name, description: categoryForm.description }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: data.error || t(trans.contentManagement.saveCategoryFailed) });
      return;
    }
    setModal(null);
    setCategoryForm({ id: 0, name: "", description: "" });
    refresh();
  };

  // Create or update an automatic tagging rule.
  const saveRule = async () => {
    const isEdit = ruleForm.id > 0;
    const url = isEdit ? `/api/admin/content-management/auto-tag-rules/${ruleForm.id}` : "/api/admin/content-management/auto-tag-rules";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ruleForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: data.error || t(trans.contentManagement.saveRuleFailed) });
      return;
    }
    setModal(null);
    setRuleForm({ id: 0, name: "", contentType: "all", matchMode: "keyword", pattern: "", tagId: 0, isEnabled: true, priority: 100 });
    refresh();
  };

  // Append a new hacker-email scoring debug sample.
  const saveDebug = async () => {
    const res = await fetch("/api/admin/content-management/hacker-email-debug", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(debugForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: data.error || t(trans.contentManagement.saveDebugFailed) });
      return;
    }
    setModal(null);
    setDebugForm({ threadid: "", subject: "", score: 0, reason: "" });
    refresh();
  };

  const modalNode = isClient && modal
    ? createPortal(
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/60 p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-5 py-4 backdrop-blur">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {modal === "edit-item" && t(trans.contentManagement.modalEditItem)}
                {modal === "tag" && t(trans.contentManagement.modalTag)}
                {modal === "category" && t(trans.contentManagement.modalCategory)}
                {modal === "rule" && t(trans.contentManagement.modalRule)}
                {modal === "debug" && t(trans.contentManagement.modalDebug)}
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={() => setModal(null)}>{t(trans.contentManagement.close)}</Button>
            </div>
            <div className="max-h-[calc(90vh-72px)] overflow-y-auto space-y-4 px-5 py-4 [scrollbar-width:thin] [scrollbar-color:rgb(148_163_184)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
              {modal === "edit-item" && (
                <div className="space-y-3">
                  <Input value={itemEditor.title} onChange={(e) => setItemEditor((p) => ({ ...p, title: e.target.value }))} placeholder={t(trans.contentManagement.titleField)} />
                  <textarea rows={3} value={itemEditor.blogSummary} onChange={(e) => setItemEditor((p) => ({ ...p, blogSummary: e.target.value }))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" placeholder={t(trans.contentManagement.blogSummary)} />
                  <textarea rows={3} value={itemEditor.emailSummary} onChange={(e) => setItemEditor((p) => ({ ...p, emailSummary: e.target.value }))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" placeholder={t(trans.contentManagement.emailSummary)} />
                  <textarea rows={3} value={itemEditor.patchSummary} onChange={(e) => setItemEditor((p) => ({ ...p, patchSummary: e.target.value }))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" placeholder={t(trans.contentManagement.patchSummary)} />
                  <textarea rows={3} value={itemEditor.newsSummary} onChange={(e) => setItemEditor((p) => ({ ...p, newsSummary: e.target.value }))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" placeholder={t(trans.contentManagement.newsSummary)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input type="number" value={itemEditor.trustScore} onChange={(e) => setItemEditor((p) => ({ ...p, trustScore: Number(e.target.value) || 0 }))} placeholder={t(trans.contentManagement.contentTrustScore)} />
                    <Input type="number" value={itemEditor.credibilityScore} onChange={(e) => setItemEditor((p) => ({ ...p, credibilityScore: Number(e.target.value) || 0 }))} placeholder={t(trans.contentManagement.credibilityScore)} />
                  </div>
                  <Input value={itemEditor.tagIdsText} onChange={(e) => setItemEditor((p) => ({ ...p, tagIdsText: e.target.value }))} placeholder={t(trans.contentManagement.tagIdsCsv)} />
                  <Input value={itemEditor.categoryIdsText} onChange={(e) => setItemEditor((p) => ({ ...p, categoryIdsText: e.target.value }))} placeholder={t(trans.contentManagement.categoryIdsCsv)} />
                  <Button onClick={updateItem} disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{t(trans.contentManagement.saveContent)}</Button>
                </div>
              )}

              {modal === "tag" && (
                <div className="space-y-3">
                  <Input value={tagForm.name} onChange={(e) => setTagForm((p) => ({ ...p, name: e.target.value }))} placeholder={t(trans.contentManagement.tagName)} />
                  <Input value={tagForm.color} onChange={(e) => setTagForm((p) => ({ ...p, color: e.target.value }))} placeholder={t(trans.contentManagement.colorHint)} />
                  <Button onClick={saveTag} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{t(trans.contentManagement.saveTag)}</Button>
                </div>
              )}

              {modal === "category" && (
                <div className="space-y-3">
                  <Input value={categoryForm.name} onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))} placeholder={t(trans.contentManagement.categoryName)} />
                  <Input value={categoryForm.description} onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))} placeholder={t(trans.contentManagement.categoryDescription)} />
                  <Button onClick={saveCategory} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{t(trans.contentManagement.saveCategory)}</Button>
                </div>
              )}

              {modal === "rule" && (
                <div className="space-y-3">
                  <Input value={ruleForm.name} onChange={(e) => setRuleForm((p) => ({ ...p, name: e.target.value }))} placeholder={t(trans.contentManagement.ruleName)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input value={ruleForm.contentType} onChange={(e) => setRuleForm((p) => ({ ...p, contentType: e.target.value }))} placeholder={t(trans.contentManagement.contentTypeHint)} />
                    <Input value={ruleForm.matchMode} onChange={(e) => setRuleForm((p) => ({ ...p, matchMode: e.target.value }))} placeholder={t(trans.contentManagement.matchModeHint)} />
                  </div>
                  <Input value={ruleForm.pattern} onChange={(e) => setRuleForm((p) => ({ ...p, pattern: e.target.value }))} placeholder={t(trans.contentManagement.matchPattern)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input type="number" value={ruleForm.tagId} onChange={(e) => setRuleForm((p) => ({ ...p, tagId: Number(e.target.value) || 0 }))} placeholder={t(trans.contentManagement.tagId)} />
                    <Input type="number" value={ruleForm.priority} onChange={(e) => setRuleForm((p) => ({ ...p, priority: Number(e.target.value) || 100 }))} placeholder={t(trans.contentManagement.priority)} />
                  </div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={ruleForm.isEnabled} onChange={(e) => setRuleForm((p) => ({ ...p, isEnabled: e.target.checked }))} />{t(trans.contentManagement.enableRule)}</label>
                  <Button onClick={saveRule} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{t(trans.contentManagement.saveRule)}</Button>
                </div>
              )}

              {modal === "debug" && (
                <div className="space-y-3">
                  <Input value={debugForm.threadid} onChange={(e) => setDebugForm((p) => ({ ...p, threadid: e.target.value }))} placeholder="threadid" />
                  <Input value={debugForm.subject} onChange={(e) => setDebugForm((p) => ({ ...p, subject: e.target.value }))} placeholder="subject" />
                  <Input type="number" value={debugForm.score} onChange={(e) => setDebugForm((p) => ({ ...p, score: Number(e.target.value) || 0 }))} placeholder="score" />
                  <Input value={debugForm.reason} onChange={(e) => setDebugForm((p) => ({ ...p, reason: e.target.value }))} placeholder="reason" />
                  <Button onClick={saveDebug} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">{t(trans.contentManagement.submitDebugRecord)}</Button>
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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t(trans.contentManagement.title)}</h2>
            <p className="text-slate-600 dark:text-slate-400">{t(trans.contentManagement.subtitle)}</p>
          </div>
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />{t(trans.contentManagement.refresh)}
          </Button>
        </div>

        {message && <div className={`p-4 rounded-lg border text-sm font-medium ${message.type === "success" ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400"}`}>{message.text}</div>}

        <div className="flex flex-wrap gap-2">
          {[
            { id: "feeds", label: t(trans.contentManagement.tabFeedManagement) },
            { id: "review", label: t(trans.contentManagement.tabContentReview) },
            { id: "tags-categories", label: t(trans.contentManagement.tabCategoriesTags) },
            { id: "auto-rules", label: t(trans.contentManagement.modalRule) },
            { id: "hacker-debug", label: t(trans.contentManagement.tabHackerDebug) },
          ].map((x) => (
            <button key={x.id} onClick={() => setTab(x.id as CmTab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === x.id ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>{x.label}</button>
          ))}
        </div>

        {tab === "feeds" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => batchAction("pin")}><Pin className="h-4 w-4 mr-1" />{t(trans.contentManagement.batchPin)}</Button>
              <Button size="sm" variant="outline" onClick={() => batchAction("unpin")}><PinOff className="h-4 w-4 mr-1" />{t(trans.contentManagement.unpin)}</Button>
              <Button size="sm" variant="outline" onClick={() => batchAction("hide")}><EyeOff className="h-4 w-4 mr-1" />{t(trans.contentManagement.batchHide)}</Button>
              <Button size="sm" variant="outline" onClick={() => batchAction("unhide")}><Eye className="h-4 w-4 mr-1" />{t(trans.contentManagement.unhide)}</Button>
              <Button size="sm" variant="outline" onClick={() => batchAction("soft_delete")}><Trash2 className="h-4 w-4 mr-1" />{t(trans.contentManagement.softDelete)}</Button>
              <Button size="sm" variant="outline" onClick={() => batchAction("restore")}><RotateCcw className="h-4 w-4 mr-1" />{t(trans.contentManagement.restore)}</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2"><input type="checkbox" checked={selectedItemIds.length > 0 && selectedItemIds.length === items.length} onChange={(e) => setSelectedItemIds(e.target.checked ? items.map((i) => i.id) : [])} /></th>
                    <th className="py-2">{t(trans.contentManagement.type)}</th>
                    <th className="py-2">{t(trans.contentManagement.titleField)}</th>
                    <th className="py-2">{t(trans.contentManagement.reviewStatus)}</th>
                    <th className="py-2">{t(trans.contentManagement.credibility)}</th>
                    <th className="py-2">{t(trans.contentManagement.actions)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2"><input type="checkbox" checked={selectedItemIds.includes(item.id)} onChange={(e) => setSelectedItemIds((prev) => e.target.checked ? [...prev, item.id] : prev.filter((id) => id !== item.id))} /></td>
                      <td className="py-2">{item.contentType}</td>
                      <td className="py-2 max-w-[420px] truncate">{item.title}</td>
                      <td className="py-2">{item.reviewStatus}</td>
                      <td className="py-2">{item.credibilityScore}</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openItemEditor(item)}><Pencil className="h-4 w-4 mr-1" />{t(trans.contentManagement.edit)}</Button>
                          <Button size="sm" variant="outline" onClick={() => rerunAiSummary(item.id)}><Sparkles className="h-4 w-4 mr-1" />{t(trans.contentManagement.rerunAiSummary)}</Button>
                          <Button size="sm" variant="outline" onClick={() => quickAction(item.id, { isPinned: !item.isPinned })}>{item.isPinned ? t(trans.contentManagement.unpin) : t(trans.contentManagement.pin)}</Button>
                          <Button size="sm" variant="outline" onClick={() => quickAction(item.id, { isHidden: !item.isHidden })}>{item.isHidden ? t(trans.contentManagement.unhide) : t(trans.contentManagement.hide)}</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "review" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t(trans.contentManagement.pendingQueueTitle)}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2">ID</th>
                    <th className="py-2">{t(trans.contentManagement.type)}</th>
                    <th className="py-2">{t(trans.contentManagement.titleField)}</th>
                    <th className="py-2">{t(trans.contentManagement.status)}</th>
                    <th className="py-2">{t(trans.contentManagement.actions)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {queue.map((q) => (
                    <tr key={q.id}>
                      <td className="py-2">{q.id}</td>
                      <td className="py-2">{q.contentType}</td>
                      <td className="py-2">{q.title}</td>
                      <td className="py-2">{q.reviewStatus}</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => reviewAction(q.id, "approve")}>{t(trans.contentManagement.approve)}</Button>
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => reviewAction(q.id, "request_changes")}>{t(trans.contentManagement.requestChanges)}</Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => reviewAction(q.id, "reject")}>{t(trans.contentManagement.reject)}</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "tags-categories" && (
          <div className="grid xl:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t(trans.contentManagement.modalTag)}</h3>
                <Button size="sm" onClick={() => { setTagForm({ id: 0, name: "", color: "#3B82F6" }); setModal("tag"); }}><Plus className="h-4 w-4 mr-1" />{t(trans.contentManagement.newTag)}</Button>
              </div>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
                    <div className="text-sm">#{tag.id} {tag.name}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setTagForm({ id: tag.id, name: tag.name, color: tag.color || "#3B82F6" }); setModal("tag"); }}>{t(trans.contentManagement.edit)}</Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={async () => { await fetch(`/api/admin/content-management/tags/${tag.id}`, { method: "DELETE" }); refresh(); }}>{t(trans.contentManagement.delete)}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t(trans.contentManagement.modalCategory)}</h3>
                <Button size="sm" onClick={() => { setCategoryForm({ id: 0, name: "", description: "" }); setModal("category"); }}><Plus className="h-4 w-4 mr-1" />{t(trans.contentManagement.newCategory)}</Button>
              </div>
              <div className="space-y-2">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
                    <div className="text-sm">#{c.id} {c.name}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setCategoryForm({ id: c.id, name: c.name, description: c.description || "" }); setModal("category"); }}>{t(trans.contentManagement.edit)}</Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={async () => { await fetch(`/api/admin/content-management/categories/${c.id}`, { method: "DELETE" }); refresh(); }}>{t(trans.contentManagement.delete)}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "auto-rules" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t(trans.contentManagement.modalRule)}</h3>
              <Button size="sm" onClick={() => { setRuleForm({ id: 0, name: "", contentType: "all", matchMode: "keyword", pattern: "", tagId: 0, isEnabled: true, priority: 100 }); setModal("rule"); }}><Plus className="h-4 w-4 mr-1" />{t(trans.contentManagement.newRule)}</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500"><th className="py-2">{t(trans.contentManagement.rule)}</th><th className="py-2">{t(trans.contentManagement.match)}</th><th className="py-2">{t(trans.contentManagement.tag)}</th><th className="py-2">{t(trans.contentManagement.status)}</th><th className="py-2">{t(trans.contentManagement.actions)}</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {rules.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2">{r.name}</td>
                      <td className="py-2">{r.matchMode}:{r.pattern}</td>
                      <td className="py-2">{r.tagName}</td>
                      <td className="py-2">{r.isEnabled ? t(trans.contentManagement.enabled) : t(trans.contentManagement.disabled)}</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setRuleForm({ id: r.id, name: r.name, contentType: r.contentType, matchMode: r.matchMode, pattern: r.pattern, tagId: r.tagId, isEnabled: r.isEnabled, priority: r.priority }); setModal("rule"); }}>{t(trans.contentManagement.edit)}</Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={async () => { await fetch(`/api/admin/content-management/auto-tag-rules/${r.id}`, { method: "DELETE" }); refresh(); }}>{t(trans.contentManagement.delete)}</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "hacker-debug" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t(trans.contentManagement.modalDebug)}</h3>
              <Button size="sm" onClick={() => setModal("debug")}><Plus className="h-4 w-4 mr-1" />{t(trans.contentManagement.newDebugRecord)}</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500"><th className="py-2">{t(trans.contentManagement.time)}</th><th className="py-2">threadid</th><th className="py-2">subject</th><th className="py-2">score</th><th className="py-2">reason</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {debugRows.map((d) => (
                    <tr key={d.id}>
                      <td className="py-2">{new Date(d.createdAt).toLocaleString()}</td>
                      <td className="py-2">{d.threadid || "-"}</td>
                      <td className="py-2">{d.subject || "-"}</td>
                      <td className="py-2">{d.score}</td>
                      <td className="py-2">{d.reason || "-"}</td>
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
