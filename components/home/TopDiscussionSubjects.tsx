"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

interface TopSubject {
  subject: string;
  subject_zh?: string;
  count: number;
}

interface TopDiscussionSubjectsProps {
  subjects: TopSubject[];
  maxJobId: number;
}

export function TopDiscussionSubjects({ subjects, maxJobId }: TopDiscussionSubjectsProps) {
  const { t, language } = useLanguage();

  return (
    <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-6">
      <Link href="/hacker-discussions" className="block mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
          {t(trans.homePage.topDiscussionSubjects)}
        </h3>
      </Link>
      <div className="space-y-4">
        {subjects.map((subject, index) => {
          // Choose subject based on current language, fallback to English if Chinese is not available
          const displaySubject = language === "zh" && subject.subject_zh ? subject.subject_zh : subject.subject;
          const percentage = ((subject.count / maxJobId) * 100);
          const displayPercentage = percentage.toFixed(1);
          const gradientColors = [
            'from-blue-600 to-indigo-600',
            'from-purple-600 to-pink-600',
            'from-green-600 to-emerald-600',
            'from-orange-600 to-red-600',
            'from-cyan-600 to-teal-600',
          ];
          const gradient = gradientColors[index % gradientColors.length];

          return (
            <Link
              key={index}
              href={`/hacker-discussions?subject=${encodeURIComponent(subject.subject)}`}
              className="block space-y-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300 line-clamp-1 flex-1 pr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {displaySubject}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-semibold shrink-0">
                  {displayPercentage}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </Link>
          );
        })}
        {subjects.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">
            No discussion data available
          </p>
        )}
      </div>
    </div>
  );
}
