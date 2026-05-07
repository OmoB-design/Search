'use client';

import { ChevronRight, ArrowUpRight, Plus, Home, Folder } from 'lucide-react';
import { motion } from 'framer-motion';
import { highlightSegments } from './lib/searchIndex';
import { EntityStatus, SearchableEntity } from './lib/types';

// — Agent initials fallback —
const AVATAR_PALETTE: [string, string][] = [
  ['#e8f0ff', '#1969fe'],
  ['#e1def5', '#6a59ce'],
  ['#fcebd5', '#ee9c2e'],
  ['#d1fae5', '#065f46'],
  ['#ffd3d3', '#ff5150'],
];
function avatarColors(name: string): [string, string] {
  return AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length];
}
function agentInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  return ((words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')).toUpperCase();
}

// — Status badge — exact Figma colors
const STATUS_STYLE: Record<EntityStatus, React.CSSProperties> = {
  available:   { backgroundColor: '#e7f6e8', color: '#25ad32' },
  active:      { backgroundColor: '#e7f6e8', color: '#25ad32' },
  rented:      { backgroundColor: '#e8f0ff', color: '#1969fe' },
  sold:        { backgroundColor: '#e8f0ff', color: '#1969fe' },
  pending:     { backgroundColor: '#fdf5ea', color: '#8f5e1c' },
  negotiating: { backgroundColor: '#fdf5ea', color: '#8f5e1c' },
  on_leave:    { backgroundColor: '#f4f4f4', color: '#424242' },
  archived:    { backgroundColor: '#f4f4f4', color: '#424242' },
};
function statusLabel(s: EntityStatus): string {
  return s.replace('_', ' ').replace(/^\w/, c => c.toUpperCase());
}

// — Action icon —
function ActionIcon({ id }: { id: string }) {
  const Icon = id === 'ACT001' ? Plus : id === 'ACT002' ? ArrowUpRight : Home;
  return (
    <div className="shrink-0 size-[25px] bg-surface-fg-01 border-[0.6px] border-surface-stroke rounded-[8px] flex items-center justify-center">
      <Icon size={10} strokeWidth={1.75} className="text-text-heading-06" />
    </div>
  );
}

// — Inline highlight renderer —
function HighlightedText({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>;
  const segments = highlightSegments(text, query);
  return (
    <>
      {segments.map((seg, i) =>
        seg.highlighted ? (
          <span key={i} className="text-blue-500">{seg.text}</span>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}

interface ResultItemProps {
  entity: SearchableEntity;
  isSelected?: boolean;
  query?: string;
  onClick?: () => void;
}

export function ResultItem({ entity, isSelected, query, onClick }: ResultItemProps) {
  const isAction = entity.type === 'action';
  const isAgent  = entity.type === 'agent' || entity.type === 'super_agent';

  // Thumbnail / avatar / icon
  let thumbnail: React.ReactNode;
  if (entity.thumbnail) {
    thumbnail = (
      <div className="shrink-0 size-[25px] border-[0.6px] border-surface-stroke rounded-[8px] overflow-hidden">
        <img src={entity.thumbnail} alt="" className="size-full object-cover" />
      </div>
    );
  } else if (isAction) {
    thumbnail = <ActionIcon id={entity.id} />;
  } else if (isAgent) {
    const [bg, color] = avatarColors(entity.title);
    thumbnail = (
      <div
        className="shrink-0 size-[25px] rounded-full flex items-center justify-center text-[10px] font-medium leading-none"
        style={{ backgroundColor: bg, color }}
      >
        {agentInitials(entity.title)}
      </div>
    );
  } else if (entity.type === 'folder') {
    thumbnail = (
      <div className="shrink-0 size-[25px] bg-surface-fg-01 border-[0.6px] border-surface-stroke rounded-[8px] flex items-center justify-center">
        <Folder size={12} strokeWidth={1.5} className="text-text-heading-06" />
      </div>
    );
  } else {
    thumbnail = (
      <div className="shrink-0 size-[25px] bg-surface-fg-01 border-[0.6px] border-surface-stroke rounded-[8px] flex items-center justify-center">
        <Home size={12} strokeWidth={1.5} className="text-text-heading-06" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        relative flex items-center justify-between w-full text-left
        pl-[4px] pr-[12px] py-[6px] rounded-[8px]
        hover:bg-surface-fg-01
        transition-colors duration-100
      "
    >
      {/* Fluid highlight — single element shared across all rows via layoutId.
          Framer Motion springs it from the previous row's position to this one. */}
      {isSelected && (
        <motion.div
          layoutId="result-highlight"
          className="absolute inset-0 rounded-[8px] bg-surface-fg-01 border-[0.5px] border-surface-stroke"
          transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.9 }}
        />
      )}

      {/* Left: icon + text — sits above the highlight */}
      <div className="relative flex items-center gap-[6px] min-w-0 shrink z-[1]">
        {thumbnail}
        <div className="flex flex-col gap-[2px] min-w-0">
          <p className="text-caption-1 font-normal leading-tight text-text-heading-04 whitespace-nowrap">
            <HighlightedText text={entity.title} query={query} />
            {isAgent && entity.meta && (
              <span className="text-text-heading-06 ml-[4px] text-caption-3">{entity.meta}</span>
            )}
          </p>
          {entity.subtitle && (
            <p className="text-caption-2 font-normal leading-tight text-text-heading-06 whitespace-nowrap">
              <HighlightedText text={entity.subtitle} query={query} />
            </p>
          )}
        </div>
      </div>

      {/* Right: status badge or chevron — also above highlight */}
      <div className="relative z-[1]">
        {entity.status ? (
          <span
            className="shrink-0 text-caption-2 font-normal leading-tight px-[10px] py-[4px] rounded-full whitespace-nowrap ml-[8px]"
            style={STATUS_STYLE[entity.status]}
          >
            {statusLabel(entity.status)}
          </span>
        ) : isAction ? (
          <ChevronRight size={10} className="shrink-0 text-text-heading-06 ml-[8px]" />
        ) : null}
      </div>
    </button>
  );
}
