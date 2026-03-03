"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2, Search, X, FileCode2, Tag,
  AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp,
  Code2, FileText, HelpCircle, ShieldAlert, Layers,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

// ── Types ────────────────────────────────────────────────────────────────────

interface PatchListItem {
  jobid: number;
  threadid: string;
  messageid: string;
  patchfile: string;
}

interface AreaInfo {
  involved: boolean;
  objects?: string[];
  names?: string[];
  symbols?: string[];
  evidence?: string;
  evidence_zh?: string;
}

interface KeyFunctionChange {
  symbol: string;
  change_type: string;
  what_changed?: string;
  what_changed_zh?: string;
  evidence?: string;
  evidence_zh?: string;
}

interface NotableHunk {
  contextHeader: string;
  what_it_does?: string;
  what_it_does_zh?: string;
  added?: number;
  removed?: number;
}

interface FileSummary {
  path: string;
  summary?: string;
  summary_zh?: string;
  notable_hunks?: NotableHunk[];
}

interface TestsAndDocsSection {
  yes: boolean;
  files?: string[];
  evidence?: string;
  evidence_zh?: string;
}

interface KeyConcern {
  concern: string;
  severity: "high" | "medium" | "low";
  why?: string;
  why_zh?: string;
  suggested_check?: string;
  suggested_check_zh?: string;
}

interface PatchDetailsData {
  patchName?: string;
  change_metrics?: {
    filesChangedCount?: number;
    filesChanged?: string[];
    addedTotal?: number;
    removedTotal?: number;
    hunksTotal?: number;
  };
  areas_touched?: Record<string, AreaInfo>;
  key_function_changes?: KeyFunctionChange[];
  file_summaries?: FileSummary[];
  tests_and_docs?: {
    regression_tests_changed?: TestsAndDocsSection;
    documentation_changed?: TestsAndDocsSection;
  };
  key_concerns?: KeyConcern[];
  reviewer_questions?: string[];
  reviewer_questions_zh?: string[];
  tracking_tags?: string[];
}

interface PatchDetailFull extends PatchListItem {
  summary: string | null;
  summary_zh: string | null;
  risk: string | null;
  risk_zh: string | null;
  details: PatchDetailsData[] | null;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const AREAS_CONFIG: { key: string; en: string; zh: string }[] = [
  { key: "catalog", en: "System Catalog", zh: "系统目录" },
  { key: "wal", en: "Write-Ahead Log (WAL)", zh: "预写日志 (WAL)" },
  { key: "locking", en: "Locking", zh: "锁机制" },
  { key: "guc", en: "GUC Parameters", zh: "GUC 参数" },
  { key: "replication", en: "Replication", zh: "复制" },
  { key: "logical_decoding_or_slots", en: "Logical Decoding / Slots", zh: "逻辑解码 / 槽" },
  { key: "extension_visible_api", en: "Extension-Visible API", zh: "扩展可见 API" },
];

const SEVERITY_STYLES: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-800",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
  low: "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400 border border-green-200 dark:border-green-800",
};

const CHANGE_TYPE_STYLES: Record<string, string> = {
  modified: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400",
  added: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
  removed: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400",
  deleted: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-blue-600 dark:text-blue-400">{icon}</span>
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{children}</h3>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 bg-slate-50/30 dark:bg-slate-800/30">
      {children}
    </div>
  );
}

