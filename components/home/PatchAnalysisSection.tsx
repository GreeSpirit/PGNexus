"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { FileCode2, ShieldAlert, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

ChartJS.register(ArcElement, Tooltip, Legend);

const AREAS: Record<string, { en: string; zh: string; color: string }> = {
  catalog:                   { en: "System Catalog",   zh: "系统目录", color: "rgb(59,130,246)"  },
  wal:                       { en: "WAL",              zh: "预写日志", color: "rgb(168,85,247)"  },
  locking:                   { en: "Locking",          zh: "锁机制",   color: "rgb(249,115,22)"  },
  guc:                       { en: "GUC",              zh: "GUC 参数", color: "rgb(34,197,94)"   },
  replication:               { en: "Replication",      zh: "复制",     color: "rgb(6,182,212)"   },
  logical_decoding_or_slots: { en: "Logical Decoding", zh: "逻辑解码", color: "rgb(236,72,153)"  },
  extension_visible_api:     { en: "Extension API",    zh: "扩展 API", color: "rgb(234,179,8)"   },
};

interface AreaDatum   { key: string; count: number }
interface RecentPatch {
  jobid: number;
  threadid: string;
  messageid: string;
  patchfile: string;
  summary?: string;
  summary_zh?: string;
  risk?: string;
  risk_zh?: string;
}

function riskBadgeClass(risk: string): string {
  const r = risk.toLowerCase();
  if (r.includes("low"))                          return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
  if (r.includes("medium") || r.includes("moderate")) return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
  if (r.includes("high") || r.includes("critical"))   return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

function patchDeepLink(p: RecentPatch) {
  return (
    `/community-patches?jobid=${p.jobid}` +
    `&patchfile=${encodeURIComponent(p.patchfile)}` +
    `&threadid=${encodeURIComponent(p.threadid)}`
  );
}

const PANEL = "backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-6";

export function PatchAnalysisSection() {
  const { t, language } = useLanguage();
  const [totalPatches,  setTotalPatches]  = useState<number | null>(null);
  const [areasData,     setAreasData]     = useState<AreaDatum[]>([]);
  const [recentPatches, setRecentPatches] = useState<RecentPatch[]>([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/patch-reports/stats");
        if (res.ok) {
          const data = await res.json();
          setTotalPatches(data.totalPatches ?? 0);
          setAreasData(data.areasData ?? []);
          setRecentPatches(data.recentPatches ?? []);
        }
      } catch (err) {
        console.error("Error fetching patch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const chartData = {
    labels: areasData.map((a) =>
      language === "zh" ? (AREAS[a.key]?.zh ?? a.key) : (AREAS[a.key]?.en ?? a.key)
    ),
    datasets: [
      {
        data:            areasData.map((a) => a.count),
        backgroundColor: areasData.map((a) => AREAS[a.key]?.color ?? "rgb(148,163,184)"),
        borderColor:     areasData.map((a) => AREAS[a.key]?.color ?? "rgb(148,163,184)"),
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        labels: {
          usePointStyle: true,
          padding: 12,
          font: { size: 12 },
          color: "rgb(100,116,139)",
          boxWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 10,
        cornerRadius: 8,
        callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.raw} patches` },
      },
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${PANEL} flex items-center justify-center min-h-[380px]`}>
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <div className={`${PANEL} flex items-center justify-center min-h-[380px]`}>
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ── Left: Patch Statistics ─────────────────────────────────────────── */}
      <div className={`${PANEL} flex flex-col`}>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          {t(trans.homePage.patchStatisticsTitle)}
        </h3>

        {/* Total count */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center shadow-md">
            <FileCode2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              {totalPatches?.toLocaleString() ?? "—"}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {t(trans.homePage.patchesAnalyzed)}
            </div>
          </div>
        </div>

        {/* Areas distribution sub-label */}
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
          {t(trans.homePage.areasDistribution)}
        </p>

        {areasData.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            {t(trans.homePage.noAreasData)}
          </p>
        ) : (
          <div className="flex-1 min-h-[200px]">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        )}
      </div>

      {/* ── Right: Recently Analyzed ───────────────────────────────────────── */}
      <div className={`${PANEL} flex flex-col`}>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          {t(trans.homePage.recentAnalyses)}
        </h3>

        <div className="flex-1 flex flex-col justify-between divide-y divide-slate-200/60 dark:divide-slate-700/60">
          {recentPatches.map((patch) => {
            const summary = language === "zh" && patch.summary_zh ? patch.summary_zh : patch.summary;
            const risk    = language === "zh" && patch.risk_zh    ? patch.risk_zh    : patch.risk;
            const name    = patch.patchfile.replace(/^v\d+-\d+-/, "").replace(/\.patch$/, "");
            const link    = patchDeepLink(patch);

            return (
              <Link
                key={`${patch.jobid}-${patch.patchfile}`}
                href={link}
                className="block py-4 first:pt-0 last:pb-0 -mx-2 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                {/* Name */}
                <div className="flex items-start gap-2 mb-1.5">
                  <FileCode2 className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {name}
                  </span>
                </div>

                {/* Summary */}
                {summary && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2 ml-6">
                    {summary}
                  </p>
                )}

                {/* Risk badge */}
                {risk && (
                  <div className="ml-6">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${riskBadgeClass(risk)}`}>
                      <ShieldAlert className="h-3 w-3" />
                      {risk}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
