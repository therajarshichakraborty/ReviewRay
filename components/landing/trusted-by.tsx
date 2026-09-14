import React from 'react';

export function TrustedBy() {
  return (
    <section className="py-14 border-y border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-400 dark:text-slate-500 mb-8">
          TRUSTED BY DEVELOPERS AT
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-14 gap-y-6">
          {/* Vercel */}
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-default">
            <svg className="size-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L24 22H0L12 2Z" />
            </svg>
            <span className="font-bold text-sm tracking-tight">Vercel</span>
          </div>

          {/* GitHub */}
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-default">
            <svg className="size-4.5 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span className="font-bold text-sm tracking-tight">GitHub</span>
          </div>

          {/* Linear */}
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-default">
            <svg className="size-4.5 fill-current" viewBox="0 0 24 24">
              <path
                d="M3.5 6.5C3.5 4.843 4.843 3.5 6.5 3.5H17.5C19.157 3.5 20.5 4.843 20.5 6.5V17.5C20.5 19.157 19.157 20.5 17.5 20.5H6.5C4.843 20.5 3.5 19.157 3.5 17.5V6.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                d="M8 8L16 16M8 16L16 8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-bold text-sm tracking-tight">Linear</span>
          </div>

          {/* Supabase */}
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-default">
            <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
              <path
                d="M13.4 2.8C13.1 2.3 12.4 2.3 12.2 2.8L4.2 14.8C3.9 15.3 4.3 16 4.9 16H11.5L10.6 21.2C10.9 21.7 11.6 21.7 11.8 21.2L19.8 9.2C20.1 8.7 19.7 8 19.1 8H12.5L13.4 2.8Z"
                fill="#3ECF8E"
              />
            </svg>
            <span className="font-bold text-sm tracking-tight">Supabase</span>
          </div>

          {/* Cloudflare */}
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-default">
            <svg className="size-5 fill-[#F38020]" viewBox="0 0 24 24">
              <path d="M19.4 12.7c-.2-.9-.8-1.7-1.5-2.2-.4-.3-.8-.5-1.3-.6-.6-.1-1.2 0-1.8.2-.5-1.4-1.6-2.5-3-2.9-1.2-.4-2.5-.2-3.6.4-.9.5-1.6 1.3-1.9 2.3-.6-.2-1.3-.3-1.9-.1-1 .3-1.8 1-2.2 1.9-.4 1-.3 2.1.2 3 .5.9 1.4 1.5 2.5 1.6H19c.8 0 1.6-.3 2.2-.9.6-.6.9-1.4.9-2.2 0-.2 0-.4-.1-.5l-2.6-.1z" />
            </svg>
            <span className="font-bold text-sm tracking-tight">Cloudflare</span>
          </div>

          {/* Notion */}
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-default">
            <svg className="size-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.455-.653c.653 0 .42-.466.28-.793L17.29 1.83C16.824 1.13 16.03 1 14.863 1.093L2.966 2.027c-.7.047-.933.42-.56 1.027l2.053 3.154zm1.493 4.292v11.756c0 .933.467 1.306 1.494 1.213l13.136-.793c1.026-.047 1.306-.653 1.306-1.493V7.521c0-.84-.373-1.213-1.213-1.12l-13.323.793c-.933.093-1.4.56-1.4 1.306zm12.316.933c.093.42 0 .84-.42.887l-1.027.233v7.417c-1.12.653-2.24 1.026-3.08 1.026-.84 0-1.26-.373-1.726-1.166l-3.546-5.83v5.412l1.4.327c.093.42 0 .84-.42.887l-3.266.186c-.093-.42 0-.84.42-.887l1.027-.233V10.13l-1.4-.14c-.093-.42 0-.84.42-.887l3.406-.233 3.733 5.923V9.663l-1.166-.14c-.093-.42 0-.84.42-.887l3.267-.233.933.42z" />
            </svg>
            <span className="font-bold text-sm tracking-tight">Notion</span>
          </div>

          {/* Stripe */}
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-default">
            <svg className="size-4.5 fill-[#635BFF]" viewBox="0 0 24 24">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697.5 12.834.5 7.42.5 3.5 3.365 3.5 8.014c0 4.254 3.42 6.07 7.027 7.394 2.378.878 3.537 1.54 3.537 2.59 0 .979-.834 1.472-2.228 1.472-2.585 0-5.352-1.109-7.234-2.148L3.5 22.846C5.586 23.822 8.68 24.5 11.838 24.5c5.688 0 9.662-2.735 9.662-7.518 0-4.48-3.486-6.28-7.524-7.832z" />
            </svg>
            <span className="font-bold text-sm tracking-tight">Stripe</span>
          </div>
        </div>
      </div>
    </section>
  );
}
