'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { PanelLeft } from 'lucide-react';
import { SearchableEntity } from './lib/types';

interface PreviewPaneProps {
  entity: SearchableEntity | undefined;
  previewOpen?: boolean;
  onTogglePreview?: () => void;
}

// Agent-specific preview: large avatar + listing thumbnail row
function AgentPreviewCard({ entity }: { entity: SearchableEntity }) {
  const avatarSrc = entity.preview?.images?.[0];
  const listingThumbs = entity.preview?.images?.slice(1) ?? [];
  const listingCount = entity.preview?.fields?.find(f => f.label === 'Listings')?.value;

  return (
    <div className="
      bg-surface-fg-01 border-[0.6px] border-surface-stroke
      rounded-3xl w-full
      flex flex-col items-center
      pb-14 overflow-hidden
    ">
      {/* Header */}
      <div className="
        relative w-full flex flex-col gap-4 items-start
        px-10 py-8
        rounded-tl-[14px] rounded-tr-[14px]
        border-b-[0.5px] border-surface-stroke
        overflow-hidden
      ">
        <div className="absolute inset-0 bg-white rounded-tl-[14px] rounded-tr-[14px] pointer-events-none" />
        <p className="relative text-caption-2 font-medium leading-tight text-text-heading-04 whitespace-nowrap">
          {entity.title}
        </p>
        {entity.subtitle && (
          <p className="relative text-caption-3 font-normal leading-tight text-text-heading-06 whitespace-nowrap">
            {entity.subtitle}
          </p>
        )}
      </div>

      {/* Large avatar */}
      <div className="mt-[18px] mb-[14px]">
        <div className="size-[110px] rounded-[14px] overflow-hidden border-[0.5px] border-surface-stroke shadow-[0px_2px_12px_0px_rgba(0,0,0,0.12)]">
          {avatarSrc ? (
            <img src={avatarSrc} alt={entity.title} className="size-full object-cover" />
          ) : (
            <div className="size-full bg-surface-fg-01 flex items-center justify-center text-[28px] font-medium text-text-heading-05">
              {entity.title.slice(0, 1)}
            </div>
          )}
        </div>
      </div>

      {/* Listing thumbnails row — right-aligned, badge at top-right of last frame */}
      {listingThumbs.length > 0 && (
        <div className="flex items-center justify-end px-14 mb-[14px] w-full">
          {listingThumbs.slice(0, 4).map((src, i) => {
            const isLast = i === Math.min(listingThumbs.length - 1, 3);
            return (
              <div
                key={src}
                className="relative shrink-0 size-[38px] rounded-[8px] border-[0.6px] border-surface-stroke shadow-[0px_2px_6px_0px_rgba(0,0,0,0.14)]"
                style={{ marginLeft: i > 0 ? '-10px' : 0, zIndex: i + 1 }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-[8px]">
                  <img src={src} alt="" className="size-full object-cover" />
                </div>
                {isLast && listingCount && (
                  <div className="
                    absolute -top-[6px] -right-[6px] z-[1]
                    flex items-center justify-center
                    size-[20px] rounded-full
                    bg-white border-[0.5px] border-surface-stroke
                    shadow-[0px_1px_4px_0px_rgba(0,0,0,0.12)]
                    text-[9px] font-medium text-text-heading-04
                    leading-none
                  ">
                    {listingCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Status fields */}
      {entity.preview?.fields && entity.preview.fields.length > 0 && (
        <div className="flex flex-col gap-0 w-full">
          {entity.preview.fields
            .filter(f => f.label !== 'Listings')
            .map((field) => (
              <div key={field.label} className="flex items-center justify-between px-14 py-1">
                <p className="text-caption-2 font-normal leading-tight text-text-heading-04 whitespace-nowrap">
                  {field.label}:
                </p>
                <div className="
                  flex items-center justify-center
                  px-8 py-4 rounded-lg
                  bg-white border border-surface-stroke
                  text-caption-2 font-medium leading-tight text-text-heading-04
                  whitespace-nowrap
                ">
                  {field.value}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// Listing / other entity preview: image fan or single + fields
function DefaultPreviewCard({ entity }: { entity: SearchableEntity }) {
  return (
    <div className="
      bg-surface-fg-01 border-[0.6px] border-surface-stroke
      rounded-3xl w-full
      flex flex-col gap-[22px] items-center
      pb-14 overflow-hidden
    ">
      {/* Header */}
      <div className="
        relative w-full flex flex-col gap-4 items-start
        px-10 py-8
        rounded-tl-[14px] rounded-tr-[14px]
        border-b-[0.5px] border-surface-stroke
        shadow-[0px_1px_7.5px_0px_rgba(230,230,230,0.25)]
        overflow-hidden
      ">
        <div className="absolute inset-0 bg-white rounded-tl-[14px] rounded-tr-[14px] pointer-events-none" />
        <p className="relative text-caption-2 font-medium leading-tight text-text-heading-04 whitespace-nowrap">
          {entity.title}
        </p>
        {entity.subtitle && (
          <p className="relative text-caption-3 font-normal leading-tight text-text-heading-06 whitespace-nowrap">
            {entity.subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-[22px] items-center w-full">
        {/* Image display */}
        {entity.preview?.images && entity.preview.images.length > 0 ? (
          entity.preview.images.length >= 3 ? (
            <div className="relative h-[120px] w-[203px] shrink-0">
              <div className="absolute size-[100px]" style={{ top: 0, left: '50%', transform: 'translateX(calc(-50% - 50px)) rotate(-9deg)', transformOrigin: 'bottom center' }}>
                <div className="size-full border-[0.3px] border-surface-stroke rounded-[14px] overflow-hidden shadow-[0px_2.5px_8px_0px_rgba(0,0,0,0.25)]">
                  <img src={entity.preview.images[2]} alt="" className="size-full object-cover" />
                </div>
              </div>
              <div className="absolute size-[100px]" style={{ top: 0, left: '50%', transform: 'translateX(calc(-50% + 50px)) rotate(9deg)', transformOrigin: 'bottom center' }}>
                <div className="size-full border-[0.5px] border-surface-stroke rounded-[14px] overflow-hidden shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)]">
                  <img src={entity.preview.images[1]} alt="" className="size-full object-cover" />
                </div>
              </div>
              <div className="absolute size-[110px]" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}>
                <div className="size-full border-[0.5px] border-surface-stroke rounded-[14px] overflow-hidden shadow-[0px_0px_14px_0px_rgba(0,0,0,0.25),0px_1px_10px_0px_rgba(60,60,60,0.25)]">
                  <img src={entity.preview.images[0]} alt="" className="size-full object-cover" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full px-14">
              <div className="w-full h-[120px] border-[0.5px] border-surface-stroke rounded-[14px] overflow-hidden">
                <img src={entity.preview.images[0]} alt="" className="size-full object-cover" />
              </div>
            </div>
          )
        ) : null}

        {/* Fields */}
        {entity.preview?.fields && entity.preview.fields.length > 0 && (
          <div className="flex flex-col gap-0 w-full">
            {entity.preview.fields.map((field) => (
              <div key={field.label} className="flex items-center justify-between px-14 py-1">
                <p className="text-caption-2 font-normal leading-tight text-text-heading-04 whitespace-nowrap">
                  {field.label}:
                </p>
                <div className="
                  flex items-center justify-center
                  px-8 py-4 rounded-lg
                  bg-white border border-surface-stroke
                  text-caption-2 font-medium leading-tight text-text-heading-04
                  whitespace-nowrap
                ">
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function PreviewPane({ entity, previewOpen, onTogglePreview }: PreviewPaneProps) {
  const isAgent = entity?.type === 'agent' || entity?.type === 'super_agent';
  const [leftLabel, rightLabel] = isAgent
    ? ['View listings', 'View profile']
    : ['Share', 'Open page'];

  return (
    <div className="flex flex-col gap-10 items-end w-full">
      {/* Panel toggle — top of preview pane, right-aligned */}
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

      {/* Contextual action buttons */}
      <div className="flex items-center gap-4 w-full justify-end">
        <button
          type="button"
          className="
            flex items-center justify-center gap-4
            px-12 py-6 rounded-lg
            bg-white border border-surface-stroke
            text-caption-2 font-medium leading-tight text-text-heading-04
            whitespace-nowrap
            hover:bg-surface-fg-01 transition-colors duration-150
          "
        >
          {leftLabel}
        </button>
        <button
          type="button"
          className="
            flex items-center justify-center gap-4
            px-12 py-6 rounded-lg
            bg-[#171717] border border-[#171717]
            text-caption-2 font-medium leading-tight text-white
            whitespace-nowrap
            hover:bg-[#2a2a2a] transition-colors duration-150
          "
        >
          {rightLabel}
        </button>
      </div>

      {/* Preview card */}
      <AnimatePresence mode="wait">
        {entity && (
          <motion.div
            key={entity.id}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            className="w-full"
          >
            {isAgent
              ? <AgentPreviewCard entity={entity} />
              : <DefaultPreviewCard entity={entity} />
            }
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
