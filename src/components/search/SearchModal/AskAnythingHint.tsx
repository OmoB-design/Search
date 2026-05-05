'use client';

import { Sparkles } from 'lucide-react';

interface AskAnythingHintProps {
  onExampleClick?: (example: string) => void;
}

export function AskAnythingHint({ onExampleClick }: AskAnythingHintProps) {
  return (
    <div
      className="
        flex items-center gap-6
        pl-4 pr-12 py-6
        bg-blue-50
        border-[0.5px] border-blue-500
        rounded-lg
        shrink-0
      "
    >
      <Sparkles size={12} className="text-blue-500 shrink-0" />
      <p className="whitespace-nowrap">
        <span className="text-caption-2 font-medium leading-tight text-text-heading-04">
          Ask anything –{' '}
        </span>
        <button
          type="button"
          onClick={() => onExampleClick?.('which agents have pending deals?')}
          className="text-caption-3 font-normal leading-tight text-blue-500 hover:underline"
        >
          which agents have pending deals?
        </button>
        <span className="text-caption-3 font-normal leading-tight text-text-heading-01">
          {' '}or{' '}
        </span>
        <button
          type="button"
          onClick={() => onExampleClick?.('show me Lekki listings')}
          className="text-caption-3 font-normal leading-tight text-blue-500 hover:underline"
        >
          show me Lekki listings
        </button>
      </p>
    </div>
  );
}
