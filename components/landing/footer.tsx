import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { GitHubIcon, XIcon, LinkedInIcon } from './icons';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 pt-16 pb-12 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4-Column Grid matching Aceternity Image 2 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-14 border-b border-slate-100 dark:border-slate-800/80 text-left">
          {/* Brand Column (spans 2 on md) */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <Sparkles className="size-4" />
              </div>
              <span className="font-sans text-base font-bold tracking-tight text-slate-950 dark:text-white">
                ReviewRay
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-normal">
              The AI code reviewing engine that runs on your codebase.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="size-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
              >
                <GitHubIcon className="size-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="size-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
              >
                <XIcon className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="size-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
              >
                <LinkedInIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/#features"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Canvas
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Handoff
                </Link>
              </li>
              <li>
                <Link
                  href="/#codebase-review"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Review
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Developers
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Docs
                </a>
              </li>
              <li>
                <Link
                  href="/#cli"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  CLI
                </Link>
              </li>
              <li>
                <Link
                  href="/#github-app"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  GitHub app
                </Link>
              </li>
              <li>
                <Link
                  href="/#api"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  API reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/#about"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#careers"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/#blog"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500 dark:text-slate-400">
          <p>&copy; 2026 ReviewRay. Built with precision for developers.</p>

          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-600 dark:text-slate-300">
              OpenAI Engine Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
