'use client';

import { Command, Search } from 'lucide-react';
import { useRef } from 'react';

interface SearchModalInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchModalInput({ value, onChange }: SearchModalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="
        flex items-center w-full
        bg-surface-fg-01
        border-[0.8px] border-surface-stroke
        rounded-2xl shadow-card
        px-8 py-10
        gap-6
        cursor-text
      "
      onClick={() => inputRef.current?.focus()}
    >
      <Search size={16} strokeWidth={1.75} className="text-text-heading-05 shrink-0" />

      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search listings, agents, property... or ask anything"
        autoFocus
        className="
          flex-1 min-w-0 bg-transparent outline-none
          text-caption-2 font-normal leading-tight
          text-text-heading-04
          placeholder:text-text-heading-05
        "
      />

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center justify-center size-[18px] bg-white rounded-sm shadow-xs">
          <Command size={10} className="text-icon-explainer" />
        </div>
        <div className="flex items-center justify-center size-[18px] bg-white rounded-sm shadow-xs">
          <span className="text-[10px] font-normal leading-tight text-icon-explainer">A</span>
        </div>
      </div>
    </div>
  );
}
