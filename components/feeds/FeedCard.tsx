import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils/date";
import type { UnifiedFeed } from "@/lib/types/database";
import { ExternalLink, Mail, Rss, Newspaper, FileText } from "lucide-react";
import Link from "next/link";

interface FeedCardProps {
  feed: UnifiedFeed;
  language?: "en" | "zh";
}

export function FeedCard({ feed, language = "en" }: FeedCardProps) {
  const getIcon = () => {
    switch (feed.type) {
      case 'rss':
        return <Rss className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'news':
        return <Newspaper className="h-4 w-4" />;
      case 'daily-updates':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCardStyles = () => {
    switch (feed.type) {
      case 'rss':
        return 'border-l-4 border-l-orange-500 hover:border-l-orange-600 hover:shadow-orange-200/50 dark:hover:shadow-orange-900/30';
      case 'email':
        return 'border-l-4 border-l-blue-500 hover:border-l-blue-600 hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30';
      case 'news':
        return 'border-l-4 border-l-purple-500 hover:border-l-purple-600 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30';
      case 'daily-updates':
        return 'border-l-4 border-l-green-500 hover:border-l-green-600 hover:shadow-green-200/50 dark:hover:shadow-green-900/30';
      default:
        return 'border-l-4 border-l-slate-500 hover:border-l-slate-600';
    }
  };

  const getBadgeStyles = () => {
    switch (feed.type) {
      case 'rss':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'email':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'news':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'daily-updates':
        return 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400 border-green-200 dark:border-green-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const isDailyUpdate = feed.type === 'daily-updates';

  return (
    <Card className={`backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${getCardStyles()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`flex items-center gap-1.5 font-medium px-2.5 py-1 ${getBadgeStyles()}`}>
                {getIcon()}
                {feed.type === 'daily-updates' ? 'DAILY UPDATE' : feed.type.toUpperCase()}
              </Badge>
              {feed.source && feed.type !== 'news' && (
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate bg-slate-100/80 dark:bg-slate-800/80 px-2 py-1 rounded-md">
                  {feed.source}
                </span>
              )}
            </div>
            <CardTitle className="text-xl leading-tight font-bold text-slate-900 dark:text-slate-100">
              {feed.type === 'news' && feed.source ? (
                <Link
                  href={`/tech-news?source=${encodeURIComponent(feed.source)}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
                >
                  <span className="group-hover:underline">{feed.title}</span>
                </Link>
              ) : feed.type === 'rss' && feed.link ? (
                <Link
                  href={`/tech-blogs?url=${encodeURIComponent(feed.link)}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
                >
                  <span className="group-hover:underline">{feed.title}</span>
                </Link>
              ) : feed.link ? (
                isDailyUpdate ? (
                  <Link
                    href={feed.link}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2 cursor-pointer group"
                  >
                    <span className="group-hover:underline">{feed.title}</span>
                    <ExternalLink className="h-4 w-4 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ) : (
                  <a
                    href={feed.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2 cursor-pointer group"
                  >
                    <span className="group-hover:underline">{feed.title}</span>
                    <ExternalLink className="h-4 w-4 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                )
              ) : (
                feed.title
              )}
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
          {feed.date ? (() => {
            const feedDate = new Date(feed.date);
            const now = new Date();
            const diffInHours = (now.getTime() - feedDate.getTime()) / (1000 * 60 * 60);

            if (diffInHours < 24) {
              return formatRelativeTime(feedDate);
            } else {
              return feedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
            }
          })() : 'No date'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {language === "en" && feed.summary_english && (
          <div className="space-y-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-100 dark:border-blue-900/50">
            <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">Summary</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{feed.summary_english}</p>
          </div>
        )}

        {language === "zh" && feed.summary_chinese && (
          <div className="space-y-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-100 dark:border-purple-900/50">
            <h4 className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide">摘要</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{feed.summary_chinese}</p>
          </div>
        )}

        {language === "en" && !feed.summary_english && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">No English summary available</p>
          </div>
        )}

        {language === "zh" && !feed.summary_chinese && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">暂无中文摘要</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
