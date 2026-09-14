'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ExternalLink } from 'lucide-react';

export function CodeDiffSection() {
  const [activeTab, setActiveTab] = useState<'diff' | 'review' | 'checks' | 'files'>('diff');

  const checklistItems = [
    'Understands project context',
    'Provides actionable suggestions',
    'Learns from your code patterns',
    'Helps maintain consistency',
  ];

  return (
    <section className="py-20 lg:py-28 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Code Diff Mockup Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden text-left">
              {/* Diff Header Tabs */}
              <div className="flex items-center px-4 pt-3 border-b border-slate-100 dark:border-slate-800 gap-6 text-xs">
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`pb-2.5 font-semibold transition-colors relative ${
                    activeTab === 'diff'
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  Diff
                  {activeTab === 'diff' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('review')}
                  className="pb-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium transition-colors"
                >
                  AI Review
                </button>
                <button
                  onClick={() => setActiveTab('checks')}
                  className="pb-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium transition-colors"
                >
                  Checks
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className="pb-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium transition-colors"
                >
                  Files
                </button>
              </div>

              {/* File Title Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
                  src/lib/auth.ts
                </span>
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>

              {/* Code Diff Body */}
              <div className="p-4 font-mono text-[11px] sm:text-xs leading-6 overflow-x-auto select-none">
                <div className="flex gap-4 text-slate-400">
                  <span className="w-5 text-right text-slate-400">21</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    <span className="text-purple-600 dark:text-purple-400">export const</span>{' '}
                    <span className="text-blue-600 dark:text-blue-400">signToken</span> = (user:
                    User) =&gt; &#123;
                  </span>
                </div>
                <div className="flex gap-4 text-slate-400">
                  <span className="w-5 text-right text-slate-400">22</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {'  '}
                    <span className="text-purple-600 dark:text-purple-400">return</span>;
                  </span>
                </div>
                {/* Deleted line */}
                <div className="flex gap-4 bg-red-50/80 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-2 -mx-2 rounded-sm">
                  <span className="w-5 text-right text-red-500/70">-</span>
                  <span>
                    {'  '}
                    <span className="text-purple-600 dark:text-purple-400">const</span> secret ={' '}
                    <span className="text-amber-700 dark:text-amber-300">
                      &quot;my-secret-key&quot;
                    </span>
                  </span>
                </div>
                {/* Added line */}
                <div className="flex gap-4 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-2 -mx-2 rounded-sm">
                  <span className="w-5 text-right text-emerald-500/70">+</span>
                  <span>
                    {'  '}
                    <span className="text-purple-600 dark:text-purple-400">const</span> secret =
                    process.env.AUTH_SECRET
                  </span>
                </div>
                {/* Context lines */}
                <div className="flex gap-4 text-slate-400">
                  <span className="w-5 text-right text-slate-400">25</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {'  '}
                    <span className="text-purple-600 dark:text-purple-400">return</span> jwt.sign(
                  </span>
                </div>
                <div className="flex gap-4 text-slate-400">
                  <span className="w-5 text-right text-slate-400">26</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {'    '}&#123; id: user.id, email: user.email &#125;,
                  </span>
                </div>
                <div className="flex gap-4 text-slate-400">
                  <span className="w-5 text-right text-slate-400">27</span>
                  <span className="text-slate-700 dark:text-slate-300">{'    '}secret,</span>
                </div>
                <div className="flex gap-4 text-slate-400">
                  <span className="w-5 text-right text-slate-400">28</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {'    '}&#123; expiresIn:{' '}
                    <span className="text-amber-700 dark:text-amber-300">&quot;7d&quot;</span>{' '}
                    &#125;
                  </span>
                </div>
                <div className="flex gap-4 text-slate-400">
                  <span className="w-5 text-right text-slate-400">29</span>
                  <span className="text-slate-700 dark:text-slate-300">{'  '});</span>
                </div>
                <div className="flex gap-4 text-slate-400">
                  <span className="w-5 text-right text-slate-400">30</span>
                  <span className="text-slate-700 dark:text-slate-300">&#125;;</span>
                </div>
              </div>

              {/* Inline AI Review Comment Box */}
              <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-3.5 flex items-start gap-3">
                <div className="size-6 rounded-md bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
                  R
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      ReviewRay
                    </span>
                    <span className="text-[11px] text-slate-400">2 minutes ago</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                    Hardcoded JWT secret found. Consider using environment variables for better
                    security.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Checklist */}
          <div className="lg:col-span-5">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50 mb-6">
              <span className="size-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              More than just linting
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.12] text-slate-950 dark:text-white">
              Reviews with
              <br />
              real understanding.
            </h2>

            <p className="mt-5 text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              ReviewRay uses Retrieval-Augmented Generation (RAG) to understand your codebase,
              architecture, and intent so you get relevant, high-signal feedback.
            </p>

            {/* Checklist */}
            <ul className="mt-8 space-y-3.5">
              {checklistItems.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                    <Check className="size-3 stroke-[2.5]" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
