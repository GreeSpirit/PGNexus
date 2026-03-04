"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search, X, Loader2, ExternalLink, Heart, MessageCircle,
  Globe, Linkedin, Github, Facebook, Link2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

interface SocialFeed {
  jobid: number;
  platform: string;
  title: string;
  title_zh?: string;
  url: string;
  imgurl?: string;
  author: string;
  author_imgurl?: string;
  pubdate: string;
  likes: number;
  comments: number;
  mediaurl?: string;
  summary?: string;
  summary_zh?: string;
}

// ── Image proxy ──────────────────────────────────────────────────────────────
// Domains whose images must be fetched server-side to bypass hotlink protection
const PROXY_DOMAINS = new Set(['mmbiz.qpic.cn', 'mmbiz.qlogo.cn', 'wx.qlogo.cn']);

function imgUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  try {
    const { hostname } = new URL(url);
    if (PROXY_DOMAINS.has(hostname)) {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    }
  } catch {
    // not a valid URL — return as-is
  }
  return url;
}

// ── Platform helpers ─────────────────────────────────────────────────────────

function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  const p = platform.toLowerCase();
  if (p === "linkedin") return <Linkedin className={className} />;
  if (p === "github") return <Github className={className} />;
  if (p === "facebook") return <Facebook className={className} />;

  if (p.includes("twitter") || p === "x") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (p.includes("wechat") || p.includes("weixin")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.295.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.601-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm4.911 0c.643 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.163-1.178c0-.651.52-1.18 1.163-1.18zm4.911 4.968c-3.496 0-6.336 2.492-6.336 5.567 0 3.075 2.84 5.567 6.336 5.567.67 0 1.319-.097 1.931-.266a.59.59 0 0 1 .49.066l1.29.756a.22.22 0 0 0 .114.037.2.2 0 0 0 .2-.2c0-.049-.02-.1-.032-.149l-.264-1.004a.408.408 0 0 1 .143-.45C20.122 19.987 21 18.35 21 16.526c0-3.075-2.84-5.567-6.393-5.567zm-2.37 2.804c.437 0 .791.36.791.804a.798.798 0 0 1-.791.805.798.798 0 0 1-.791-.805c0-.444.354-.804.79-.804zm4.741 0c.437 0 .79.36.79.804a.798.798 0 0 1-.79.805.798.798 0 0 1-.791-.805c0-.444.354-.804.79-.804z" />
      </svg>
    );
  }

  if (p.includes("youtube")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }

  return <Globe className={className} />;
}

function getPlatformColor(platform: string): string {
  const p = platform.toLowerCase();
  if (p === "linkedin") return "text-blue-600";
  if (p.includes("twitter") || p === "x") return "text-slate-800 dark:text-slate-100";
  if (p.includes("wechat") || p.includes("weixin")) return "text-green-600";
  if (p === "github") return "text-slate-800 dark:text-slate-100";
  if (p === "facebook") return "text-blue-700";
  if (p.includes("youtube")) return "text-red-600";
  return "text-slate-500 dark:text-slate-400";
}

function getPlatformLabel(platform: string): string {
  const p = platform.toLowerCase();
  if (p.includes("twitter") || p === "x") return "X (Twitter)";
  if (p.includes("wechat") || p.includes("weixin")) return "WeChat";
  if (p.includes("youtube")) return "YouTube";
  // Title-case the raw value as fallback
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

// ── Media embed ──────────────────────────────────────────────────────────────

type MediaKind = "youtube" | "video" | "gif" | "link";

function detectMedia(url: string): { kind: MediaKind; src: string } {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { kind: "link", src: url };
  }

  const { hostname, pathname, searchParams } = parsed;

  // YouTube — watch, shorts, youtu.be
  if (hostname.includes("youtube.com") || hostname === "youtu.be") {
    let videoId =
      searchParams.get("v") ||
      (hostname === "youtu.be" ? pathname.slice(1) : null) ||
      (pathname.startsWith("/shorts/") ? pathname.split("/shorts/")[1] : null) ||
      (pathname.startsWith("/embed/") ? pathname.split("/embed/")[1] : null);
    if (videoId) {
      // strip any extra path segments or query strings from the id
      videoId = videoId.split(/[?&/]/)[0];
      return { kind: "youtube", src: `https://www.youtube.com/embed/${videoId}` };
    }
  }

  // Direct video file by extension
  if (/\.(mp4|webm|mov|ogg|ogv)(\?|$)/i.test(pathname)) {
    return { kind: "video", src: imgUrl(url) ?? url };
  }

  // Video path segments without extension (e.g. LinkedIn: /playlist/vid/.../mp4-640p-...)
  if (/\/mp4[-_]/i.test(pathname)) {
    return { kind: "video", src: url };
  }

  // Known video CDN hostnames
  if (
    (hostname === "dms.licdn.com" && pathname.includes("/vid/")) ||
    hostname === "video.twimg.com"
  ) {
    return { kind: "video", src: url };
  }

  // GIF
  if (/\.gif(\?|$)/i.test(pathname)) {
    return { kind: "gif", src: imgUrl(url) ?? url };
  }

  return { kind: "link", src: url };
}

