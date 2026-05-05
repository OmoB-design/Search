'use client';

import { Folder } from 'lucide-react';
import { SearchableEntity } from './lib/types';

interface ResultItemProps {
  entity: SearchableEntity;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ResultItem({ entity, isSelected, onClick }: ResultItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-6 w-full text-left
        pl-4 pr-12 py-6 rounded-lg
        transition-colors duration-100
        ${isSelected
          ? 'bg-surface-fg-01 border-[0.5px] border-surface-stroke'
          : 'hover:bg-surface-fg-01'
        }
      `}
    >
      {/* Thumbnail */}
      {entity.type === 'folder' ? (
        <div className="shrink-0 size-[25px] bg-surface-fg-01 border-[0.6px] border-surface-stroke rounded-lg flex items-center justify-center">
          <Folder size={12} strokeWidth={1.5} className="text-text-heading-06" />
        </div>
      ) : entity.thumbnail ? (
        <div className="shrink-0 size-[25px] border-[0.6px] border-surface-stroke rounded-lg overflow-hidden">
          <img
            src={entity.thumbnail}
            alt=""
            className="size-full object-cover"
          />
        </div>
      ) : (
        <div className="shrink-0 size-[25px] bg-surface-fg-01 border-[0.6px] border-surface-stroke rounded-lg" />
      )}

      {/* Text */}
      <div className="flex flex-col gap-[2px] min-w-0">
        <p className="text-caption-1 font-normal leading-tight text-text-heading-04 whitespace-nowrap">
          {entity.title}
          {entity.type === 'agent' && entity.meta && (
            <span className="text-text-heading-06 ml-[4px]">{entity.meta}</span>
          )}
        </p>
        {entity.subtitle && (
          <p className="text-caption-2 font-normal leading-tight text-text-heading-06 whitespace-nowrap">
            {entity.subtitle}
          </p>
        )}
      </div>
    </button>
  );
}
