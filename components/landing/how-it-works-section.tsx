import React from 'react';
import { ArrowRight, FolderGit2, Sparkles } from 'lucide-react';
import { GitHubIcon } from './icons';

export function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      icon: <GitHubIcon className="size-6 text-slate-900 dark:text-white" />,
      title: 'Connect GitHub',
      description: 'Install the app on your account or organization.',
    },
    {
      number: '2',
      icon: <FolderGit2 className="size-6 text-slate-900 dark:text-white" />,
      title: 'Select Repositories',
      description: 'Choose which repositories to enable.',
    },
    {
      number: '3',
      icon: <Sparkles className="size-6 text-slate-900 dark:text-white" />,
      title: 'Get AI Reviews',
      description: 'ReviewRay automatically reviews every pull request.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        {/* Centered Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50 mb-4">
          <Sparkles className="size-3 text-blue-500" />
          <span>How it works</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-[-0.03em] leading-tight text-slate-950 dark:text-white">
          From pull request to insights, in three steps.
        </h2>

        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 font-normal">
          Set it up once, and let ReviewRay handle the rest.
        </p>
      </div>

      {/* Steps Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-start">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center relative group px-4">
            {/* Step Number Badge */}
            <div className="size-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-100 dark:border-blue-900/50 mb-5">
              {step.number}
            </div>

            {/* Step Icon */}
            <div className="size-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-all">
              {step.icon}
            </div>

            {/* Title */}
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {step.title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed font-normal">
              {step.description}
            </p>

            {/* Connector Arrow for md and above */}
            {idx < steps.length - 1 && (
              <div className="hidden md:flex absolute top-16 -right-4 z-10 text-slate-400 dark:text-slate-600">
                <ArrowRight className="size-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
