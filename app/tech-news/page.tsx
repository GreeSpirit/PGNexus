"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Newspaper, Loader2, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

interface NewsFeed {
  jobid: number;
  subject: string;
  source: string;
  pubdate: string;
  messages: string;
  summary: string;
  summary_zh: string;
  imgurl?: string;
}

function TechNewsContent() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const [feeds, setFeeds] = useState<NewsFeed[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<NewsFeed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(10);

  const fetchFeeds = async (query: string = "") => {
    try {
      setIsLoading(true);

      // Check if there's a source or jobid in URL params and fetch that specific feed first
      const sourceParam = searchParams.get('source');
      const jobidParam = searchParams.get('jobid');

      if (sourceParam || jobidParam) {
        try {
          const param = sourceParam ? `source=${encodeURIComponent(sourceParam)}` : `jobid=${jobidParam}`;
          const feedResponse = await fetch(`/api/news-feeds/by-jobid?${param}`);
          if (feedResponse.ok) {
            const feedData = await feedResponse.json();
            if (feedData.feed) {
              setSelectedFeed(feedData.feed);
            }
          }
        } catch (error) {
          console.error("Error fetching specific news feed:", error);
        }
      }

      // Fetch the list of feeds
      const url = query
        ? `/api/news-feeds/search?q=${encodeURIComponent(query)}&limit=100&offset=0`
        : `/api/news-feeds/latest?limit=100&offset=0`;

      const response = await fetch(url);
      const data = await response.json();

      setFeeds(data.feeds || []);

      // Auto-select first feed if none selected and no source/jobid param
      if (!sourceParam && !jobidParam && data.feeds && data.feeds.length > 0 && !selectedFeed) {
        setSelectedFeed(data.feeds[0]);
      }
    } catch (error) {
      console.error("Error fetching news feeds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedSelect = (feed: NewsFeed) => {
    setSelectedFeed(feed);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setIsSearchMode(true);
      setSelectedFeed(null);
      fetchFeeds(searchInput.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setIsSearchMode(false);
    setSelectedFeed(null);
    fetchFeeds();
  };

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 10);
  };

  useEffect(() => {
    fetchFeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayedFeeds = feeds.slice(0, displayLimit);
  const hasMoreFeeds = feeds.length > displayLimit;

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
            {t(trans.techNewsPage.title)}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            {t(trans.techNewsPage.subtitle)}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar with news list */}
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
                  placeholder={t(trans.techNewsPage.searchPlaceholder)}
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
                  {t(trans.techNewsPage.clearSearch)}
                </button>
              )}
            </form>

            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 px-2">
              {t(trans.techNewsPage.newsCount)} ({feeds.length})
            </h2>
            <div className="space-y-1 max-h-[300px] lg:max-h-[calc(100vh-350px)] overflow-y-auto">
              {feeds.length === 0 ? (
                <div className="text-center py-8 px-2">
                  <Newspaper className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isSearchMode
                      ? t(trans.techNewsPage.noNewsSearch)
                      : t(trans.techNewsPage.noNewsAvailable)}
                  </p>
                </div>
              ) : (
                <>
                  {displayedFeeds.map((feed) => (
                    <button
                      key={`${feed.jobid}-${feed.subject}`}
                      onClick={() => handleFeedSelect(feed)}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-all cursor-pointer text-sm ${
                        selectedFeed?.jobid === feed.jobid && selectedFeed?.subject === feed.subject
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-1">
                        <Newspaper className="h-4 w-4 mt-0.5 shrink-0" />
                        <span className="font-medium line-clamp-2">{feed.subject}</span>
                      </div>
                      <div className="text-xs opacity-75 ml-6">
                        {feed.source} • {formatDistanceToNow(new Date(feed.pubdate), {
                          addSuffix: true,
                        })}
                      </div>
                    </button>
                  ))}
                  {hasMoreFeeds && (
                    <button
                      onClick={handleLoadMore}
                      className="w-full text-center px-3 py-2 mt-2 rounded-lg transition-all cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-medium"
                    >
                      {t(trans.techNewsPage.loadMore)} ({feeds.length - displayLimit} {t(trans.techNewsPage.remaining)})
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {selectedFeed ? (
            <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-4 sm:p-8">
              {/* Image */}
              {(() => {
                const feedIndex = feeds.findIndex(f => f.jobid === selectedFeed.jobid);
                const imageSrc = selectedFeed.imgurl || `/images/default${(feedIndex % 6) + 1}.jpg`;
                return (
                  <div className="mb-6 w-full overflow-hidden rounded-xl">
                    <img
                      src={imageSrc}
                      alt={selectedFeed.subject}
                      className="w-full h-auto object-cover max-h-96"
                    />
                  </div>
                );
              })()}

              <div className="mb-6 pb-6 border-b border-slate-200/60 dark:border-slate-700/60">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 break-words">
                  {selectedFeed.subject}
                </h2>
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-3">
                  <span>
                    {formatDistanceToNow(new Date(selectedFeed.pubdate), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <a
                  href={selectedFeed.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t(trans.techNewsPage.viewOriginal)}
                </a>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  {t(trans.techNewsPage.summary)}
                </h3>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {language === "en"
                    ? selectedFeed.summary || t(trans.techNewsPage.noSummary)
                    : selectedFeed.summary_zh || t(trans.techNewsPage.noSummary)}
                </p>
              </div>
            </div>
          ) : (
            <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-12 text-center">
              <Newspaper className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {feeds.length === 0 ? t(trans.techNewsPage.noNewsTitle) : t(trans.techNewsPage.selectNewsTitle)}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feeds.length === 0
                  ? t(trans.techNewsPage.noNewsSubtext)
                  : t(trans.techNewsPage.selectNewsSubtext)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TechNewsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <TechNewsContent />
    </Suspense>
  );
}
