'use client';

import { useDialKit } from 'dialkit';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AskAnythingHint } from './AskAnythingHint';
import { EmptyState } from './EmptyState';
import { JumpToNav } from './JumpToNav';
import { PreviewPane } from './PreviewPane';
import { ResultsList } from './ResultsList';
import { SearchFooter } from './SearchFooter';
import { SearchModalInput } from './SearchModalInput';
import { searchEntities } from './lib/searchIndex';
import { SearchableEntity } from './lib/types';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  anchorBottom?: number;
}

export function SearchModal({ open, onClose, anchorBottom = 0 }: SearchModalProps) {
  const params = useDialKit('Search · Modal', {
    modalSpring: {
      type: 'spring',
      stiffness: 280,
      damping: 22,
    },
    widthSpring: {
      type: 'spring',
      visualDuration: 0.3,
      bounce: 0.1,
    },
    stage3Width:  800,
    stage4Width:  600,
    stage3Height: 619,
    stage4Height: 643,
    sectionStagger: 0.06,
    scrimOpacity: 0.12,
    entryY: 14,
    entryBlur: 6,
  });

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  const results: SearchableEntity[] = useMemo(
    () => searchEntities(query),
    [query]
  );

  const isRecent = query.trim() === '';
  const showResultsView = results.length > 0;
  const selectedEntity = results[selectedIndex];

  // Reset state on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setPreviewOpen(false);
    }
  }, [open]);

  // Clamp selectedIndex when results change
  useEffect(() => {
    if (selectedIndex >= results.length) {
      setSelectedIndex(Math.max(0, results.length - 1));
    }
  }, [results, selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          if (query) {
            setQuery('');
          } else {
            onClose();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Tab':
          e.preventDefault();
          setPreviewOpen(p => !p);
          break;
        case 'Enter':
          if (results[selectedIndex]) {
            // In a full app: router.push(results[selectedIndex].href)
          }
          break;
      }
    },
    [query, onClose, results, selectedIndex]
  );

  useEffect(() => {
    if (open) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const entryY = params.entryY as number;
  const entryBlur = params.entryBlur as number;

  const sectionVariants = {
    hidden: { opacity: 0, y: -entryY, filter: `blur(${entryBlur}px)` },
    show: {
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { type: 'spring' as const, stiffness: 320, damping: 28 },
    },
    exit: {
      opacity: 0, y: -entryY * 0.5, filter: `blur(${entryBlur * 0.5}px)`,
      transition: { duration: 0.12, ease: 'easeIn' as const },
    },
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: params.sectionStagger as number,
        delayChildren: 0.06,
      },
    },
    exit: {
      transition: {
        staggerChildren: (params.sectionStagger as number) * 0.5,
        staggerDirection: -1 as const,
      },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            className="fixed inset-0 z-40 bg-grey-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: params.scrimOpacity as number }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            className="fixed inset-x-0 z-50 flex justify-center pointer-events-none"
            style={{ top: anchorBottom + 30 }}
          >
            <motion.div
              className="
                relative flex flex-col
                bg-surface-dashboard
                border-[0.5px] border-surface-stroke
                rounded-5xl
                shadow-search-modal
                overflow-hidden
                pointer-events-auto
              "
              initial={{
                opacity: 0, scale: 0.94,
                y: entryY, filter: `blur(${entryBlur}px)`,
                width: previewOpen ? params.stage3Width as number : params.stage4Width as number,
                height: previewOpen ? params.stage3Height as number : params.stage4Height as number,
              }}
              animate={{
                opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
                width: previewOpen ? params.stage3Width as number : params.stage4Width as number,
                height: previewOpen ? params.stage3Height as number : params.stage4Height as number,
              }}
              exit={{
                opacity: 0, scale: 0.96,
                y: entryY * 0.6, filter: `blur(${entryBlur * 0.5}px)`,
              }}
              transition={{
                default: params.modalSpring as object,
                width: params.widthSpring as object,
                height: params.widthSpring as object,
              }}
            >
              <motion.div
                className="flex flex-col flex-1 min-h-0"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {/* ── Header: search input + jump-to ── */}
                <motion.div
                  className="shrink-0 flex flex-col gap-0 px-12 pt-12"
                  variants={sectionVariants}
                >
                  <SearchModalInput value={query} onChange={setQuery} />
                  <JumpToNav
                    previewOpen={previewOpen}
                    onTogglePreview={() => setPreviewOpen(p => !p)}
                  />
                </motion.div>

                {/* ── Body ── */}
                <motion.div
                  className="flex flex-1 min-h-0 px-12"
                  variants={sectionVariants}
                >
                  {showResultsView ? (
                    /* Stage 3: two-column results view */
                    <>
                      {/* Left column */}
                      <div className="flex flex-col flex-1 min-w-0 justify-between pb-12 min-h-0">
                        <div className="flex-1 min-h-0 overflow-y-auto">
                          <ResultsList
                            results={results}
                            selectedIndex={selectedIndex}
                            onSelect={setSelectedIndex}
                            isRecent={isRecent}
                          />
                        </div>
                        <AskAnythingHint onExampleClick={(ex) => setQuery(ex)} />
                      </div>

                      {/* Right panel: divider + preview, animated as one unit */}
                      <AnimatePresence>
                        {previewOpen && (
                          <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 306, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{
                              type: 'spring',
                              stiffness: 320,
                              damping: 30,
                            }}
                            className="shrink-0 overflow-hidden flex h-full"
                          >
                            {/* Divider */}
                            <div className="relative shrink-0 w-[7px] self-stretch mx-8">
                              <div className="absolute left-[3px] top-0 bottom-0 w-[1.5px] bg-surface-fg-01" />
                              <div className="
                                absolute -translate-x-1/2 -translate-y-1/2
                                left-1/2 top-1/2
                                w-[7px] h-[20px] rounded-full
                                border-[0.5px] border-surface-stroke
                                shadow-soft bg-surface-fg-01
                              " />
                            </div>

                            {/* Preview pane */}
                            <div className="flex flex-col py-10 pr-4 w-[267px] shrink-0">
                              <PreviewPane entity={selectedEntity} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    /* Stage 2: empty state */
                    <div className="flex flex-col flex-1 min-h-0 justify-between pb-12">
                      <div className="flex-1 flex items-center justify-center">
                        <EmptyState />
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* ── Footer ── */}
                <motion.div className="shrink-0" variants={sectionVariants}>
                  <SearchFooter onDone={onClose} />
                </motion.div>
              </motion.div>

              {/* Figma blur frame — bottom fade/blur mask */}
              <div
                className="absolute left-[-0.5px] right-[-0.5px] bottom-[45px] h-[45px] pointer-events-none backdrop-blur-[3.75px]"
                style={{
                  backgroundImage:
                    'linear-gradient(180deg, rgba(255, 255, 255, 0) 17.947%, rgb(250, 250, 250) 81.871%)',
                }}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