function MediaEmbed({ url }: { url: string }) {
  const { kind, src } = detectMedia(url);

  if (kind === "youtube") {
    return (
      <div className="mb-6 w-full overflow-hidden rounded-xl aspect-video">
        <iframe
          src={src}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  if (kind === "video") {
    return (
      <div className="mb-6 w-full overflow-hidden rounded-xl">
        <video
          src={src}
          controls
          playsInline
          className="w-full h-auto max-h-96 rounded-xl bg-black"
        />
      </div>
    );
  }

  if (kind === "gif") {
    return (
      <div className="mb-6 w-full overflow-hidden rounded-xl">
        <img
          src={src}
          alt="Media"
          className="w-full h-auto max-h-96 object-contain rounded-xl"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).parentElement!.style.display = "none";
          }}
        />
      </div>
    );
  }

  // Fallback: styled link
  return (
    <div className="mb-6 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
      <Link2 className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 truncate transition-colors"
      >
        {url}
      </a>
    </div>
  );
}

// ── Date helper ──────────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const diffInHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  if (diffInHours < 24) return formatDistanceToNow(date, { addSuffix: true });
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// ── Main component ───────────────────────────────────────────────────────────

function SocialMediaContent() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const [feeds, setFeeds] = useState<SocialFeed[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<SocialFeed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(20);

  const fetchFeeds = async (query: string = "") => {
    try {
      setIsLoading(true);

      const urlParam = searchParams.get("url");
      if (urlParam) {
        try {
          const res = await fetch(`/api/social-feeds/by-url?url=${encodeURIComponent(urlParam)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.feed) setSelectedFeed(data.feed);
          }
        } catch (err) {
          console.error("Error fetching specific feed:", err);
        }
      }

      const endpoint = query
        ? `/api/social-feeds/search?q=${encodeURIComponent(query)}&limit=200&offset=0`
        : `/api/social-feeds/latest?limit=200&offset=0`;

      const res = await fetch(endpoint);
      const data = await res.json();
      const list: SocialFeed[] = data.feeds || [];
      setFeeds(list);

      if (!urlParam && list.length > 0 && !selectedFeed) {
        setSelectedFeed(list[0]);
      }
    } catch (err) {
      console.error("Error fetching social feeds:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setIsSearchMode(true);
      setSelectedFeed(null);
      setDisplayLimit(20);
      fetchFeeds(searchInput.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setIsSearchMode(false);
    setSelectedFeed(null);
    setDisplayLimit(20);
    fetchFeeds();
  };

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
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
          {t(trans.socialMediaPage.title)}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
          {t(trans.socialMediaPage.subtitle)}
        </p>
      </div>

      {feeds.length === 0 ? (
        <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-12 text-center">
          <Search className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {t(trans.socialMediaPage.noPosts)}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {isSearchMode
              ? `${t(trans.socialMediaPage.noPostsSearch)} "${searchQuery}"`
              : t(trans.socialMediaPage.noPostsAvailable)}
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Sidebar ──────────────────────────────────────────────────── */}
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
                    placeholder={t(trans.socialMediaPage.searchPlaceholder)}
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
                    {t(trans.socialMediaPage.clearSearch)}
                  </button>
                )}
              </form>

              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3 px-1">
                {t(trans.socialMediaPage.postsCount)} ({feeds.length})
              </h2>

              <div className="space-y-1 max-h-[300px] lg:max-h-[calc(100vh-350px)] overflow-y-auto">
                {displayedFeeds.map((feed) => {
                  const displayTitle =
                    language === "zh" && feed.title_zh ? feed.title_zh : feed.title;
                  const isActive = selectedFeed?.url === feed.url;
                  return (
                    <button
                      key={`${feed.jobid}-${feed.url}`}
                      onClick={() => setSelectedFeed(feed)}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-all cursor-pointer text-sm ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      {/* Platform badge + title */}
                      <div className="flex items-start gap-2 mb-1">
                        <PlatformIcon
                          platform={feed.platform}
                          className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
                            isActive ? "text-white" : getPlatformColor(feed.platform)
                          }`}
                        />
                        <span className="font-medium line-clamp-2 leading-snug">
                          {displayTitle}
                        </span>
                      </div>
                      {/* Author + date */}
                      <div className="text-xs opacity-70 ml-5.5 pl-0.5 truncate">
                        {feed.author} · {formatDate(feed.pubdate)}
                      </div>
                    </button>
                  );
                })}

                {hasMoreFeeds && (
                  <button
                    onClick={() => setDisplayLimit((p) => p + 20)}
                    className="w-full text-center px-3 py-2 mt-2 rounded-lg transition-all cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-medium"
                  >
                    {t(trans.socialMediaPage.loadMore)} ({feeds.length - displayLimit}{" "}
                    {t(trans.socialMediaPage.remaining)})
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {selectedFeed ? (
              <PostDetail feed={selectedFeed} language={language} t={t} />
            ) : (
              <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-12 text-center">
                <Globe className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {t(trans.socialMediaPage.selectPost)}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {t(trans.socialMediaPage.selectPostSubtext)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Post detail panel ─────────────────────────────────────────────────────────

function PostDetail({
  feed,
  language,
  t,
}: {
  feed: SocialFeed;
  language: string;
  t: (key: { en: string; zh: string }) => string;
}) {
  const displayTitle = language === "zh" && feed.title_zh ? feed.title_zh : feed.title;
  const displaySummary =
    language === "zh" && feed.summary_zh ? feed.summary_zh : feed.summary;

  return (
    <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg">
      <div className="p-4 sm:p-8">
        {/* Post image */}
        {feed.imgurl && (
          <div className="mb-6 w-full overflow-hidden rounded-xl">
            <img
              src={imgUrl(feed.imgurl)}
              alt={displayTitle}
              className="w-full h-auto object-cover max-h-96"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).parentElement!.style.display = "none";
              }}
            />
          </div>
        )}
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 break-words leading-snug">
          {displayTitle}
        </h2>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 pb-5 border-b border-slate-200/60 dark:border-slate-700/60">
          {/* Author */}
          <div className="flex items-center gap-2">
            {feed.author_imgurl ? (
              <img
                src={imgUrl(feed.author_imgurl)}
                alt={feed.author}
                className="h-6 w-6 rounded-full object-cover shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {feed.author}
            </span>
          </div>

          {/* Date */}
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {new Date(feed.pubdate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>

          {/* Platform */}
          <span
            className={`flex items-center gap-1.5 text-sm font-medium ${getPlatformColor(feed.platform)}`}
          >
            <PlatformIcon platform={feed.platform} className="h-4 w-4" />
            {getPlatformLabel(feed.platform)}
          </span>

          {/* Original link */}
          <a
            href={feed.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            {t(trans.socialMediaPage.viewOriginal)}
          </a>
        </div>

        {/* Summary */}
        {displaySummary && (
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {t(trans.socialMediaPage.summary)}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {displaySummary}
            </p>
          </div>
        )}

        {!displaySummary && (
          <p className="text-slate-500 dark:text-slate-400 italic mb-6">
            {t(trans.socialMediaPage.noSummary)}
          </p>
        )}

        {/* Media */}
        {feed.mediaurl && <MediaEmbed url={feed.mediaurl} />}

        {/* Engagement counts */}
        {(feed.likes > 0 || feed.comments > 0) && (
          <div className="flex items-center gap-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            {feed.likes > 0 && (
              <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Heart className="h-4 w-4 text-rose-500" />
                {feed.likes.toLocaleString()}
                <span className="hidden sm:inline">{t(trans.socialMediaPage.likes)}</span>
              </span>
            )}
            {feed.comments > 0 && (
              <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                {feed.comments.toLocaleString()}
                <span className="hidden sm:inline">{t(trans.socialMediaPage.comments)}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function SocialMediaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <SocialMediaContent />
    </Suspense>
  );
}
