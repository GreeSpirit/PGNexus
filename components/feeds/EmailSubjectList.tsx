"use client";

import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

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

interface EmailSubjectListProps {
  subjects: EmailSubject[];
  language: "en" | "zh";
}

export function EmailSubjectList({ subjects, language }: EmailSubjectListProps) {
  const [subjectEntries, setSubjectEntries] = useState<Record<string, EmailEntry | null>>({});
  const [fetchedSubjects, setFetchedSubjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Fetch the latest entry for each subject
    subjects.forEach(async (subject) => {
      if (!fetchedSubjects.has(subject.subject)) {
        setFetchedSubjects((prev) => new Set(prev).add(subject.subject));
        try {
          const response = await fetch(
            `/api/email-feeds/by-subject?subject=${encodeURIComponent(subject.subject)}&limit=1&offset=0`
          );
          const data = await response.json();

          if (data.entries && data.entries.length > 0) {
            setSubjectEntries((prev) => ({
              ...prev,
              [subject.subject]: data.entries[0],
            }));
          }
        } catch (error) {
          console.error("Error fetching subject entry:", error);
        }
      }
    });
  }, [subjects, fetchedSubjects]);

  const formatDate = (dateString: string) => {
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

  if (subjects.length === 0) {
    return (
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-16 text-center">
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">No email discussions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subjects.map((subject) => {
        const entry = subjectEntries[subject.subject];
        let participants: string[] = [];

        if (entry?.participants) {
          try {
            const parsed = JSON.parse(entry.participants);
            if (Array.isArray(parsed)) {
              participants = parsed;
            }
          } catch (e) {}
        }

        return (
          <div
            key={subject.subject}
            className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg border-l-4 border-l-blue-500 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="flex items-center gap-1.5 font-medium px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                  <Mail className="h-4 w-4" />
                  EMAIL
                </Badge>
              </div>

              <Link
                href={`/hacker-discussions?subject=${encodeURIComponent(subject.subject)}`}
                className="block mb-3 group"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
                  {subject.subject}
                </h3>
              </Link>

              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Last activity: {formatDate(subject.lastactivity)}
              </p>

              {entry && (
                <>
                  {language === "en" && entry.summary && (
                    <div className="space-y-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-100 dark:border-blue-900/50 mb-3">
                      <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                        Latest Discussion Summary
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {entry.summary}
                      </p>
                    </div>
                  )}

                  {language === "zh" && entry.summary_zh && (
                    <div className="space-y-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-100 dark:border-purple-900/50 mb-3">
                      <h4 className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                        最新讨论摘要
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {entry.summary_zh}
                      </p>
                    </div>
                  )}

                  {participants.length > 0 && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                        Participants
                      </h4>
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
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