function FileSummaryCard({ file, language }: { file: FileSummary; language: string }) {
  const [open, setOpen] = useState(false);
  const hunks = file.notable_hunks ?? [];

  return (
    <div className="border border-slate-200/60 dark:border-slate-700/60 rounded-lg overflow-hidden">
      <div className="bg-slate-100/60 dark:bg-slate-800/60 px-4 py-2">
        <code className="text-xs text-slate-700 dark:text-slate-300 break-all">{file.path}</code>
      </div>
      <div className="p-4">
        {(file.summary || file.summary_zh) && (
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
            {language === "zh" ? file.summary_zh || file.summary : file.summary || file.summary_zh}
          </p>
        )}
        {hunks.length > 0 && (
          <>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer mb-2"
            >
              {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {open ? "Hide" : "Show"} {hunks.length} notable {hunks.length === 1 ? "change" : "changes"}
            </button>
            {open && (
              <div className="space-y-2">
                {hunks.map((hunk, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 rounded-lg p-3">
                    <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mb-1">{hunk.contextHeader}</div>
                    {(hunk.what_it_does || hunk.what_it_does_zh) && (
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {language === "zh" ? hunk.what_it_does_zh || hunk.what_it_does : hunk.what_it_does || hunk.what_it_does_zh}
                      </p>
                    )}
                    {(hunk.added !== undefined || hunk.removed !== undefined) && (
                      <div className="flex gap-2 mt-1">
                        {hunk.added !== undefined && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400">+{hunk.added} added</span>
                        )}
                        {hunk.removed !== undefined && (
                          <span className="text-xs text-red-500 dark:text-red-400">-{hunk.removed} removed</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function PatchDetailPanel({ patch, language, t }: { patch: PatchDetailFull; language: string; t: (v: { en: string; zh: string }) => string }) {
  const p = trans.communityPatchesPage;
  const data: PatchDetailsData | null = patch.details?.[0] ?? null;

  const involvedAreas = AREAS_CONFIG.filter(
    (a) => data?.areas_touched?.[a.key]?.involved === true
  );
  const notInvolvedAreas = AREAS_CONFIG.filter(
    (a) => !involvedAreas.includes(a)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200/60 dark:border-slate-700/60">
        <code className="text-base font-bold text-amber-700 dark:text-amber-400 break-all leading-relaxed">
          {patch.patchfile}
        </code>
      </div>

      {/* Summary */}
      {(patch.summary || patch.summary_zh) && (
        <SectionCard>
          <SectionHeading icon={<FileText className="h-4 w-4" />}>{t(p.summary)}</SectionHeading>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {language === "zh" ? patch.summary_zh || patch.summary : patch.summary || patch.summary_zh}
          </p>
        </SectionCard>
      )}

      {/* Risk */}
      {(patch.risk || patch.risk_zh) && (
        <SectionCard>
          <SectionHeading icon={<ShieldAlert className="h-4 w-4" />}>{t(p.risk)}</SectionHeading>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {language === "zh" ? patch.risk_zh || patch.risk : patch.risk || patch.risk_zh}
          </p>
        </SectionCard>
      )}

      {data && (
        <>
          {/* Change Metrics */}
          {data.change_metrics && (
            <SectionCard>
              <SectionHeading icon={<Code2 className="h-4 w-4" />}>{t(p.changeMetrics)}</SectionHeading>
              <div className="flex flex-wrap gap-2 mb-4">
                {data.change_metrics.filesChangedCount !== undefined && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400">
                    {data.change_metrics.filesChangedCount} {t(p.filesChanged)}
                  </span>
                )}
                {data.change_metrics.addedTotal !== undefined && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                    +{data.change_metrics.addedTotal} {t(p.addedLines)}
                  </span>
                )}
                {data.change_metrics.removedTotal !== undefined && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400">
                    -{data.change_metrics.removedTotal} {t(p.removedLines)}
                  </span>
                )}
                {data.change_metrics.hunksTotal !== undefined && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {data.change_metrics.hunksTotal} hunks
                  </span>
                )}
              </div>
              {data.change_metrics.filesChanged && data.change_metrics.filesChanged.length > 0 && (
                <div className="space-y-1">
                  {data.change_metrics.filesChanged.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <FileCode2 className="h-3 w-3 text-slate-400 shrink-0" />
                      <code className="text-xs text-slate-600 dark:text-slate-400 break-all">{f}</code>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          )}

          {/* Areas Touched */}
          {data.areas_touched && (
            <SectionCard>
              <SectionHeading icon={<Layers className="h-4 w-4" />}>{t(p.areasTouched)}</SectionHeading>
              <div className="space-y-3">
                {involvedAreas.map((area) => {
                  const info = data.areas_touched![area.key];
                  const evidence = language === "zh" ? info?.evidence_zh || info?.evidence : info?.evidence || info?.evidence_zh;
                  return (
                    <div key={area.key} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {language === "zh" ? area.zh : area.en}
                        </span>
                        {evidence && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{evidence}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
                {notInvolvedAreas.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {notInvolvedAreas.map((area) => (
                      <span key={area.key} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800/50">
                        <XCircle className="h-3 w-3" />
                        {language === "zh" ? area.zh : area.en}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Key Function Changes */}
          {data.key_function_changes && data.key_function_changes.length > 0 && (
            <SectionCard>
              <SectionHeading icon={<Code2 className="h-4 w-4" />}>{t(p.keyFunctionChanges)}</SectionHeading>
              <div className="space-y-4">
                {data.key_function_changes.map((fn, i) => {
                  const whatChanged = language === "zh" ? fn.what_changed_zh || fn.what_changed : fn.what_changed || fn.what_changed_zh;
                  const evidence = language === "zh" ? fn.evidence_zh || fn.evidence : fn.evidence || fn.evidence_zh;
                  const typeStyle = CHANGE_TYPE_STYLES[fn.change_type] ?? CHANGE_TYPE_STYLES.modified;
                  return (
                    <div key={i} className="border-l-2 border-blue-400 dark:border-blue-600 pl-3">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <code className="text-sm font-bold text-slate-900 dark:text-slate-100">{fn.symbol}</code>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeStyle}`}>
                          {fn.change_type}
                        </span>
                      </div>
                      {whatChanged && (
                        <p className="text-sm text-slate-700 dark:text-slate-300">{whatChanged}</p>
                      )}
                      {evidence && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1">{evidence}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {/* File Summaries */}
          {data.file_summaries && data.file_summaries.length > 0 && (
            <SectionCard>
              <SectionHeading icon={<FileText className="h-4 w-4" />}>{t(p.fileSummaries)}</SectionHeading>
              <div className="space-y-3">
                {data.file_summaries.map((file, i) => (
                  <FileSummaryCard key={i} file={file} language={language} />
                ))}
              </div>
            </SectionCard>
          )}

          {/* Tests & Docs */}
          {data.tests_and_docs && (
            <SectionCard>
              <SectionHeading icon={<CheckCircle2 className="h-4 w-4" />}>{t(p.testsAndDocs)}</SectionHeading>
              <div className="space-y-3">
                {data.tests_and_docs.regression_tests_changed && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t(p.regressionTests)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${data.tests_and_docs.regression_tests_changed.yes ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                        {data.tests_and_docs.regression_tests_changed.yes ? t(p.yes) : t(p.no)}
                      </span>
                    </div>
                    {(() => {
                      const ev = language === "zh"
                        ? data.tests_and_docs!.regression_tests_changed!.evidence_zh || data.tests_and_docs!.regression_tests_changed!.evidence
                        : data.tests_and_docs!.regression_tests_changed!.evidence || data.tests_and_docs!.regression_tests_changed!.evidence_zh;
                      return ev ? <p className="text-xs text-slate-500 dark:text-slate-400">{ev}</p> : null;
                    })()}
                    {data.tests_and_docs.regression_tests_changed.files && data.tests_and_docs.regression_tests_changed.files.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {data.tests_and_docs.regression_tests_changed.files.map((f, i) => (
                          <code key={i} className="block text-xs text-slate-600 dark:text-slate-400">{f}</code>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {data.tests_and_docs.documentation_changed && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t(p.documentation)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${data.tests_and_docs.documentation_changed.yes ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                        {data.tests_and_docs.documentation_changed.yes ? t(p.yes) : t(p.no)}
                      </span>
                    </div>
                    {(() => {
                      const ev = language === "zh"
                        ? data.tests_and_docs!.documentation_changed!.evidence_zh || data.tests_and_docs!.documentation_changed!.evidence
                        : data.tests_and_docs!.documentation_changed!.evidence || data.tests_and_docs!.documentation_changed!.evidence_zh;
                      return ev ? <p className="text-xs text-slate-500 dark:text-slate-400">{ev}</p> : null;
                    })()}
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Key Concerns */}
          {data.key_concerns && data.key_concerns.length > 0 && (
            <SectionCard>
              <SectionHeading icon={<AlertTriangle className="h-4 w-4" />}>{t(p.keyConcerns)}</SectionHeading>
              <div className="space-y-3">
                {data.key_concerns.map((concern, i) => {
                  const why = language === "zh" ? concern.why_zh || concern.why : concern.why || concern.why_zh;
                  const check = language === "zh" ? concern.suggested_check_zh || concern.suggested_check : concern.suggested_check || concern.suggested_check_zh;
                  const severityStyle = SEVERITY_STYLES[concern.severity] ?? SEVERITY_STYLES.low;
                  return (
                    <div key={i} className="border border-slate-200/60 dark:border-slate-700/60 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{concern.concern}</p>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${severityStyle}`}>
                          {concern.severity}
                        </span>
                      </div>
                      {why && <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{why}</p>}
                      {check && (
                        <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded px-2.5 py-1.5">
                          <span className="text-xs font-medium text-amber-700 dark:text-amber-400">{t(p.suggestedCheck)}: </span>
                          <span className="text-xs text-slate-600 dark:text-slate-400">{check}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {/* Reviewer Questions */}
          {((data.reviewer_questions && data.reviewer_questions.length > 0) ||
            (data.reviewer_questions_zh && data.reviewer_questions_zh.length > 0)) && (
            <SectionCard>
              <SectionHeading icon={<HelpCircle className="h-4 w-4" />}>{t(p.reviewerQuestions)}</SectionHeading>
              <ol className="space-y-2">
                {(language === "zh"
                  ? data.reviewer_questions_zh || data.reviewer_questions
                  : data.reviewer_questions || data.reviewer_questions_zh
                )?.map((q, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{q}</p>
                  </li>
                ))}
              </ol>
            </SectionCard>
          )}

          {/* Tracking Tags */}
          {data.tracking_tags && data.tracking_tags.length > 0 && (
            <SectionCard>
              <SectionHeading icon={<Tag className="h-4 w-4" />}>{t(p.trackingTags)}</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {data.tracking_tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}
        </>
      )}

      {!patch.summary && !patch.summary_zh && !data && (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
          {t(p.noDetails)}
        </div>
      )}
    </div>
  );
}

// ── Main Content ──────────────────────────────────────────────────────────────

function CommunityPatchesContent() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const p = trans.communityPatchesPage;

  const [patches, setPatches] = useState<PatchListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedPatch, setSelectedPatch] = useState<PatchListItem | null>(null);
  const [patchDetail, setPatchDetail] = useState<PatchDetailFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(50);

  const fetchPatches = async (q = "", limit = 50) => {
    try {
      setIsLoading(true);
      const url = q
        ? `/api/patch-reports/list?q=${encodeURIComponent(q)}&limit=${limit}`
        : `/api/patch-reports/list?limit=${limit}`;
      const res = await fetch(url);
      const data = await res.json();
      const list: PatchListItem[] = data.patches ?? [];
      setPatches(list);
      setTotal(data.total ?? 0);

      // Auto-select first on initial load or after URL param
      const patchfileParam = searchParams.get("patchfile");
      const jobidParam = searchParams.get("jobid");
      const threadidParam = searchParams.get("threadid");

      if (patchfileParam && jobidParam && threadidParam) {
        const target = list.find(
          (p) =>
            p.patchfile === patchfileParam &&
            String(p.jobid) === jobidParam &&
            p.threadid === threadidParam
        );
        if (target) {
          await handlePatchSelect(target);
          return;
        }
      }

      if (list.length > 0 && !selectedPatch) {
        await handlePatchSelect(list[0]);
      }
    } catch (err) {
      console.error("Error fetching patches:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatchSelect = async (item: PatchListItem) => {
    setSelectedPatch(item);
    setPatchDetail(null);
    setIsLoadingDetail(true);
    try {
      const res = await fetch(
        `/api/patch-reports/detail?jobid=${item.jobid}&patchfile=${encodeURIComponent(item.patchfile)}&threadid=${encodeURIComponent(item.threadid)}`
      );
      const data = await res.json();
      setPatchDetail(data.patch ?? null);
    } catch (err) {
      console.error("Error fetching patch detail:", err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q) {
      setSearchQuery(q);
      setIsSearchMode(true);
      setSelectedPatch(null);
      setPatchDetail(null);
      fetchPatches(q, displayLimit);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setIsSearchMode(false);
    setSelectedPatch(null);
    setPatchDetail(null);
    fetchPatches("", displayLimit);
  };

  const handleLoadMore = () => {
    const newLimit = displayLimit + 50;
    setDisplayLimit(newLimit);
    fetchPatches(searchQuery, newLimit);
  };

  useEffect(() => {
    fetchPatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasMore = patches.length < total;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
          {t(p.title)}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
          {t(p.subtitle)}
        </p>
      </div>

      {patches.length === 0 ? (
        <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-12 text-center">
          <FileCode2 className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {t(p.noPatches)}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {isSearchMode
              ? `${t(p.noPatchesSearch)} "${searchQuery}"`
              : t(p.noPatchesAvailable)}
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 lg:shrink-0">
            <div className="lg:sticky lg:top-24 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={t(p.searchPlaceholder)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-100 placeholder:text-slate-400"
                  />
                </div>
                {isSearchMode && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mt-2 w-full text-center px-3 py-1.5 rounded-lg transition-all cursor-pointer text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  >
                    <X className="h-3 w-3 inline mr-1" />
                    {t(p.clearSearch)}
                  </button>
                )}
              </form>

              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 px-2">
                {t(p.patchesCount)} ({total})
              </h2>

              <div className="space-y-1 max-h-[300px] lg:max-h-[calc(100vh-350px)] overflow-y-auto">
                {patches.map((item) => {
                  const isActive =
                    selectedPatch?.patchfile === item.patchfile &&
                    selectedPatch?.jobid === item.jobid &&
                    selectedPatch?.threadid === item.threadid;
                  return (
                    <button
                      key={`${item.jobid}-${item.threadid}-${item.patchfile}`}
                      onClick={() => handlePatchSelect(item)}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-all cursor-pointer text-sm ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <FileCode2 className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                        <code className={`text-xs break-all leading-relaxed ${isActive ? "text-white" : "text-amber-700 dark:text-amber-400"}`}>
                          {item.patchfile}
                        </code>
                      </div>
                    </button>
                  );
                })}

                {hasMore && (
                  <button
                    onClick={handleLoadMore}
                    className="w-full text-center px-3 py-2 mt-2 rounded-lg transition-all cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-medium"
                  >
                    {t(p.loadMore)} ({total - patches.length} {t(p.remaining)})
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {selectedPatch ? (
              <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-4 sm:p-8">
                {isLoadingDetail ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : patchDetail ? (
                  <PatchDetailPanel patch={patchDetail} language={language} t={t} />
                ) : (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    {t(p.noDetails)}
                  </div>
                )}
              </div>
            ) : (
              <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-12 text-center">
                <FileCode2 className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {t(p.selectPatch)}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {t(p.selectPatchSubtext)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommunityPatchesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <CommunityPatchesContent />
    </Suspense>
  );
}
