import type { Metadata } from 'next';
import { Sparkles, ShieldCheck, Lock, Cpu } from 'lucide-react';
import { GithubSignInForm } from '@/features/auth/components/github-sign-in-form';

export const metadata: Metadata = {
  title: 'Sign in | ReviewRay',
  description: 'Sign in to ReviewRay with your GitHub account for precision AI code reviews.',
};

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const { callbackUrl } = await searchParams;

  return (
    <div className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-blue-500/5 text-center">
      {/* Aceternity Style Inspect Pill Tag */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50 mb-6">
        <span className="size-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
        <span>auth / github-oauth</span>
      </div>

      {/* ReviewRay Brand Icon */}
      <div className="mx-auto mb-5 size-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
        <Sparkles className="size-6" />
      </div>

      {/* Headline & Subtitle */}
      <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
        Welcome to ReviewRay
      </h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal max-w-sm mx-auto">
        Sign in with your GitHub account to start reviewing pull requests with AI precision.
      </p>

      {/* GitHub Sign-in Form */}
      <div className="mt-8">
        <GithubSignInForm callbackUrl={callbackUrl} />
      </div>

      {/* Permissions Note */}
      <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
        We request standard permissions to read metadata and post reviews. You can revoke access
        anytime from GitHub settings.
      </p>

      {/* Security & Feature Badges */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-left">
        <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400 mb-1" />
          <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">Zero Training</p>
          <p className="text-[9px] text-slate-400">Never trained on</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <Cpu className="size-3.5 text-blue-600 dark:text-blue-400 mb-1" />
          <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">OpenAI Engine</p>
          <p className="text-[9px] text-slate-400">Official gpt-4o</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <Lock className="size-3.5 text-blue-600 dark:text-blue-400 mb-1" />
          <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">Secure OAuth</p>
          <p className="text-[9px] text-slate-400">SOC-2 compliant</p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
