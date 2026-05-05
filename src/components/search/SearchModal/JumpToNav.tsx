'use client';

import { PanelLeft } from 'lucide-react';

const JUMP_TO_ITEMS = [
  'All listings',
  'Agents',
  'Property',
  'Schedule',
  'Settings',
] as const;

interface JumpToNavProps {
  previewOpen?: boolean;
  onTogglePreview?: () => void;
}

export function JumpToNav({ previewOpen, onTogglePreview }: JumpToNavProps) {
  return (
    <div className="flex flex-col gap-12 py-10 w-full">
      <span className="
        text-caption-2 font-medium leading-tight
        text-text-heading-04 tracking-widest uppercase
      ">
        Jump to
      </span>

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4 flex-wrap">
          {JUMP_TO_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              className="
                flex items-center justify-center
                px-12 py-6
                bg-surface-dashboard border border-surface-stroke
                rounded-lg
                text-caption-2 font-medium leading-tight text-text-heading-02
                whitespace-nowrap cursor-pointer
                hover:bg-surface-fg-01
                transition-colors duration-150
              "
            >
              {item}
            </button>
          ))}
        </div>

        {/* Sidebar toggle */}
        {onTogglePreview && (
          <button
            type="button"
            onClick={onTogglePreview}
            aria-label={previewOpen ? 'Collapse preview' : 'Expand preview'}
            className="
              shrink-0 flex items-center justify-center
              size-[24px] rounded-md
              text-text-heading-06
              hover:bg-surface-fg-01 hover:text-text-heading-04
              transition-colors duration-150
            "
          >
            <PanelLeft size={16} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}
