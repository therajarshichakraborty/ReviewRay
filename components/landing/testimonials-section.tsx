import React from 'react';
import { Sparkles } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        'ReviewRay has become an essential part of our workflow. The feedback is incredibly relevant and helps us maintain high code quality.',
      author: 'Ananya Sharma',
      role: 'Senior Software Engineer',
      initial: 'A',
    },
    {
      quote:
        'It understands our codebase remarkably well. The suggestions are practical and save us hours every week.',
      author: 'Rohan Kapoor',
      role: 'Tech Lead',
      initial: 'R',
    },
    {
      quote:
        'Setup was effortless and the reviews are spot on. It feels like having an experienced engineer on every PR.',
      author: 'Sarah Menon',
      role: 'Product Engineer',
      initial: 'S',
    },
  ];

  return (
    <section className="py-24 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          {/* Centered Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50 mb-4">
            <Sparkles className="size-3 text-blue-500" />
            <span>Loved by developers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-[-0.03em] leading-tight text-slate-950 dark:text-white">
            What developers are saying.
          </h2>

          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 font-normal">
            Real teams, real impact.
          </p>
        </div>

        {/* 3 Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-8 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left"
            >
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3.5 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                  {item.initial}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {item.author}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                    {item.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
