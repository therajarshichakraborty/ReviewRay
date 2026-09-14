import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { GitHubIcon } from './icons';

interface CtaBannerSectionProps {
  isLoggedIn?: boolean;
}

export function CtaBannerSection({ isLoggedIn }: CtaBannerSectionProps) {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-br from-blue-50/50 via-white to-slate-50/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xl shadow-blue-500/5">
        {/* Soft decorative background glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Heading, buttons, checklist */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50 mb-6">
              <span className="size-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              Ready to build better?
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] leading-tight text-slate-950 dark:text-white">
              Start reviewing smarter, today.
            </h2>

            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 font-normal">
              Join developers who ship better code with ReviewRay.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href={isLoggedIn ? '/dashboard' : '/sign-in'}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs sm:text-sm font-semibold shadow-sm transition-all"
              >
                Get started for free
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs sm:text-sm font-semibold shadow-sm transition-all"
              >
                View pricing
              </Link>
            </div>

            {/* Value checklist */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-slate-800 dark:text-slate-200 stroke-[2.5]" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-slate-800 dark:text-slate-200 stroke-[2.5]" />2
                minute setup
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-slate-800 dark:text-slate-200 stroke-[2.5]" />
                Cancel anytime
              </span>
            </div>
          </div>

          {/* Right Column: Isometric GitHub Glass Card Illustration */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-64 sm:w-72 aspect-square flex items-center justify-center">
              {/* Layered Glass Isometric Card */}
              <div className="absolute inset-4 rounded-3xl bg-blue-100/50 dark:bg-blue-900/20 transform rotate-6 border border-blue-200/40 dark:border-blue-800/30" />
              <div className="relative size-44 sm:size-48 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col items-center justify-center backdrop-blur-md">
                <div className="size-16 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner">
                  <GitHubIcon className="size-10" />
                </div>
                <span className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                  GitHub Native
                </span>
                <span className="text-[10px] text-slate-400">One-click install</span>
              </div>
            </div>

            {/* Hand-drawn Arrow & Script Annotation */}
            <div className="flex items-center gap-2 -mt-4 select-none pointer-events-none">
              <div className="text-right">
                <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 italic transform -rotate-2">
                  Connect GitHub
                </p>
                <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 italic transform -rotate-1">
                  and get instant AI reviews.
                </p>
              </div>
              <svg
                className="w-8 h-8 text-blue-500 dark:text-blue-400 -translate-y-2 rotate-12"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 10 36 C 22 36, 36 28, 38 12" />
                <path d="M 30 14 L 38 12 L 40 20" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
