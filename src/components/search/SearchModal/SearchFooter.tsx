'use client';

import { ChevronsUpDown, ExternalLink } from 'lucide-react';

interface SearchFooterProps {
  onDone?: () => void;
}

export function SearchFooter({ onDone }: SearchFooterProps) {
  return (
    <div className="
      shrink-0 flex items-center justify-between
      px-16 py-10
      bg-surface-fg-01
      border-t-[0.5px] border-b-[0.5px] border-surface-stroke
      rounded-bl-5xl rounded-br-5xl
      [filter:drop-shadow(0px_-2px_2px_rgba(243,243,243,0.1))]
    ">
      {/* Keyboard hints */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <ExternalLink size={14} strokeWidth={1.75} className="text-text-heading-06" />
          <span className="text-caption-2 font-medium leading-tight text-text-heading-06">
            Open
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ChevronsUpDown size={14} strokeWidth={1.75} className="text-text-heading-06" />
          <span className="text-caption-2 font-medium leading-tight text-text-heading-06">
            navigate
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-caption-2 font-medium leading-tight text-text-heading-06">
            esc  clear
          </span>
        </div>
      </div>

      {/* Done button — always visible */}
      <button
        type="button"
        onClick={onDone}
        className="
          flex items-center justify-center
          px-16 py-10
          bg-[#171717] rounded-lg
          text-caption-2 font-medium leading-tight text-white
          whitespace-nowrap
          hover:bg-[#2a2a2a]
          transition-colors duration-150
          shadow-soft
        "
      >
        Done
      </button>
    </div>
  );
}
