"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { FeedCardWidget } from "@/components/dashboard/FeedCardWidget";
import { CommunitySection } from "@/components/home/CommunitySection";
import { WeeklyEmailChart } from "@/components/home/WeeklyEmailChart";
import { TopDiscussionSubjects } from "@/components/home/TopDiscussionSubjects";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";
import type { UnifiedFeed } from "@/lib/types/database";
import { Mail, FileCode, Users, ExternalLink, MessageCircle, Clock } from "lucide-react";

interface TopSubject {
  subject: string;
  count: number;
}

interface HomePageContentProps {
  rssFeeds: UnifiedFeed[];
  emailFeeds: UnifiedFeed[];
  newsFeeds: UnifiedFeed[];
  topSubjects: TopSubject[];
  maxJobId: number;
}

function FeedCard({
  feed,
  type,
  image,
}: {
  feed: UnifiedFeed;
  type: "rss" | "email" | "news";
  image: string;
}) {
  const { language } = useLanguage();

  // Choose summary based on current language
  const summary = language === "en" ? feed.summary_english : feed.summary_chinese;

  const CardContent = () => (
    <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={`/images/${image}`}
          alt={feed.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col h-[280px]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2 mb-3">
          {feed.title}
        </h3>

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

const formatDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
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

export function HomePageContent({ rssFeeds, emailFeeds, newsFeeds, topSubjects, maxJobId }: HomePageContentProps) {
  const { t, language } = useLanguage();
  const [weeklyTotals, setWeeklyTotals] = useState<{
    totalEmails: number;
    totalPatches: number;
    totalContributors: number;
  } | null>(null);

  useEffect(() => {
    async function fetchWeeklyTotals() {
      try {
        const response = await fetch('/api/email-stats/weekly-totals');
        if (response.ok) {
          const data = await response.json();
          setWeeklyTotals(data);
        }
      } catch (error) {
        console.error('Error fetching weekly totals:', error);
      }
    }
    fetchWeeklyTotals();
  }, []);

  const hackerStats = [
    {
      icon: Mail,
      count: weeklyTotals?.totalEmails?.toString() || t(trans.homePage.emailsThisWeekCount),
      label: t(trans.homePage.emailsThisWeek),
      color: "from-blue-600 to-indigo-600",
    },
    {
      icon: FileCode,
      count: weeklyTotals?.totalPatches?.toString() || t(trans.homePage.patchesSubmittedCount),
      label: t(trans.homePage.patchesSubmitted),
      color: "from-purple-600 to-pink-600",
    },
    {
      icon: Users,
      count: weeklyTotals?.totalContributors?.toString() || t(trans.homePage.activeContributorsCount),
      label: t(trans.homePage.activeContributors),
      color: "from-green-600 to-emerald-600",
    },
  ];

  return (
    <div className="space-y-12">
      {/* PostgreSQL Tech Blogs */}
      <FeedCardWidget
        feeds={rssFeeds}
        title={t(trans.homePage.techBlogsTitle)}
        type="rss"
        viewAllLink="/tech-blogs"
        description={t(trans.homePage.techBlogsDescription)}
      />

      {/* Hacker Discussions Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            {t(trans.homePage.hackerDiscussionsTitle)}
          </h2>
          <Link
            href="/hacker-discussions"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            {t(trans.homePage.viewAll)}
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {/* Description */}
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {t(trans.homePage.hackerDiscussionsDescription)}
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hackerStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-md`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {stat.count}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Email Activity Chart and Top Discussion Subjects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyEmailChart />
          <TopDiscussionSubjects subjects={topSubjects} maxJobId={maxJobId} />
        </div>

        {/* Discussion Cards */}
        <div className="space-y-4">
          {emailFeeds.slice(0, 3).map((feed) => {
            const summary = language === "en" ? feed.summary_english : feed.summary_chinese;
            const CardContent = () => (
              <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                      {feed.title}
                    </h3>
                    {summary && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">
                        {summary}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Clock className="h-4 w-4" />
                      {feed.date && (
                        <span>
                          {formatDate(feed.date)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );

            if (feed.link) {
              if (feed.link.startsWith('/')) {
                return (
                  <Link key={feed.id} href={feed.link}>
                    <CardContent />
                  </Link>
                );
              } else {
                return (
                  <a key={feed.id} href={feed.link} target="_blank" rel="noopener noreferrer">
                    <CardContent />
                  </a>
                );
              }
            }

            return <div key={feed.id}><CardContent /></div>;
          })}
        </div>
      </div>

      {/* Industry News */}
      <FeedCardWidget
        feeds={newsFeeds}
        title={t(trans.homePage.industryNewsTitle)}
        type="news"
        viewAllLink="/tech-news"
        description={t(trans.homePage.industryNewsDescription)}
      />

      {/* Community Section */}
      <CommunitySection />
    </div>
  );
}
