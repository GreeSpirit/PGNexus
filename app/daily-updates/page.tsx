"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Calendar, FileText, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";
import "./markdown.css";

interface DailyUpdateEntry {
  source: "file" | "db";
  date: string;
  jobid: number;
  filename?: string; // file entries only
}

function DailyUpdatesContent() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState<DailyUpdateEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DailyUpdateEntry | null>(null);
  const [content, setContent] = useState<string>("");
  const [frontmatter, setFrontmatter] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(10);

  useEffect(() => {
    fetchEntryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch content when language changes
  useEffect(() => {
    if (selectedEntry) {
      fetchContent(selectedEntry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const fetchEntryList = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/daily-updates/list");
      const data = await response.json();

      const entryList: DailyUpdateEntry[] = data.entries || [];
      setEntries(entryList);

      const fileParam = searchParams.get("file");
      const jobidParam = searchParams.get("jobid");
      let entryToLoad: DailyUpdateEntry | null = null;

      if (fileParam) {
        entryToLoad =
          entryList.find((e) => e.source === "file" && e.filename === fileParam) || null;
      } else if (jobidParam) {
        entryToLoad =
          entryList.find(
            (e) => e.source === "db" && e.jobid === parseInt(jobidParam)
          ) || null;
      }

      if (!entryToLoad && data.latest) {
        entryToLoad = data.latest;
      }

      if (entryToLoad) {
        setSelectedEntry(entryToLoad);
        await fetchContent(entryToLoad);
        // Update URL if not already reflecting this entry
        const hasCorrectParam =
          entryToLoad.source === "file"
            ? fileParam === entryToLoad.filename
            : jobidParam === String(entryToLoad.jobid);
        if (!hasCorrectParam) {
          updateUrl(entryToLoad, false);
        }
      }
    } catch (error) {
      console.error("Error fetching entry list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContent = async (entry: DailyUpdateEntry) => {
    try {
      setIsLoadingContent(true);
      const url =
        entry.source === "file"
          ? `/api/daily-updates/content?filename=${encodeURIComponent(entry.filename!)}&language=${language}`
          : `/api/daily-updates/content?jobid=${entry.jobid}&language=${language}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.content) {
        setContent(data.content);
        setFrontmatter(data.frontmatter || {});
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setContent("# Error\n\nFailed to load daily update content.");
      setFrontmatter({});
    } finally {
      setIsLoadingContent(false);
    }
  };

  const updateUrl = (entry: DailyUpdateEntry, push = true) => {
    const url =
      entry.source === "file"
        ? `/daily-updates?file=${encodeURIComponent(entry.filename!)}`
        : `/daily-updates?jobid=${entry.jobid}`;
    if (push) {
      router.push(url, { scroll: false });
    } else {
      router.replace(url, { scroll: false });
    }
  };

  const handleEntrySelect = async (entry: DailyUpdateEntry) => {
    setSelectedEntry(entry);
    await fetchContent(entry);
    updateUrl(entry, true);
  };

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 10);
  };

  const getDownloadUrl = (entry: DailyUpdateEntry) => {
    if (entry.source === "file") {
      return `/api/daily-updates/download?filename=${encodeURIComponent(entry.filename!)}&language=${language}`;
    }
    return `/api/daily-updates/download?jobid=${entry.jobid}&language=${language}`;
  };

  const isSelected = (entry: DailyUpdateEntry) => {
    if (!selectedEntry) return false;
    if (entry.source !== selectedEntry.source) return false;
    return entry.source === "file"
      ? entry.filename === selectedEntry.filename
      : entry.jobid === selectedEntry.jobid;
  };

  const displayedEntries = entries.slice(0, displayLimit);
  const hasMoreEntries = entries.length > displayLimit;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-12 text-center">
        <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {t(trans.dailyUpdatesPage.noUpdates)}
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          {t(trans.dailyUpdatesPage.noUpdatesSubtext)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar with entry list */}
      <aside className="w-full lg:w-64 lg:shrink-0">
        <div className="lg:sticky lg:top-24 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 px-2">
            {t(trans.dailyUpdatesPage.sidebarTitle)}
          </h2>
          <div className="space-y-1 max-h-[300px] lg:max-h-[calc(100vh-200px)] overflow-y-auto">
            {displayedEntries.map((entry) => {
              const key =
                entry.source === "file"
                  ? `file:${entry.filename}`
                  : `db:${entry.jobid}`;
              return (
                <button
                  key={key}
                  onClick={() => handleEntrySelect(entry)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer text-sm ${
                    isSelected(entry)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">{entry.date}</span>
                  </div>
                </button>
              );
            })}
            {hasMoreEntries && (
              <button
                onClick={handleLoadMore}
                className="w-full text-center px-3 py-2 mt-2 rounded-lg transition-all cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-medium"
              >
                {t(trans.dailyUpdatesPage.loadMore)} ({entries.length - displayLimit}{" "}
                {t(trans.dailyUpdatesPage.remaining)})
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-4 sm:p-8">
          {isLoadingContent ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {selectedEntry && (
                <div className="mb-6 pb-6 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedEntry.date}</span>
                      <span>•</span>
                      <span className="font-mono">#{selectedEntry.jobid}</span>
                    </div>
                    <a
                      href={getDownloadUrl(selectedEntry)}
                      download
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t(trans.dailyUpdatesPage.downloadMd)}
                    </a>
                  </div>
                </div>
              )}
              <div>
                {Object.keys(frontmatter).length > 0 && (
                  <div className="mb-8 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full">
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {Object.entries(frontmatter).map(([key, value]) => (
                          <tr key={key} className="bg-slate-50/50 dark:bg-slate-800/30">
                            <td className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 w-1/4">
                              {key}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                              {typeof value === "object"
                                ? JSON.stringify(value)
                                : String(value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <article className="markdown-content text-slate-800 dark:text-slate-200">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </article>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DailyUpdatesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <DailyUpdatesContent />
    </Suspense>
  );
}
