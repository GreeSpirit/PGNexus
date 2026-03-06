import { query } from "@/lib/db";

export type ServiceStatus = "up" | "down" | "unknown";

export interface AdminDashboardOverview {
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
}

type NumberRow = { count: string | number | null };

function toInt(value: string | number | null | undefined): number {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function tableExists(tableName: string): Promise<boolean> {
  const result = await query(
    `SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = $1
    ) AS exists`,
    [tableName]
  );
  return Boolean(result.rows[0]?.exists);
}

async function countByDateRange(
  table: string,
  dateExpr: string,
  interval: "today" | "week" | "month"
): Promise<number> {
  if (!(await tableExists(table))) return 0;

  const where =
    interval === "today"
      ? `${dateExpr} >= CURRENT_DATE`
      : interval === "week"
      ? `${dateExpr} >= (CURRENT_DATE - INTERVAL '7 days')`
      : `${dateExpr} >= date_trunc('month', CURRENT_DATE)`;

  const result = await query(`SELECT COUNT(*)::int AS count FROM ${table} WHERE ${where}`);
  const rows = result.rows as NumberRow[];
  return toInt(rows[0]?.count);
}

async function getN8nStatus(): Promise<ServiceStatus> {
  const n8nHealthUrl = process.env.N8N_HEALTH_URL || process.env.N8N_BASE_URL;
  if (!n8nHealthUrl) return "unknown";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const url = n8nHealthUrl.endsWith("/healthz") ? n8nHealthUrl : `${n8nHealthUrl.replace(/\/$/, "")}/healthz`;
    const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timeout);
    return response.ok ? "up" : "down";
  } catch {
    return "down";
  }
}

