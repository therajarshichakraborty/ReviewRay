import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

interface CtaBannerSectionProps {
  isLoggedIn?: boolean;
}

export function CtaBannerSection({ isLoggedIn }: CtaBannerSectionProps) {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
      {/* Subtle ASCII / Code Matrix Pattern Background (Aceternity Image 2 style) */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.035] dark:opacity-[0.05] font-mono text-xs leading-loose overflow-hidden">
        <p className="break-words">
          01010100 01100101 01110011 01110100 {'{'} const token = verify(jwt); if (!token) return error; {'}'} 
          git checkout -b feature/precision-review && npm run build --release 1440x900 #0066FF 0x2A7F
          type ReviewPipeline = &#123; ast: ASTNode; model: &apos;gpt-4o-mini&apos;; latency: number; emojis: 0; &#125;
          function analyzeAST(diff: GitDiff): PrecisionReport &#123; return diff.filter(isVulnerable); &#125;
          01010100 01100101 01110011 01110100 {'{'} const token = verify(jwt); if (!token) return error; {'}'} 
          git checkout -b feature/precision-review && npm run build --release 1440x900 #0066FF 0x2A7F
          type ReviewPipeline = &#123; ast: ASTNode; model: &apos;gpt-4o-mini&apos;; latency: number; emojis: 0; &#125;
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Main Headline with Aceternity Inspect Selection Box (Image 2 style) */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-slate-950 dark:text-white leading-[1.12]">
          Stop waiting on
          <br className="hidden sm:inline" />{' '}
          <span className="relative inline-block mt-2 sm:mt-0">
            {/* Outer selection border */}
            <span className="relative z-10 px-2 py-1 border border-blue-500/80 dark:border-blue-400 bg-blue-50/30 dark:bg-blue-950/20 rounded-md">
              pull request reviews.
              {/* Corner selection square handles */}
              <span className="absolute -top-1 -left-1 size-2 bg-white border border-blue-600 rounded-xs" />
              <span className="absolute -top-1 -right-1 size-2 bg-white border border-blue-600 rounded-xs" />
              <span className="absolute -bottom-1 -left-1 size-2 bg-white border border-blue-600 rounded-xs" />
              <span className="absolute -bottom-1 -right-1 size-2 bg-white border border-blue-600 rounded-xs" />
            </span>
            {/* Floating dimension tag below selection box */}
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-5 z-20 font-mono text-[9px] font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-sm shadow-xs uppercase tracking-wider">
              1440 x 900
            </span>
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-8 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-normal leading-relaxed">
          Connect your GitHub repositories in two minutes. Your first automated review is already waiting.
        </p>

        {/* Action Buttons (Solid Blue + White Outline) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={isLoggedIn ? '/dashboard' : '/sign-in'}
            className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 transition-all"
          >
            <span>Start reviewing</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center h-11 px-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs sm:text-sm font-semibold shadow-xs transition-all"
          >
            Book a demo
          </Link>
        </div>

        {/* Feature Checkpoints */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
            No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
            Official OpenAI pipeline
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
            Zero emoji clutter
          </span>
        </div>
      </div>
    </section>
  );
}
