'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ShieldAlert,
  Copy,
  ChevronRight,
  Code2,
  FileCode,
  Layers,
  Sliders,
  Moon,
  Zap,
} from 'lucide-react';

export function HeroMockup() {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState('auth-middleware.ts');

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Background soft ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-sky-500/15 rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Studio Window Frame */}
      <div className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-950 shadow-2xl shadow-blue-500/10 dark:shadow-black/70 overflow-hidden text-left">
        {/* Top Window Chrome Header */}
        <div className="h-11 px-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between text-xs">
          {/* macOS Window Controls */}
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-400/90 border border-red-500/30" />
            <span className="size-3 rounded-full bg-amber-400/90 border border-amber-500/30" />
            <span className="size-3 rounded-full bg-emerald-400/90 border border-emerald-500/30" />
            <span className="ml-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200">ReviewRay</span>
              <span>/</span>
              <span>checkout-service</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                main
              </span>
            </span>
          </div>

          {/* Center Canvas Tools (Aceternity Studio Style) */}
          <div className="hidden md:flex items-center gap-1 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-0.5 shadow-2xs">
            <button
              className="p-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:text-blue-700"
              title="Inspect"
            >
              <Code2 className="size-3.5" />
            </button>
            <button
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
              title="Layers"
            >
              <Layers className="size-3.5" />
            </button>
            <button
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
              title="Diff View"
            >
              <Sliders className="size-3.5" />
            </button>
            <button
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
              title="Automations"
            >
              <Sparkles className="size-3.5" />
            </button>
          </div>

          {/* Right Header: Reviewers & Primary Action */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex -space-x-1.5">
              <span className="size-6 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
                JD
              </span>
              <span className="size-6 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
                AI
              </span>
              <span className="size-6 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
                +2
              </span>
            </div>
            <button className="hidden sm:inline-flex items-center gap-1 h-7 px-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <span>&lt;/&gt; dev</span>
            </button>
            <button className="h-7 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold shadow-xs flex items-center gap-1.5 transition-colors">
              <Check className="size-3 stroke-[2.5]" />
              <span>Approve PR</span>
            </button>
          </div>
        </div>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-12 min-h-[460px]">
          {/* Left Sidebar: Changed Files & Engine Telemetry */}
          <div className="hidden lg:flex col-span-3 flex-col justify-between p-3 border-r border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/40 text-[11px]">
            <div>
              <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider mb-2 px-1">
                <span>Changed Files (4)</span>
                <span>Diff</span>
              </div>
              <div className="space-y-1">
                {[
                  { name: 'auth-middleware.ts', changes: '+12 -4', status: 'critical' },
                  { name: 'checkout-controller.ts', changes: '+45 -8', status: 'reviewed' },
                  { name: 'payment-gateway.ts', changes: '+18 -2', status: 'reviewed' },
                  { name: 'prisma/schema.prisma', changes: '+6 -0', status: 'clean' },
                ].map((file) => (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFile(file.name)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                      selectedFile === file.name
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/60 dark:border-blue-900/50'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="size-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 shrink-0">
                      {file.changes}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Engine Telemetry Card */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-3 mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400 uppercase">Engine</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Official OpenAI
                </span>
              </div>
              <div className="space-y-1 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Model:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">
                    gpt-4o-mini
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tokens:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    418 (minimal)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Noise filter:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    0 emojis / 0 dashes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Stage: Interactive Review & Code Diff Canvas */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-between bg-white dark:bg-slate-950 p-4 sm:p-5 relative">
            {/* Top Coordinate Ruler Marks */}
            <div className="hidden sm:flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2 mb-3 font-mono text-[9px] text-slate-400 select-none">
              <span>0</span>
              <span>100</span>
              <span>200</span>
              <span>300</span>
              <span>400</span>
              <span>500</span>
              <span>600</span>
            </div>

            {/* Finding Card */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                <div className="flex items-start gap-2.5">
                  <div className="size-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <ShieldAlert className="size-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        [High] Missing null validation on decoded token payload
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Location: <code className="font-mono text-blue-600 dark:text-blue-400">auth-middleware.ts:48</code>
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Mistake: <code className="font-mono">payload.userId</code> is accessed directly without verifying payload structure. An invalid token signature bypass could cause an unhandled runtime error.
                    </p>
                  </div>
                </div>
              </div>

              {/* Better Code Snippet Block */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-200 overflow-hidden font-mono text-xs shadow-xs">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/70 border-b border-slate-800 text-[11px]">
                  <span className="text-slate-400">Better Code Snippet</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    <span>{copied ? 'Copied' : 'Copy fix'}</span>
                  </button>
                </div>
                <div className="p-3 text-[11px] leading-5 overflow-x-auto space-y-1">
                  <div className="text-red-400/90 bg-red-950/40 px-2 py-0.5 rounded -mx-1">
                    - const userId = payload.userId;
                  </div>
                  <div className="text-emerald-400/90 bg-emerald-950/40 px-2 py-0.5 rounded -mx-1">
                    + const session = TokenPayloadSchema.safeParse(payload);
                  </div>
                  <div className="text-emerald-400/90 bg-emerald-950/40 px-2 py-0.5 rounded -mx-1">
                    + if (!session.success) return res.status(401).json(&#123; error: &apos;Invalid token&apos; &#125;);
                  </div>
                  <div className="text-emerald-400/90 bg-emerald-950/40 px-2 py-0.5 rounded -mx-1">
                    + const userId = session.data.userId;
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Floating Dock Bar (Image 1 Aceternity Style) */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 shadow-2xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">PR #142</span>
                <span>•</span>
                <span>Strict Security Check</span>
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="flex items-center gap-2">
                <span className="size-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <Zap className="size-3.5 text-blue-500" />
                </span>
                <span className="size-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <Moon className="size-3.5" />
                </span>
                <button className="h-7 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] shadow-xs flex items-center gap-1 transition-colors">
                  <Sparkles className="size-3" />
                  <span>All Access</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Inspector Properties (Image 1 Style) */}
          <div className="hidden lg:flex col-span-3 flex-col justify-between p-3.5 border-l border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/40 text-[11px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <span>Inspector</span>
                <span className="text-blue-600 dark:text-blue-400">@acme/ui</span>
              </div>

              {/* Inspector Attributes */}
              <div className="space-y-2.5">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">BUTTON / PRIMARY</span>
                  <div className="px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                    &lt;Button variant=&quot;primary&quot; /&gt;
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">SIZE</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] flex justify-between">
                      <span className="text-slate-400">W</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">272</span>
                    </div>
                    <div className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] flex justify-between">
                      <span className="text-slate-400">H</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">36</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">PROMPT / CONTEXT</span>
                  <div className="space-y-1 font-mono text-[10px]">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Strict mode:</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Replacement snippet:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Included</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Verdict:</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">Req Changes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800/70 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Handoff ready</span>
              <ChevronRight className="size-3 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
