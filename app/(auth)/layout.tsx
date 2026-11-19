import Link from 'next/link';
import { requireUnauth } from '@/features/auth/actions';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await requireUnauth();

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-blue-500/8 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle matrix code glyphs background */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025] dark:opacity-[0.04] font-mono text-xs leading-loose overflow-hidden">
        <p className="break-words">
          01010010 01100101 01110110 01101001 01100101 01110111 01010010 01100001 01111001
          auth.callback(github) =&gt; session.create(&#123; user, token, secure: true &#125;)
          01010010 01100101 01110110 01101001 01100101 01110111 01010010 01100001 01111001
        </p>
      </div>

      {/* Top Bar with back to home */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to home</span>
        </Link>

        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <Sparkles className="size-3.5" />
          </div>
          <span className="font-sans text-sm font-bold tracking-tight text-slate-950 dark:text-white">
            ReviewRay
          </span>
        </Link>
      </div>

      {/* Main Centered Card Container */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>Secured by GitHub OAuth and OpenAI Enterprise APIs</p>
      </div>
    </div>
  );
}
