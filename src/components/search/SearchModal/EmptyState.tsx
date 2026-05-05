'use client';

import { Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-32 w-full h-full">
      {/* Greeting */}
      <h1 className="
        font-display font-normal leading-tight
        text-h4 text-text-heading-01
        whitespace-nowrap
      ">
        Hi, Thomas Guy
      </h1>

      {/* AI suggestion pill */}
      <div className="
        flex items-center gap-6
        pl-4 pr-12 py-6
        bg-blue-50
        border-[0.5px] border-blue--500
        rounded-lg
      "
      style={{ borderColor: 'var(--color-blue-500)' }}
      >
        {/* Sparkle icon */}
        <Sparkles size={12} className="text-blue-500 shrink-0" />

        {/* Mixed-color text */}
        <p className="whitespace-nowrap">
          <span className="text-caption-2 font-medium leading-tight text-text-heading-02">
            Ask anything –{' '}
          </span>
          <span className="text-caption-3 font-normal leading-tight text-blue-500">
            which agents have pending deals?{' '}
          </span>
          <span className="text-caption-3 font-normal leading-tight text-text-heading-01">
            or{' '}
          </span>
          <span className="text-caption-3 font-normal leading-tight text-blue-500">
            show me Lekki listings
          </span>
        </p>
      </div>
    </div>
  );
}