export async function getAdminDashboardOverview(): Promise<AdminDashboardOverview> {
  let databaseStatus: ServiceStatus = "up";
  try {
    //测试数据库连接，成功则数据库状态为 up，否则为 down
    await query("SELECT 1");
  } catch {
    databaseStatus = "down";
  }
  // 统计 RSS 订阅、邮件讨论和新闻文章在不同时间范围的数量
  const [rssToday, rssWeek, rssMonth] = await Promise.all([
    countByDateRange("rss_feeds", "COALESCE(pubdate, NOW())", "today"),
    countByDateRange("rss_feeds", "COALESCE(pubdate, NOW())", "week"),
    countByDateRange("rss_feeds", "COALESCE(pubdate, NOW())", "month"),
  ]);

  const [emailToday, emailWeek, emailMonth] = await Promise.all([
    countByDateRange("email_feeds", "COALESCE(lastactivity, NOW())", "today"),
    countByDateRange("email_feeds", "COALESCE(lastactivity, NOW())", "week"),
    countByDateRange("email_feeds", "COALESCE(lastactivity, NOW())", "month"),
  ]);

  const [newsToday, newsWeek, newsMonth] = await Promise.all([
    countByDateRange("news_feeds", "COALESCE(pubdate, NOW())", "today"),
    countByDateRange("news_feeds", "COALESCE(pubdate, NOW())", "week"),
    countByDateRange("news_feeds", "COALESCE(pubdate, NOW())", "month"),
  ]);

  const [wfRunsExists, usersExists, subsExists, activityLogsExists, dataSourcesExists] = await Promise.all([
    tableExists("wf_runs"),
    tableExists("users"),
    tableExists("user_subscriptions"),
    tableExists("user_activity_logs"),
    tableExists("data_sources"),
  ]);

  let errorToday = 0;
  let errorTotal = 0;
  let queued = 0;
  let running = 0;
  // 统计工作流运行状态，包括失败、排队和运行中的数量
  if (wfRunsExists) {
    const [todayFailed, allFailed, queuedRows, runningRows] = await Promise.all([
      query(`SELECT COUNT(*)::int AS count FROM wf_runs WHERE status = 'failed' AND created_at >= CURRENT_DATE`),
      query(`SELECT COUNT(*)::int AS count FROM wf_runs WHERE status = 'failed'`),
      query(`SELECT COUNT(*)::int AS count FROM wf_runs WHERE status = 'queued'`),
      query(`SELECT COUNT(*)::int AS count FROM wf_runs WHERE status = 'running'`),
    ]);
    errorToday = toInt((todayFailed.rows as NumberRow[])[0]?.count);
    errorTotal = toInt((allFailed.rows as NumberRow[])[0]?.count);
    queued = toInt((queuedRows.rows as NumberRow[])[0]?.count);
    running = toInt((runningRows.rows as NumberRow[])[0]?.count);
  }

  let todayNew = 0;
  let weekNew = 0;
  let monthNew = 0;
  let growthTrend: Array<{ date: string; count: number }> = [];
  // 统计用户增长趋势，包括今日、本周和本月新增用户数量
  if (usersExists) {
    const [todayRows, weekRows, monthRows, trendRows] = await Promise.all([
      query(`SELECT COUNT(*)::int AS count FROM users WHERE created_at >= CURRENT_DATE`),
      query(`SELECT COUNT(*)::int AS count FROM users WHERE created_at >= (CURRENT_DATE - INTERVAL '7 days')`),
      query(`SELECT COUNT(*)::int AS count FROM users WHERE created_at >= date_trunc('month', CURRENT_DATE)`),
      query(`
        SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day, COUNT(*)::int AS count
        FROM users
        WHERE created_at >= (CURRENT_DATE - INTERVAL '13 days')
        GROUP BY date_trunc('day', created_at)
        ORDER BY date_trunc('day', created_at) ASC
      `),
    ]);
    todayNew = toInt((todayRows.rows as NumberRow[])[0]?.count);
    weekNew = toInt((weekRows.rows as NumberRow[])[0]?.count);
    monthNew = toInt((monthRows.rows as NumberRow[])[0]?.count);
    growthTrend = (trendRows.rows as Array<{ day: string; count: string }>).map((row) => ({ date: row.day, count: toInt(row.count) }));
  }

  let activeUsers = 0;
  let totalSubscriptions = 0;
  // 统计活跃用户和订阅数量
  if (subsExists) {
    const [activeRows, totalRows] = await Promise.all([
      query(`SELECT COUNT(DISTINCT user_id)::int AS count FROM user_subscriptions`),
      query(`SELECT COUNT(*)::int AS count FROM user_subscriptions`),
    ]);
    activeUsers = toInt((activeRows.rows as NumberRow[])[0]?.count);
    totalSubscriptions = toInt((totalRows.rows as NumberRow[])[0]?.count);
  }

  let apiToday = 0;
  let apiTotal = 0;
  if (activityLogsExists) {
    const [todayRows, totalRows] = await Promise.all([
      query(`
        SELECT COUNT(*)::int AS count
        FROM user_activity_logs
        WHERE created_at >= CURRENT_DATE
          AND (target_type = 'api' OR action ILIKE 'api.%' OR action ILIKE '%api%')
      `),
      query(`
        SELECT COUNT(*)::int AS count
        FROM user_activity_logs
        WHERE (target_type = 'api' OR action ILIKE 'api.%' OR action ILIKE '%api%')
      `),
    ]);
    apiToday = toInt((todayRows.rows as NumberRow[])[0]?.count);
    apiTotal = toInt((totalRows.rows as NumberRow[])[0]?.count);
  }

  let healthScore = 0;
  let healthy = 0;
  let warning = 0;
  let critical = 0;
  if (dataSourcesExists) {
    const statusRows = await query(`
      SELECT
        CASE
          WHEN is_enabled = FALSE THEN 'critical'
          WHEN last_success_at IS NULL THEN 'critical'
          WHEN last_error_log IS NOT NULL AND last_error_log != '' THEN 'warning'
          ELSE 'healthy'
        END AS status,
        COUNT(*)::int AS cnt
      FROM data_sources
      GROUP BY 1
    `);
    for (const row of statusRows.rows as Array<{ status: string; cnt: string }>) {
      const n = toInt(row.cnt);
      if (row.status === "healthy") healthy = n;
      if (row.status === "warning") warning = n;
      if (row.status === "critical") critical = n;
    }
    const total = healthy + warning + critical;
    healthScore = total === 0 ? 0 : Math.max(0, Math.min(100, Math.round(((healthy + warning * 0.5) / total) * 100)));
  }

  return {
    systemStatus: {
      app: "up",
      database: databaseStatus,
      n8n: await getN8nStatus(),
    },
    fetchedToday: {
      total: rssToday + emailToday + newsToday,
      rss: rssToday,
      email: emailToday,
      news: newsToday,
    },
    feedCounts: {
      today: rssToday + emailToday + newsToday,
      week: rssWeek + emailWeek + newsWeek,
      month: rssMonth + emailMonth + newsMonth,
    },
    errorTasks: {
      today: errorToday,
      total: errorTotal,
    },
    userGrowth: {
      todayNew,
      weekNew,
      monthNew,
      trend14d: growthTrend,
    },
    activeSubscriptions: {
      activeUsers,
      totalSubscriptions,
    },
    apiCalls: {
      today: apiToday,
      total: apiTotal,
    },
    dataSourceHealth: {
      score: healthScore,
      healthy,
      warning,
      critical,
    },
    queueBacklog: {
      queued,
      running,
      failedToday: errorToday,
    },
    lastUpdatedAt: new Date().toISOString(),
  };
}
