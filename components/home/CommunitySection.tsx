"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";
import { Users, Globe, FileText, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommunitySection() {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Users,
      count: t(trans.communitySection.membersCount),
      label: t(trans.communitySection.membersLabel),
    },
    {
      icon: Globe,
      count: t(trans.communitySection.countriesCount),
      label: t(trans.communitySection.countriesLabel),
    },
    {
      icon: FileText,
      count: t(trans.communitySection.postsCount),
      label: t(trans.communitySection.postsLabel),
    },
    {
      icon: Calendar,
      count: t(trans.communitySection.eventsCount),
      label: t(trans.communitySection.eventsLabel),
    },
  ];

  const testimonials = [
    {
      name: t(trans.communitySection.testimonial1Name),
      role: t(trans.communitySection.testimonial1Role),
      text: t(trans.communitySection.testimonial1Text),
      rating: 5,
    },
    {
      name: t(trans.communitySection.testimonial2Name),
      role: t(trans.communitySection.testimonial2Role),
      text: t(trans.communitySection.testimonial2Text),
      rating: 5,
    },
  ];

  return (
    <section className="py-16">
      <div className="space-y-12">
        {/* Main Content Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Title + Stats + Subscribe */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                {t(trans.communitySection.title)}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {t(trans.communitySection.subtitle)}
              </p>
            </div>

            {/* Stats - Compact Grid */}
            <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-6">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {stat.count}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subscribe Section */}
            <div className="backdrop-blur-md bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {t(trans.communitySection.subscribeTitle)}
                </h3>
             
                <div className="space-y-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm mt-0.5">
                      ✅
                    </div>
                    <p className="text-blue-100">
                       {t(trans.communitySection.subscribeSubtitlebyFirst)}
                    </p>
                  </div>
          
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm mt-0.5">
                      ✅
                    </div>
                    <p className="text-blue-100">
                       {t(trans.communitySection.subscribeSubtitle)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Button
                    asChild
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 shadow-md cursor-pointer whitespace-nowrap"
                  >
                    <a href="https://lists.ivorysql.org/postorius/lists/pgtechdailycn.ivorysql.org/" target="_blank" rel="noopener noreferrer">
                      {t(trans.communitySection.daySubscribeButton)}
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 shadow-md cursor-pointer whitespace-nowrap"
                  >
                    <a href="https://lists.ivorysql.org/postorius/lists/pgtechweeklycn.ivorysql.org/" target="_blank" rel="noopener noreferrer">
                      {t(trans.communitySection.weekSubscribeButton)}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials - Right */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                {t(trans.communitySection.testimonialsTitle)}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {t(trans.communitySection.testimonialsSubtitle)}
              </p>
            </div>
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
