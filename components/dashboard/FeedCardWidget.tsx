"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";
import type { UnifiedFeed } from "@/lib/types/database";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

interface FeedCardWidgetProps {
  feeds: UnifiedFeed[];
  title: string;
  type: "rss" | "email" | "news";
  viewAllLink?: string;
  images?: string[];
  description?: string;
}

export function FeedCardWidget({ feeds, title, type, viewAllLink, images, description }: FeedCardWidgetProps) {
  const { t } = useLanguage();
  const linkHref = viewAllLink || `/feeds?type=${type}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          {title}
        </h2>
        <Link
          href={linkHref}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          {t(trans.homePage.viewAll)}
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {description && (
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {feeds.slice(0, 3).map((feed, index) => (
          <FeedCard key={feed.id} feed={feed} type={type} image={images?.[index]} index={index} />
        ))}
      </div>
    </div>
  );
}

function FeedCard({
  feed,
  type,
  image,
  index,
}: {
  feed: UnifiedFeed;
  type: "rss" | "email" | "news";
  image?: string;
  index: number;
}) {
  const { language } = useLanguage();

  // Choose summary based on current language
  const summary = language === "en" ? feed.summary_english : feed.summary_chinese;

  // Determine which image to use
  const getImageSrc = () => {
    // First priority: use imgurl from the feed data
    if (feed.imgurl) {
      return feed.imgurl;
    }
    // Second priority: use provided image prop
    if (image) {
      return `/images/${image}`;
    }
    // Third priority: use default image based on card position (1-indexed)
    return `/images/default${index + 1}.jpg`;
  };

  const CardContent = () => (
    <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={getImageSrc()}
          alt={feed.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col h-[280px]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2 mb-3">
          {feed.title}
        </h3>

        {type === "rss" && (
          <div className="flex flex-col flex-1 justify-between">
            {summary && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4 mb-3">
                {summary}
              </p>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-700/60 mt-auto">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {feed.source}
              </span>
              {feed.date && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDistanceToNow(new Date(feed.date), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
        )}

        {type === "email" && (
          <div className="flex flex-col flex-1 justify-between">
            {summary && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4 mb-3">
                {summary}
              </p>
            )}
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 mt-auto">
              {feed.date && (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {formatDistanceToNow(new Date(feed.date), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
        )}

        {type === "news" && (
          <div className="flex flex-col flex-1 justify-between">
            {summary && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4 mb-3">
                {summary}
              </p>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-700/60 mt-auto">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {feed.source}
              </span>
              {feed.date && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDistanceToNow(new Date(feed.date), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (feed.link) {
    if (feed.link.startsWith('/')) {
      return (
        <Link href={feed.link}>
          <CardContent />
        </Link>
      );
    } else {
      return (
        <a href={feed.link} target="_blank" rel="noopener noreferrer">
          <CardContent />
        </a>
      );
    }
  }

  return <CardContent />;
}
