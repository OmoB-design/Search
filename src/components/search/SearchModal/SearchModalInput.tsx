'use client';

import { Command, X } from 'lucide-react';
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
  isAI?: boolean;
  activeFilter?: EntityType | null;
  onClearFilter?: () => void;
}

export function SearchModalInput({
  value,
  onChange,
  isAI,
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
        border-[0.8px]
        rounded-2xl
        px-8
        cursor-text
        transition-[border-color,box-shadow] duration-100
        ${focused
          ? 'border-blue-500'
          : 'border-surface-stroke'
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
        className="
          flex-1 min-w-0 bg-transparent outline-none
          text-caption-2 font-normal leading-tight
          text-text-heading-04
          placeholder:text-text-heading-05
          mx-10
        "
      />

      {/* Right side: YouAI pill or ⌘A hint */}
      {isAI ? (
        <div className="flex items-center gap-[2px] shrink-0 bg-surface-dashboard border-[0.5px] border-surface-stroke rounded-[4px] shadow-xs px-[5px] py-[2px]">
          <span className="text-caption-2 font-normal leading-tight text-icon-explainer whitespace-nowrap">
            YouAI
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0.5L7.56 4.44L11.5 6L7.56 7.56L6 11.5L4.44 7.56L0.5 6L4.44 4.44L6 0.5Z" fill="#777777"/>
          </svg>
        </div>
      ) : (
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center size-[18px] bg-white rounded-sm shadow-xs">
            <Command size={10} className="text-icon-explainer" />
          </div>
          <div className="flex items-center justify-center size-[18px] bg-white rounded-sm shadow-xs">
            <span className="text-[10px] font-normal leading-tight text-icon-explainer">A</span>
          </div>
        </div>
      )}
    </div>
  );
}
