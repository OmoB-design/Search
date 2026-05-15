'use client';

import { X } from 'lucide-react';
import { useRef, useState } from 'react';
import { EntityType } from './lib/types';

const FILTER_LABELS: Partial<Record<EntityType, string>> = {
  listing:     'All listings',
  agent:       'Agents',
  super_agent: 'Agents',
  folder:      'Folders',
  transaction: 'Transactions',
  document:    'Documents',
  action:      'Actions',
};

interface SearchModalInputProps {
  value: string;
  onChange: (value: string) => void;
  activeFilter?: EntityType | null;
  onClearFilter?: () => void;
}

export function SearchModalInput({
  value,
  onChange,
  activeFilter,
  onClearFilter,
}: SearchModalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`
        flex items-center w-full h-[42px]
        bg-surface-fg-01
        rounded-2xl
        px-8
        cursor-text
        transition-[border-color,border-width,box-shadow] duration-100
        ${focused
          ? 'border-[1.3px] border-blue-500'
          : 'border-[0.8px] border-surface-stroke'
        }
      `}
      style={focused
        ? { boxShadow: '0px 0px 1px 2px rgba(122, 168, 255, 0.15)' }
        : { boxShadow: '0px 2px 1.5px rgba(234,234,234,0.15), 0px 0px 1.5px rgba(235,234,234,0.25)' }
      }
      onClick={() => inputRef.current?.focus()}
    >
      {/* Left group: search icon + optional filter chip */}
      <div className="flex items-center gap-10 shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <path d="M14 13.9998L10.3455 10.3452" stroke="#777777" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.88889 11.7778C9.58889 11.7778 11.7778 9.58889 11.7778 6.88889C11.7778 4.18889 9.58889 2 6.88889 2C4.18889 2 2 4.18889 2 6.88889C2 9.58889 4.18889 11.7778 6.88889 11.7778Z" stroke="#777777" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {activeFilter && (
          <div className="
            flex items-center gap-4 shrink-0
            bg-white border border-surface-stroke
            px-12 py-[5px] rounded-lg
          ">
            <span className="
              text-caption-2 font-medium leading-tight
              text-text-heading-04 whitespace-nowrap
            ">
              {FILTER_LABELS[activeFilter] ?? activeFilter}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClearFilter?.(); }}
              className="flex items-center justify-center text-text-heading-05 hover:text-text-heading-04 transition-colors"
            >
              <X size={12} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      {/* Text input */}
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={activeFilter ? 'Search within…' : 'Search listings, agents, property... or ask anything'}
        autoFocus
        className={`
          flex-1 min-w-0 bg-transparent outline-none
          text-caption-2 leading-tight
          placeholder:text-text-heading-05 placeholder:font-normal
          mx-10
          font-normal text-text-heading-04
        `}
      />

    </div>
  );
}
