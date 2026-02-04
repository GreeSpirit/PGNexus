"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

interface TopSubject {
  subject: string;
  count: number;
}

interface TopDiscussionSubjectsProps {
  subjects: TopSubject[];
  maxJobId: number;
}

export function TopDiscussionSubjects({ subjects, maxJobId }: TopDiscussionSubjectsProps) {
  const { t } = useLanguage();

  return (
    <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        {t(trans.homePage.topDiscussionSubjects)}
      </h3>
      <div className="space-y-4">
        {subjects.map((subject, index) => {
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
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300 line-clamp-1 flex-1 pr-2">
                  {subject.subject}
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
            </div>
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
