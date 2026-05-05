'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { SearchableEntity } from './lib/types';

interface PreviewPaneProps {
  entity: SearchableEntity | undefined;
}

export function PreviewPane({ entity }: PreviewPaneProps) {
  return (
    <div className="flex flex-col gap-10 items-start shrink-0">
      {/* Share + Open page actions */}
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
          Share
        </button>
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
          Open page
        </button>
      </div>

      {/* Preview card */}
      <AnimatePresence mode="wait">
        {entity && (
          <motion.div
            key={entity.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="
              bg-surface-fg-01 border-[0.6px] border-surface-stroke
              rounded-3xl w-[248px]
              flex flex-col gap-[22px] items-center
              pb-14
              overflow-hidden
            "
          >
            {/* Header: title + meta */}
            <div
              className="
                relative w-full flex flex-col gap-4 items-start
                px-10 py-8
                rounded-tl-[14px] rounded-tr-[14px]
                border-b-[0.5px] border-surface-stroke
                shadow-[0px_1px_7.5px_0px_rgba(230,230,230,0.25)]
                overflow-hidden
              "
            >
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

            {/* Body: images + fields */}
            <div className="flex flex-col gap-[22px] items-center w-full">
              {/* Image display */}
              {entity.preview?.images && entity.preview.images.length > 0 ? (
                entity.preview.images.length >= 3 ? (
                  /* 3-image fan */
                  <div className="relative h-[120px] w-[203px] shrink-0">
                    {/* Left image — tilted back-left */}
                    <div
                      className="absolute size-[100px]"
                      style={{
                        top: 0,
                        left: '50%',
                        transform: 'translateX(calc(-50% - 50px)) rotate(-9deg)',
                        transformOrigin: 'bottom center',
                      }}
                    >
                      <div className="size-full border-[0.3px] border-surface-stroke rounded-[14px] overflow-hidden shadow-[0px_2.5px_8px_0px_rgba(0,0,0,0.25)]">
                        <img
                          src={entity.preview.images[2]}
                          alt=""
                          className="size-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Right image — tilted back-right */}
                    <div
                      className="absolute size-[100px]"
                      style={{
                        top: 0,
                        left: '50%',
                        transform: 'translateX(calc(-50% + 50px)) rotate(9deg)',
                        transformOrigin: 'bottom center',
                      }}
                    >
                      <div className="size-full border-[0.5px] border-surface-stroke rounded-[14px] overflow-hidden shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)]">
                        <img
                          src={entity.preview.images[1]}
                          alt=""
                          className="size-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Front / center image */}
                    <div
                      className="absolute size-[110px]"
                      style={{
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      <div className="size-full border-[0.5px] border-surface-stroke rounded-[14px] overflow-hidden shadow-[0px_0px_14px_0px_rgba(0,0,0,0.25),0px_1px_10px_0px_rgba(60,60,60,0.25)]">
                        <img
                          src={entity.preview.images[0]}
                          alt=""
                          className="size-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Single image */
                  <div className="w-full px-14">
                    <div className="w-full h-[120px] border-[0.5px] border-surface-stroke rounded-[14px] overflow-hidden">
                      <img
                        src={entity.preview.images[0]}
                        alt=""
                        className="size-full object-cover"
                      />
                    </div>
                  </div>
                )
              ) : null}

              {/* Metadata fields */}
              {entity.preview?.fields && entity.preview.fields.length > 0 && (
                <div className="flex flex-col gap-0 w-full">
                  {entity.preview.fields.map((field) => (
                    <div
                      key={field.label}
                      className="flex items-center justify-between px-14 py-1"
                    >
                      <p className="text-caption-2 font-normal leading-tight text-text-heading-04 whitespace-nowrap">
                        {field.label}:
                      </p>
                      <div
                        className="
                          flex items-center justify-center
                          px-8 py-4 rounded-lg
                          bg-white border border-surface-stroke
                          text-caption-2 font-medium leading-tight text-text-heading-04
                          whitespace-nowrap
                        "
                      >
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
