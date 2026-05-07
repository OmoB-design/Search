'use client';

import { LayoutGroup } from 'framer-motion';
import { MockAIResponse } from './lib/aiMock';
import { SearchableEntity } from './lib/types';
import { ResultItem } from './ResultItem';

function FourPointedStar({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 0.5L7.56 4.44L11.5 6L7.56 7.56L6 11.5L4.44 7.56L0.5 6L4.44 4.44L6 0.5Z"
        fill={color}
      />
    </svg>
  );
}

interface AIResponseViewProps {
  response: MockAIResponse;
  entities: SearchableEntity[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}

export function AIResponseView({ response, entities, selectedIndex, onSelect }: AIResponseViewProps) {
  return (
    <div className="flex flex-col py-10 gap-[20px]">

      {/* ── You AI answer block ── */}
      <div className="flex flex-col gap-[12px]">

        {/* Header: ✦ You AI */}
        <div className="flex items-center gap-[8px]">
          <FourPointedStar size={12} color="#1969fe" />
          <span className="text-caption-2 font-medium leading-tight text-text-heading-04 whitespace-nowrap">
            You AI
          </span>
        </div>

        {/* Answer card */}
        <div
          className="
            relative flex gap-[10px] items-stretch
            pl-[4px] pr-[12px] py-10
            bg-surface-fg-01 border-[0.8px] border-surface-stroke rounded-[8px]
          "
          style={{ boxShadow: 'inset 0px 1.5px 2px 0px rgba(255,255,255,0.25)' }}
        >
          {/* Blue left accent bar */}
          <div className="flex items-stretch shrink-0">
            <div
              className="w-[2px] self-stretch bg-blue-400 border-[0.5px] border-surface-stroke rounded-[16px]"
              style={{ boxShadow: '0px 0px 2px 0px rgba(155,155,155,0.25), inset 0px 0px 2px 0px white, inset 0px 0px 1px 0px rgba(217,217,217,0.9)' }}
            />
          </div>

          {/* Response text */}
          <p className="flex-1 min-w-0 text-caption-1 font-normal leading-tight text-text-heading-04">
            {response.segments.map((seg, i) =>
              seg.linked ? (
                <span
                  key={i}
                  className="underline underline-offset-2 decoration-text-heading-06/40 cursor-pointer hover:text-text-heading-02 transition-colors"
                >
                  {seg.text}
                </span>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
          </p>
        </div>
      </div>

      {/* ── Entity results ── */}
      <div className="flex flex-col">
        {/* Section header */}
        <div className="px-4 pb-[4px]">
          <span className="text-caption-3 font-medium leading-tight text-text-heading-02 tracking-[0.04em] uppercase">
            {response.entityLabel}
          </span>
        </div>

        {/* Result rows */}
        <LayoutGroup>
          <div className="flex flex-col gap-[2px]">
            {entities.map((entity, i) => (
              <ResultItem
                key={entity.id}
                entity={entity}
                isSelected={i === selectedIndex}
                onClick={() => onSelect(i)}
              />
            ))}
          </div>
        </LayoutGroup>
      </div>

    </div>
  );
}
