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
    sectionStagger: [0.06, 0.01, 0.16, 0.005],
    scrimOpacity: [0.12, 0, 0.5, 0.01],
    entryY: [14, 4, 48, 1],
    entryBlur: [6, 0, 20, 1],
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
                w-search-modal h-search-modal
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
              }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{
                opacity: 0, scale: 0.96,
                y: entryY * 0.6, filter: `blur(${entryBlur * 0.5}px)`,
              }}
              transition={params.modalSpring as object}
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

                      {/* Divider — only when preview is open */}
                      {previewOpen && (
                        <div className="relative shrink-0 w-[7px] self-stretch mx-8">
                          <div className="absolute left-[3px] top-0 bottom-0 w-[1.5px] bg-surface-fg-01" />
                          <div className="
                            absolute -translate-x-1/2 -translate-y-1/2
                            left-1/2 top-1/2
                            w-[7px] h-[20px]
                            rounded-full
                            border-[0.5px] border-surface-stroke
                            shadow-soft
                            bg-surface-fg-01
                          " />
                        </div>
                      )}

                      {/* Right column: preview */}
                      <AnimatePresence>
                        {previewOpen && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="overflow-hidden shrink-0"
                          >
                            <div className="flex flex-col py-10 pl-8 pr-4 h-full">
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

              {/* Bottom gradient mask — always present */}
              <div
                className="absolute left-0 right-0 bottom-[45px] h-10 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(252,252,252,0.95) 0%, transparent 100%)',
                }}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
