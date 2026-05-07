'use client';

import { PanelLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FILTER_CHIPS } from './lib/searchConfig';
import { EntityType } from './lib/types';

interface JumpToNavProps {
  previewOpen?: boolean;
  onTogglePreview?: () => void;
  onClose?: () => void;
  activeFilter?: EntityType | null;
  onFilterChange?: (filter: EntityType | null) => void;
}

export function JumpToNav({
  previewOpen,
  onTogglePreview,
  onClose,
  activeFilter,
  onFilterChange,
}: JumpToNavProps) {
  const router = useRouter();

  function handleChip(chip: typeof FILTER_CHIPS[number]) {
    if (chip.filterType !== null) {
      // Toggle: clicking the active filter deactivates it
      onFilterChange?.(activeFilter === chip.filterType ? null : chip.filterType);
    } else if (chip.href) {
      onClose?.();
      router.push(chip.href);
    }
  }

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
          {FILTER_CHIPS.map((chip) => {
            const isActive = chip.filterType !== null && activeFilter === chip.filterType;
            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleChip(chip)}
                className={`
                  flex items-center justify-center
                  px-12 py-6 rounded-lg
                  text-caption-2 font-medium leading-tight
                  whitespace-nowrap cursor-pointer
                  border transition-colors duration-150
                  ${isActive
                    ? 'bg-[#171717] border-[#171717] text-white'
                    : 'bg-surface-dashboard border-surface-stroke text-text-heading-02 hover:bg-surface-fg-01'
                  }
                `}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {onTogglePreview && (
          <button
            type="button"
            onClick={onTogglePreview}
            aria-label={previewOpen ? 'Collapse preview' : 'Expand preview'}
            className={`
              shrink-0 flex items-center justify-center
              size-[24px] rounded-md
              transition-colors duration-150
              hover:bg-surface-fg-01
              ${previewOpen ? 'text-blue-500' : 'text-grey-400'}
            `}
          >
            <PanelLeft size={16} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}
