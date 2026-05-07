'use client';

import { Command, Search, Sparkles, X } from 'lucide-react';
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
        <Search size={16} strokeWidth={1.75} className="text-text-heading-05 shrink-0" />

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

      {/* Right side: AI indicator or ⌘A hint */}
      {isAI ? (
        <span className="flex items-center gap-[4px] shrink-0 text-blue-500">
          <Sparkles size={11} />
          <span className="text-[11px] font-medium leading-none">AI</span>
        </span>
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
