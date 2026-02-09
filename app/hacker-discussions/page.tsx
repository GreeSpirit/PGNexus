"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Search, X, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

interface EmailSubject {
  subject: string;
  jobid: number;
  lastactivity: string;
}

interface EmailEntry {
  jobid: number;
  threadid: string;
  subject: string;
  participants: string;
  messages: string;
  summary: string;
  summary_zh: string;
  lastactivity: string;
}

function HackerDiscussionsContent() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const [subjects, setSubjects] = useState<EmailSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<EmailSubject | null>(null);
  const [subjectEntries, setSubjectEntries] = useState<EmailEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(10);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const fetchSubjects = async (query: string = "") => {
    try {
      setIsLoading(true);
      const url = query
        ? `/api/email-feeds/search?q=${encodeURIComponent(query)}&limit=100&offset=0`
        : `/api/email-feeds/subjects?limit=100&offset=0`;

      const response = await fetch(url);
      const data = await response.json();

      setSubjects(data.subjects || []);

      // Check if there's a subject in URL params
      const subjectParam = searchParams.get('subject');
      if (subjectParam && data.subjects) {
        const targetSubject = data.subjects.find((subj: EmailSubject) => subj.subject === subjectParam);
        if (targetSubject) {
          await handleSubjectSelect(targetSubject);
          return;
        }
      }

      // Auto-select first subject if none selected and no subject param
      if (data.subjects && data.subjects.length > 0 && !selectedSubject) {
        await handleSubjectSelect(data.subjects[0]);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubjectEntries = async (subject: string) => {
    try {
      setIsLoadingEntries(true);
      const response = await fetch(
        `/api/email-feeds/by-subject?subject=${encodeURIComponent(subject)}&limit=100&offset=0`
      );
      const data = await response.json();

      setSubjectEntries(data.entries || []);
    } catch (error) {
      console.error("Error fetching subject entries:", error);
      setSubjectEntries([]);
    } finally {
      setIsLoadingEntries(false);
    }
  };

  const handleSubjectSelect = async (subject: EmailSubject) => {
    setSelectedSubject(subject);
    await fetchSubjectEntries(subject.subject);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setIsSearchMode(true);
      setSelectedSubject(null);
      fetchSubjects(searchInput.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setIsSearchMode(false);
    setSelectedSubject(null);
    fetchSubjects();
  };

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 10);
  };

  useEffect(() => {
    fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayedSubjects = subjects.slice(0, displayLimit);
  const hasMoreSubjects = subjects.length > displayLimit;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-4 sm:p-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
            {t(trans.hackerDiscussionsPage.title)}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            {t(trans.hackerDiscussionsPage.subtitle)}
          </p>
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-12 text-center">
          <Search className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {t(trans.hackerDiscussionsPage.noDiscussions)}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {isSearchMode
              ? `${t(trans.hackerDiscussionsPage.noDiscussionsSearch)} "${searchQuery}"`
              : t(trans.hackerDiscussionsPage.noDiscussionsAvailable)}
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar with topics */}
          <aside className="w-full lg:w-80 lg:shrink-0">
            <div className="lg:sticky lg:top-24 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={t(trans.hackerDiscussionsPage.searchPlaceholder)}
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
                    {t(trans.hackerDiscussionsPage.clearSearch)}
                  </button>
                )}
              </form>

              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 px-2">
                {t(trans.hackerDiscussionsPage.topicsCount)} ({subjects.length})
              </h2>
              <div className="space-y-1 max-h-[300px] lg:max-h-[calc(100vh-350px)] overflow-y-auto">
                {displayedSubjects.map((subject) => (
                  <button
                    key={subject.subject}
                    onClick={() => handleSubjectSelect(subject)}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-all cursor-pointer text-sm ${
                      selectedSubject?.subject === subject.subject
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="font-medium line-clamp-2">{subject.subject}</span>
                    </div>
                    <div className="text-xs opacity-75 ml-6">
                      {formatDate(subject.lastactivity)}
                    </div>
                  </button>
                ))}
                {hasMoreSubjects && (
                  <button
                    onClick={handleLoadMore}
                    className="w-full text-center px-3 py-2 mt-2 rounded-lg transition-all cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-medium"
                  >
                    {t(trans.hackerDiscussionsPage.loadMore)} ({subjects.length - displayLimit} {t(trans.hackerDiscussionsPage.remaining)})
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {selectedSubject ? (
              <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-4 sm:p-8">
                <div className="mb-6 pb-6 border-b border-slate-200/60 dark:border-slate-700/60">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 break-words">
                    {selectedSubject.subject}
                  </h2>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {t(trans.hackerDiscussionsPage.lastUpdated)} {formatDate(selectedSubject.lastactivity)}
                  </div>
                </div>

                {isLoadingEntries ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {subjectEntries.map((entry) => {
                      // Extract messageId from messages JSON
                      let messageUrl: string | undefined = undefined;
                      if (entry.messages) {
                        try {
                          const messages = JSON.parse(entry.messages);
                          if (Array.isArray(messages) && messages.length > 0 && messages[0].messageId) {
                            messageUrl = `https://www.postgresql.org/message-id/${messages[0].messageId}`;
                          }
                        } catch (e) {
                          // If parsing fails, leave URL as undefined
                        }
                      }

                      // Parse participants
                      let participants: string[] = [];
                      if (entry.participants) {
                        try {
                          participants = JSON.parse(entry.participants);
                          if (!Array.isArray(participants)) {
                            participants = [];
                          }
                        } catch (e) {
                          // If parsing fails, leave as empty array
                        }
                      }

                      return (
                        <div
                          key={entry.jobid}
                          className="border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-6 bg-slate-50/30 dark:bg-slate-800/30"
                        >
                          {entry.lastactivity && (
                            <div className="flex justify-end mb-4">
                              {messageUrl ? (
                                <a
                                  href={messageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline cursor-pointer"
                                >
                                  {t(trans.hackerDiscussionsPage.asOf)} {new Date(entry.lastactivity).toLocaleString()}
                                </a>
                              ) : (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {t(trans.hackerDiscussionsPage.asOf)} {new Date(entry.lastactivity).toLocaleString()}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="prose dark:prose-invert max-w-none mb-4">
                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                              {language === "en"
                                ? entry.summary || t(trans.hackerDiscussionsPage.noSummary)
                                : entry.summary_zh || t(trans.hackerDiscussionsPage.noSummary)}
                            </p>
                          </div>

                          {participants.length > 0 && (
                            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                                  {t(trans.hackerDiscussionsPage.participants)}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {participants.map((participant, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
                                    >
                                      {participant}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-12 text-center">
                <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {t(trans.hackerDiscussionsPage.selectTopic)}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {t(trans.hackerDiscussionsPage.selectTopicSubtext)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HackerDiscussionsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <HackerDiscussionsContent />
    </Suspense>
  );
}
