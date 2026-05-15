'use client';

import { useDialKit } from 'dialkit';
import { animate as motionAnimate, AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { PanelLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AIResponseView } from './AIResponseView';
import { EmptyState } from './EmptyState';
import { JumpToNav } from './JumpToNav';
import { PreviewPane } from './PreviewPane';
import { ProgressiveBlur } from './ProgressiveBlur';
import { ResultsList } from './ResultsList';
import { SearchFooter } from './SearchFooter';
import { SearchModalInput } from './SearchModalInput';
import { getMockAIResponse } from './lib/aiMock';
import { addRecentItem } from './lib/recentItems';
import { MOCK_DATA, searchEntities } from './lib/searchIndex';
import { isAIQuery } from './lib/modeDetect';
import { EntityType, SearchableEntity } from './lib/types';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  anchorBottom?: number;
}

// Divider region = 7px bar + 8px margin each side
const DIVIDER_W = 23;
const PREVIEW_DEFAULT = 267;
const PREVIEW_MIN = 180;
const PREVIEW_MAX = 420;

export function SearchModal({ open, onClose, anchorBottom = 0 }: SearchModalProps) {
  const params = useDialKit('Search · Modal', {
    // ── Entry / Exit animation
    'entry_spring':         { type: 'easing', duration: 0.2, ease: [1, -0.4, 0.7, 1] },
    'entry_spring.__mode':  'easing',
    entry_y:                1,
    entry_blur:             1.8,

    // ── Modal size transition
    'size_spring':          { type: 'spring', stiffness: 400, damping: 45, mass: 1.5 },
    'size_spring.__mode':   'advanced',
    size_compact_w:         600,
    size_compact_h:         580,
    size_expanded_w:        800,
    size_expanded_h:        580,

    // ── Section stagger
    stagger_sections:       0.06,

    // ── Scrim
    scrim_opacity:          0.02,

    // ── Progressive blur frame
    blur_height:            25,
    blur_max_depth:         1,
    blur_saturation:        0,
    blur_brightness:        1,
    blur_tint_color:        '#ffffff',
    blur_tint_opacity:      0.65,

    // ── You AI loader
    loader_size:            16,
    loader_speed:           1.35,
    loader_pattern:         { type: 'select', options: ['rings', 'diamond', 'full', 'outline', 'rose', 'cross'], default: 'rings' },
    loader_color:           '#1969fe',

    // ── You AI thinking sequence
    ai_thinking_duration:   4,
    ai_entity_stagger:      0.08,
    ai_status_exit_x:       20,
  });

  const router = useRouter();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<EntityType | null>(null);

  // AI submission state — response only triggers when user presses Enter
  const [submittedAIQuery, setSubmittedAIQuery] = useState('');
  const [aiPhase, setAiPhase] = useState<'idle' | 'thinking' | 'cooking'>('idle');
  const [enterTime, setEnterTime] = useState(0);

  // Motion values for smooth drag — bypass React state during drag
  const panelWidthMV = useMotionValue(0);
  const panelOpacityMV = useMotionValue(0);
  const previewInnerWidth = useTransform(panelWidthMV, w => Math.max(0, w - DIVIDER_W));

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartW = useRef(0);
  const prevPreviewOpen = useRef(false);

  const results: SearchableEntity[] = useMemo(
    () => searchEntities(query, activeFilter),
    [query, activeFilter]
  );

  const isRecent = query.trim() === '' && activeFilter === null;
  const isAI = isAIQuery(query);
  // Show results view for normal (non-AI-submitted) queries
  const showResultsView = aiPhase === 'idle' && (results.length > 0 || query.trim() !== '' || activeFilter !== null);

  // AI response is locked to the submitted query — not the live typing
  const aiResponse = useMemo(
    () => (submittedAIQuery ? getMockAIResponse(submittedAIQuery) : null),
    [submittedAIQuery]
  );
  const aiEntities = useMemo<SearchableEntity[]>(() => {
    if (!aiResponse) return [];
    return aiResponse.entityIds
      .map(id => MOCK_DATA.find(e => e.id === id))
      .filter((e): e is SearchableEntity => Boolean(e));
  }, [aiResponse]);

  // Keyboard navigation uses AI entities when active, normal results otherwise
  const effectiveResults = aiPhase !== 'idle' ? aiEntities : results;
  const selectedEntity = effectiveResults[selectedIndex];

  // thinking → cooking after ai_thinking_duration seconds
  useEffect(() => {
    if (aiPhase !== 'thinking') return;
    const ms = (params.ai_thinking_duration as number) * 1000;
    const t = setTimeout(() => setAiPhase('cooking'), ms);
    return () => clearTimeout(t);
  }, [aiPhase, params.ai_thinking_duration]);

  // Preview opens only after all entity frames have animated in
  const handleEntitiesComplete = useCallback(() => setPreviewOpen(true), []);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setPreviewOpen(false);
      setActiveFilter(null);
      setSubmittedAIQuery('');
      setAiPhase('idle');
      setEnterTime(0);
    }
  }, [open]);

  // Clamp selectedIndex against whichever list is active
  useEffect(() => {
    if (selectedIndex >= effectiveResults.length) {
      setSelectedIndex(Math.max(0, effectiveResults.length - 1));
    }
  }, [effectiveResults, selectedIndex]);

  // Spring-animate preview panel on open/close — no React state during drag
  useEffect(() => {
    if (previewOpen === prevPreviewOpen.current) return;
    prevPreviewOpen.current = previewOpen;

    if (previewOpen) {
      panelWidthMV.set(0);
      motionAnimate(panelWidthMV, PREVIEW_DEFAULT + DIVIDER_W, {
        type: 'spring', stiffness: 320, damping: 30,
      });
      motionAnimate(panelOpacityMV, 1, { duration: 0.18 });
    } else {
      motionAnimate(panelWidthMV, 0, {
        type: 'spring', stiffness: 380, damping: 38,
      });
      motionAnimate(panelOpacityMV, 0, { duration: 0.14 });
    }
  }, [previewOpen, panelWidthMV, panelOpacityMV]);

  const handleNavigate = useCallback(
    (entity: SearchableEntity) => {
      addRecentItem(entity);
      router.push(entity.href);
      onClose();
    },
    [router, onClose]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          // Exit AI response first, then clear query, then close
          if (aiPhase !== 'idle') {
            setAiPhase('idle');
            setSubmittedAIQuery('');
            setPreviewOpen(false);
          } else if (query) {
            setQuery('');
          } else if (activeFilter) {
            setActiveFilter(null);
          } else {
            onClose();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, effectiveResults.length - 1));
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
          // AI query: submit to AI search (only if not already in AI mode)
          if (isAI && aiPhase === 'idle' && query.trim()) {
            e.preventDefault();
            setPreviewOpen(false);
            setSubmittedAIQuery(query);
            setEnterTime(Date.now());
            setAiPhase('thinking');
            setSelectedIndex(0);
          } else if (effectiveResults[selectedIndex]) {
            handleNavigate(effectiveResults[selectedIndex]);
          }
          break;
      }
    },
    [query, activeFilter, aiPhase, isAI, onClose, effectiveResults, selectedIndex, handleNavigate]
  );

  useEffect(() => {
    if (open) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Divider drag — reads/writes MotionValue directly, zero React re-renders during drag
  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartW.current = panelWidthMV.get() - DIVIDER_W;

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = dragStartX.current - ev.clientX;
      const clamped = Math.min(Math.max(dragStartW.current + delta, PREVIEW_MIN), PREVIEW_MAX);
      panelWidthMV.set(clamped + DIVIDER_W);
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [panelWidthMV]);

  const entryY = params.entry_y as number;
  const entryBlur = params.entry_blur as number;

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
        staggerChildren: params.stagger_sections as number,
        delayChildren: 0.06,
      },
    },
    exit: {
      transition: {
        staggerChildren: (params.stagger_sections as number) * 0.5,
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
            animate={{ opacity: params.scrim_opacity as number }}
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
                width: params.size_compact_w as number,
                height: params.size_compact_h as number,
              }}
              animate={{
                opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
                width: previewOpen ? params.size_expanded_w as number : params.size_compact_w as number,
                height: previewOpen ? params.size_expanded_h as number : params.size_compact_h as number,
              }}
              exit={{
                opacity: 0, scale: 0.96,
                y: entryY * 0.6, filter: `blur(${entryBlur * 0.5}px)`,
              }}
              transition={{
                default: params.entry_spring as object,
                width: params.size_spring as object,
                height: params.size_spring as object,
              }}
            >
              <motion.div
                className="flex flex-col flex-1 min-h-0"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {/* ── Header ── */}
                <motion.div
                  className="shrink-0 flex flex-col gap-0 px-12 pt-12"
                  variants={sectionVariants}
                >
                  <SearchModalInput
                    value={query}
                    onChange={setQuery}
                    activeFilter={activeFilter}
                    onClearFilter={() => setActiveFilter(null)}
                  />
                  {aiPhase === 'idle' && (
                    <JumpToNav
                      previewOpen={previewOpen}
                      onTogglePreview={() => setPreviewOpen(p => !p)}
                      onClose={onClose}
                      activeFilter={activeFilter}
                      onFilterChange={setActiveFilter}
                    />
                  )}
                </motion.div>

                {/* ── Body ── */}
                <motion.div
                  className={`relative flex flex-1 min-h-0 px-12 ${aiPhase !== 'idle' ? 'pt-[24px]' : ''}`}
                  variants={sectionVariants}
                >
                  {aiPhase !== 'idle' || showResultsView ? (
                    <>
                      {/* Left column */}
                      <div className="relative flex flex-col flex-1 min-w-0 min-h-0">
                        <div className="flex-1 overflow-y-auto min-h-0 pb-10">
                          {aiPhase !== 'idle' && aiResponse ? (
                            <AIResponseView
                              response={aiResponse}
                              entities={aiEntities}
                              selectedIndex={selectedIndex}
                              onSelect={setSelectedIndex}
                              phase={aiPhase as 'thinking' | 'cooking'}
                              enterTime={enterTime}
                              onEntitiesComplete={handleEntitiesComplete}
                              loaderSize={params.loader_size as number}
                              loaderSpeed={params.loader_speed as number}
                              loaderPattern={params.loader_pattern as string}
                              loaderColor={params.loader_color as string}
                              entityStagger={params.ai_entity_stagger as number}
                              statusExitX={params.ai_status_exit_x as number}
                            />
                          ) : (
                            <ResultsList
                              results={results}
                              selectedIndex={selectedIndex}
                              onSelect={setSelectedIndex}
                              isRecent={isRecent}
                              query={query}
                            />
                          )}
                        </div>

                        {/* Progressive glassy blur */}
                        <ProgressiveBlur
                          height={params.blur_height as number}
                          maxBlur={params.blur_max_depth as number}
                          saturation={params.blur_saturation as number}
                          brightness={params.blur_brightness as number}
                          tintColor={params.blur_tint_color as string}
                          tintOpacity={params.blur_tint_opacity as number}
                        />
                      </div>

                      {/* Right panel: driven entirely by MotionValue — drag is instant */}
                      <motion.div
                        className="shrink-0 overflow-hidden flex h-full"
                        style={{ width: panelWidthMV, opacity: panelOpacityMV }}
                      >
                        {/* Draggable divider */}
                        <div
                          className="relative shrink-0 w-[7px] self-stretch mx-8 cursor-col-resize select-none"
                          onMouseDown={handleDividerMouseDown}
                        >
                          <div className="absolute left-[3px] top-0 bottom-0 w-[1.5px] bg-surface-fg-01" />
                          <div className="
                            absolute -translate-x-1/2 -translate-y-1/2
                            left-1/2 top-1/2
                            w-[7px] h-[20px] rounded-full
                            border-[0.5px] border-surface-stroke
                            shadow-soft bg-surface-fg-01
                          " />
                        </div>

                        {/* Preview pane — width tracks MotionValue minus divider */}
                        <motion.div
                          className="flex flex-col py-10 pr-4 shrink-0"
                          style={{ width: previewInnerWidth }}
                        >
                          <PreviewPane
                            entity={selectedEntity}
                            previewOpen={previewOpen}
                            onTogglePreview={aiPhase !== 'idle' ? () => setPreviewOpen(p => !p) : undefined}
                          />
                        </motion.div>
                      </motion.div>

                      {/* Panel expand icon — AI mode only, shown when preview is collapsed */}
                      <AnimatePresence>
                        {!previewOpen && aiPhase !== 'idle' && (
                          <motion.button
                            key="panel-expand"
                            type="button"
                            onClick={() => setPreviewOpen(true)}
                            aria-label="Expand preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.18, duration: 0.15 } }}
                            exit={{ opacity: 0, transition: { duration: 0.1 } }}
                            className="
                              absolute top-[34px] right-[16px]
                              flex items-center justify-center
                              size-[24px] rounded-md z-10
                              text-grey-400
                              transition-colors duration-150
                              hover:bg-surface-fg-01
                            "
                          >
                            <PanelLeft size={16} strokeWidth={1.5} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <div className="flex flex-col flex-1 min-h-0 justify-between pb-12">
                      <div className="flex-1 flex items-center justify-center">
                        <EmptyState onExampleClick={(ex) => setQuery(ex)} />
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* ── Footer — z-[1] keeps it above the blur layer ── */}
                <motion.div className="shrink-0 relative z-[1]" variants={sectionVariants}>
                  <SearchFooter />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
