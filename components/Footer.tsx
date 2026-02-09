"use client";

import Link from "next/link";
import { Facebook, Github, Linkedin } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const discoverLinks = [
    { href: "/daily-updates", label: t(trans.nav.dailyUpdates) },
    { href: "/hacker-discussions", label: t(trans.nav.hackerDiscussions) },
    { href: "/tech-blogs", label: t(trans.nav.techBlogs) },
    { href: "/tech-news", label: t(trans.nav.industryNews) },
  ];

  const knowledgeLinks = [
    { href: "/deep-dives", label: t(trans.nav.deepDives) },
    { href: "/postgresql-internals", label: t(trans.nav.postgresqlInternals) },
    { href: "/research-papers", label: t(trans.nav.researchPapers) },
    { href: "/conferences-talks", label: t(trans.nav.conferencesTalks) },
  ];

  const communityLinks = [
    { href: "/hacker-profiles", label: t(trans.nav.hackerProfiles) },
    { href: "/events-meetups", label: t(trans.nav.eventsMeetups) },
    { href: "/institutions", label: t(trans.nav.institutions) },
    { href: "/hiring", label: t(trans.nav.hiring) },
  ];

  const labLinks = [
    { href: "/sandboxes", label: t(trans.nav.sandboxes) },
    { href: "/case-studies", label: t(trans.nav.caseStudies) },
    { href: "/experiments", label: t(trans.nav.experiments) },
  ];

  const servicesLinks = [
    { href: "/apis", label: t(trans.nav.apis) },
    { href: "/request-feature", label: t(trans.nav.requestFeature) },
    { href: "/collaborations", label: t(trans.nav.collaborations) },
  ];

  return (
    <footer className="backdrop-blur-md bg-slate-900/95 dark:bg-slate-950/95 border-t border-slate-700/50 mt-16">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Logo and Tagline */}
          <div className="lg:col-span-2">
            <Link href="/home" className="inline-block mb-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                PGNexus
              </h2>
            </Link>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              {t(trans.footer.tagline)}
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all cursor-pointer"
                aria-label="X (formerly Twitter)"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-blue-500 transition-all cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all cursor-pointer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-blue-400 transition-all cursor-pointer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t(trans.footer.discover)}</h3>
            <ul className="space-y-2">
              {discoverLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Knowledge */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t(trans.footer.knowledge)}</h3>
            <ul className="space-y-2">
              {knowledgeLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Lab */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t(trans.footer.community)}</h3>
            <ul className="space-y-2 mb-6">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-semibold mb-4">{t(trans.footer.lab)}</h3>
            <ul className="space-y-2">
              {labLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Explore */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t(trans.footer.services)}</h3>
            <ul className="space-y-2 mb-6">
              {servicesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-semibold mb-4">{t(trans.footer.more)}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/feeds"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  {t(trans.nav.explore)}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {currentYear} PGNexus. {t(trans.footer.copyright)}
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy-policy"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                {t(trans.footer.privacyPolicy)}
              </Link>
              <Link
                href="/terms-of-service"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                {t(trans.footer.termsOfService)}
              </Link>
              <Link
                href="/cookie-policy"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                {t(trans.footer.cookiePolicy)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
