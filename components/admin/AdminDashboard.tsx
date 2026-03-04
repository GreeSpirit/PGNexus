"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Server, Database, Activity, Users, BellRing, AlertTriangle, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

type ServiceStatus = "up" | "down" | "unknown";

type AdminDashboardOverview = {
  systemStatus: {
    app: ServiceStatus;
    database: ServiceStatus;
    n8n: ServiceStatus;
  };
  fetchedToday: {
    total: number;
    rss: number;
    email: number;
    news: number;
  };
  feedCounts: {
    today: number;
    week: number;
    month: number;
  };
  errorTasks: {
    today: number;
    total: number;
  };
  userGrowth: {
    todayNew: number;
    weekNew: number;
    monthNew: number;
    trend14d: Array<{ date: string; count: number }>;
  };
  activeSubscriptions: {
    activeUsers: number;
    totalSubscriptions: number;
  };
  apiCalls: {
    today: number;
    total: number;
  };
  dataSourceHealth: {
    score: number;
    healthy: number;
    warning: number;
    critical: number;
  };
  queueBacklog: {
    queued: number;
    running: number;
    failedToday: number;
  };
  lastUpdatedAt: string;
};

function statusBadge(status: ServiceStatus) {
  if (status === "up") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  if (status === "down") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [data, setData] = useState<AdminDashboardOverview | null>(null);

  // Pull aggregated admin metrics for all dashboard cards.
  const refresh = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/dashboard/overview", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load admin dashboard");
      setData(json as AdminDashboardOverview);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t(trans.adminDashboard.loadFailed));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Compute chart scaling baseline from recent trend data.
  const maxTrend = useMemo(() => {
    if (!data?.userGrowth.trend14d?.length) return 1;
    return Math.max(1, ...data.userGrowth.trend14d.map((x) => x.count));
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t(trans.adminDashboard.title)}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {t(trans.adminDashboard.subtitle)}
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {t(trans.adminDashboard.refresh)}
        </Button>
      </div>

      {message && (
        <div className="p-3 rounded-lg border border-red-200 text-red-700 bg-red-50 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400 text-sm">
          {message}
        </div>
      )}

      {!data ? null : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Server className="h-4 w-4" />
                {t(trans.adminDashboard.systemRuntimeStatus)}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className={`px-2 py-1 rounded ${statusBadge(data.systemStatus.app)}`}>App: {data.systemStatus.app}</span>
                <span className={`px-2 py-1 rounded ${statusBadge(data.systemStatus.database)}`}>DB: {data.systemStatus.database}</span>
                <span className={`px-2 py-1 rounded ${statusBadge(data.systemStatus.n8n)}`}>n8n: {data.systemStatus.n8n}</span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="text-xs text-slate-500">{t(trans.adminDashboard.fetchedToday)}</div>
              <div className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-200">{data.fetchedToday.total}</div>
              <div className="text-xs text-slate-500 mt-2">
                RSS {data.fetchedToday.rss} / Email {data.fetchedToday.email} / News {data.fetchedToday.news}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="text-xs text-slate-500">{t(trans.adminDashboard.feedCounts)}</div>
              <div className="text-sm mt-2 text-slate-700 dark:text-slate-300">
                {t(trans.adminDashboard.today)}: {data.feedCounts.today} | {t(trans.adminDashboard.thisWeek)}: {data.feedCounts.week} | {t(trans.adminDashboard.thisMonth)}: {data.feedCounts.month}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="text-xs text-slate-500 flex items-center gap-2"><AlertTriangle className="h-4 w-4" />{t(trans.adminDashboard.errorTasks)}</div>
              <div className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-1">{data.errorTasks.today}</div>
              <div className="text-xs text-slate-500">{t(trans.adminDashboard.today)} / {t(trans.adminDashboard.total)} {data.errorTasks.total}</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="text-xs text-slate-500 flex items-center gap-2"><Users className="h-4 w-4" />{t(trans.adminDashboard.userRegistrationGrowth)}</div>
              <div className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-1">+{data.userGrowth.todayNew}</div>
              <div className="text-xs text-slate-500">{t(trans.adminDashboard.d7)} +{data.userGrowth.weekNew} | {t(trans.adminDashboard.monthShort)} +{data.userGrowth.monthNew}</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="text-xs text-slate-500 flex items-center gap-2"><BellRing className="h-4 w-4" />{t(trans.adminDashboard.activeSubscriptionUsers)}</div>
              <div className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-1">{data.activeSubscriptions.activeUsers}</div>
              <div className="text-xs text-slate-500">{t(trans.adminDashboard.totalSubscriptions)} {data.activeSubscriptions.totalSubscriptions}</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="text-xs text-slate-500 flex items-center gap-2"><Activity className="h-4 w-4" />{t(trans.adminDashboard.apiCallStats)}</div>
              <div className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-1">{data.apiCalls.today}</div>
              <div className="text-xs text-slate-500">{t(trans.adminDashboard.today)} / {t(trans.adminDashboard.total)} {data.apiCalls.total}</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">{t(trans.adminDashboard.userGrowthTrend14d)}</div>
              <div className="space-y-2">
                {data.userGrowth.trend14d.length === 0 && (
                  <div className="text-xs text-slate-500">{t(trans.adminDashboard.noTrendData)}</div>
                )}
                {data.userGrowth.trend14d.map((row) => (
                  <div key={row.date} className="flex items-center gap-2">
                    <div className="w-24 text-xs text-slate-500">{row.date.slice(5)}</div>
                    <div className="flex-1 h-2 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-2 bg-blue-500" style={{ width: `${(row.count / maxTrend) * 100}%` }} />
                    </div>
                    <div className="w-8 text-right text-xs text-slate-600 dark:text-slate-300">{row.count}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Database className="h-4 w-4" />
                {t(trans.adminDashboard.dataSourceHealthScore)}
              </div>
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">{data.dataSourceHealth.score}</div>
              <div className="text-xs text-slate-500">{t(trans.adminDashboard.healthSplit)} {data.dataSourceHealth.healthy}/{data.dataSourceHealth.warning}/{data.dataSourceHealth.critical}</div>
              <div className="h-2 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-2 bg-emerald-500" style={{ width: `${data.dataSourceHealth.score}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4" />
              {t(trans.adminDashboard.queueBacklogStatus)}
            </div>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3">{t(trans.adminDashboard.queued)}: <b>{data.queueBacklog.queued}</b></div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3">{t(trans.adminDashboard.running)}: <b>{data.queueBacklog.running}</b></div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3">{t(trans.adminDashboard.failedToday)}: <b>{data.queueBacklog.failedToday}</b></div>
            </div>
            <div className="text-xs text-slate-500 mt-3">
              {t(trans.adminDashboard.lastUpdated)}: {new Date(data.lastUpdatedAt).toLocaleString()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
