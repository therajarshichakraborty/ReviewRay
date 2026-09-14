import React from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, GitBranch, Layers, Lock, Gauge, Target } from 'lucide-react';

interface FeaturesSectionProps {
  isLoggedIn?: boolean;
}

export function FeaturesSection({ isLoggedIn }: FeaturesSectionProps) {
  const features = [
    {
      icon: <Code2 className="size-5" />,
      title: 'Contextual Reviews',
      description: 'Understands your entire codebase, not just the diff.',
    },
    {
      icon: <GitBranch className="size-5" />,
      title: 'Finds Real Issues',
      description: 'Catches bugs, edge cases, and security risks.',
    },
    {
      icon: <Layers className="size-5" />,
      title: 'Works on Any Stack',
      description: 'Supports all major languages and frameworks.',
    },
    {
      icon: <Lock className="size-5" />,
      title: 'Private by Default',
      description: 'Your code stays in your GitHub account.',
    },
    {
      icon: <Gauge className="size-5" />,
      title: 'Fast and Reliable',
      description: 'Get comprehensive reviews in seconds.',
    },
    {
      icon: <Target className="size-5" />,
      title: 'Actionable Feedback',
      description: 'Clear explanations and suggestions you can apply.',
    },
  ];

  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Heading, description, action buttons */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50 mb-6">
            <span className="size-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            Built for developers
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.12] text-slate-950 dark:text-white">
            Everything you need
            <br />
            for high-quality code.
          </h2>

          <p className="mt-5 text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-md font-normal">
            From contextual reviews to security checks, ReviewRay helps your team ship better code,
            faster.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              href={isLoggedIn ? '/dashboard' : '/sign-in'}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-semibold shadow-sm transition-all"
            >
              Explore features
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-semibold shadow-sm transition-all"
            >
              View pricing
            </Link>
          </div>
        </div>

        {/* Right Column: 2x3 Grid of Features */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200"
            >
              {/* Icon */}
              <div className="size-10 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
