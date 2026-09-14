'use client';

import React, { useState } from 'react';
import { Folder, GitPullRequest, Sparkles, Home, Crown, MoreHorizontal } from 'lucide-react';
import { GitHubIcon } from './icons';

export function HeroMockup() {
  const [activeTab, setActiveTab] = useState<'review' | 'conversation' | 'checks' | 'files'>(
    'review',
  );
  const [questionInput, setQuestionInput] = useState('');

  return (
    <div className="relative w-full max-w-2xl mx-auto lg:max-w-none">
      {/* Glow effect behind mockup */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Mockup Window Container */}
      <div className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-950 shadow-2xl shadow-blue-500/10 dark:shadow-black/50 overflow-hidden text-left">
        <div className="grid grid-cols-12 min-h-[440px]">
          {/* Mini Sidebar */}
          <div className="hidden sm:flex col-span-4 flex-col justify-between p-3.5 border-r border-slate-100 dark:border-slate-800/70 bg-slate-50/60 dark:bg-slate-900/40">
            <div>
              {/* Brand in mockup */}
              <div className="flex items-center gap-2 mb-5 px-1 pt-1">
                <div className="size-5 rounded-md bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold text-[10px]">
                  R
                </div>
                <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
                  ReviewRay
                </span>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/60 cursor-default transition-colors">
                  <Home className="size-3.5 text-slate-500" />
                  <span>Overview</span>
                </div>
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/60 cursor-default transition-colors">
                  <Folder className="size-3.5 text-slate-500" />
                  <span>Repositories</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold cursor-default">
                  <div className="flex items-center gap-2.5">
                    <GitPullRequest className="size-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Pull Requests</span>
                  </div>
                  <span className="text-[10px] bg-blue-200/60 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 px-1.5 py-0.2 rounded-full">
                    3
                  </span>
                </div>
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/60 cursor-default transition-colors">
                  <Sparkles className="size-3.5 text-slate-500" />
                  <span>AI Reviews</span>
                </div>
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/60 cursor-default transition-colors">
                  <GitHubIcon className="size-3.5 text-slate-500" />
                  <span>GitHub App</span>
                </div>
              </div>
            </div>

            {/* Upgrade to Pro card in sidebar */}
            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-2.5 mt-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Crown className="size-3 text-amber-500" />
                <span className="text-[11px] font-semibold text-slate-900 dark:text-white">
                  Upgrade to Pro
                </span>
              </div>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">
                Get unlimited reviews and advanced insights.
              </p>
            </div>
          </div>

          {/* Main Review Pane */}
          <div className="col-span-12 sm:col-span-8 p-4 flex flex-col justify-between bg-white dark:bg-slate-950">
            <div>
              {/* Breadcrumbs & Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/70 text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span>Pull Requests</span>
                  <span>&gt;</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">#42</span>
                </div>
                <button
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  aria-label="Options"
                >
                  <MoreHorizontal className="size-3.5" />
                </button>
              </div>

              {/* Title & Status */}
              <div className="mt-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  feat: implement authentication pages
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800 font-medium">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Open
                  </span>
                  <span>therajarshichakraborty</span>
                  <span>•</span>
                  <span>opened 2h ago</span>
                  <span>•</span>
                  <span>main &rarr; feature/auth</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-4 mt-3 border-b border-slate-100 dark:border-slate-800 text-[11px]">
                <button
                  onClick={() => setActiveTab('review')}
                  className={`pb-1.5 font-semibold flex items-center gap-1 transition-colors relative ${
                    activeTab === 'review'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  AI Review
                  <span className="text-[9px] px-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">
                    12
                  </span>
                  {activeTab === 'review' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('conversation')}
                  className="pb-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
                >
                  Conversation <span className="text-[9px] text-slate-400">4</span>
                </button>
                <button
                  onClick={() => setActiveTab('checks')}
                  className="pb-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
                >
                  Checks <span className="text-[9px] text-slate-400">2</span>
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className="pb-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
                >
                  Files <span className="text-[9px] text-slate-400">6</span>
                </button>
              </div>

              {/* Review Cards Stack */}
              <div className="mt-3 space-y-2">
                {/* Review Summary */}
                <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex items-start gap-2.5">
                  <div className="size-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="size-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white">
                      Review Summary
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                      The implementation is solid overall. A few improvements can help with
                      security, error handling, and consistency.
                    </p>
                  </div>
                </div>

                {/* Issue 1: Security */}
                <div className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="size-5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      A
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-900 dark:text-white">
                          Potential security issue
                        </span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-400">auth.ts Line 24</div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
                        Hardcoded JWT secret found. Consider using environment variables.
                      </p>
                    </div>
                  </div>
                  <button className="h-6 px-2.5 text-[10px] font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-2xs transition-colors shrink-0">
                    Fix
                  </button>
                </div>

                {/* Issue 2: Error handling */}
                <div className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="size-5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      A
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-900 dark:text-white">
                          Improve error handling
                        </span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-400">login.tsx Line 56</div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
                        Add proper error handling for failed sign in attempts.
                      </p>
                    </div>
                  </div>
                  <button className="h-6 px-2.5 text-[10px] font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-2xs transition-colors shrink-0">
                    Show
                  </button>
                </div>

                {/* Issue 3: Code style */}
                <div className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="size-5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      i
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-900 dark:text-white">
                          Code style suggestion
                        </span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-400">useAuth.ts Line 50</div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
                        Consider extracting the auth logic into a seperate hook.
                      </p>
                    </div>
                  </div>
                  <button className="h-6 px-2.5 text-[10px] font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-2xs transition-colors shrink-0">
                    Show
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Question Input */}
            <div className="mt-3 pt-2">
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-slate-400 font-mono text-xs">✦</span>
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  className="w-full h-8 pl-7 pr-8 text-[11px] bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  aria-label="Submit question"
                  className="absolute right-1.5 size-5 flex items-center justify-center rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="font-bold text-[10px]">&gt;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hand-drawn Style Blue Annotation Below Mockup */}
      <div className="hidden md:flex items-center justify-end gap-2 mt-4 mr-8 select-none pointer-events-none">
        <div className="text-right">
          <p className="text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400 italic font-sans transform -rotate-2">
            Deeper insights.
          </p>
          <p className="text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400 italic font-sans transform -rotate-1">
            Happier developers.
          </p>
        </div>
        {/* Curved blue arrow pointing towards the mockup */}
        <svg
          className="w-10 h-10 text-blue-500 dark:text-blue-400 -translate-y-2 rotate-12"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 12 36 C 24 38, 38 32, 40 14" />
          <path d="M 32 16 L 40 14 L 42 22" />
        </svg>
      </div>
    </div>
  );
}
