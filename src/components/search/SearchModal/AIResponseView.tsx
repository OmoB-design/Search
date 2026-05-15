'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DotmSquare3 } from '@/components/ui/dotm-square-3';
import type { MatrixPattern } from '@/lib/dotmatrix-core';
import { AIResponseSegment, MockAIResponse } from './lib/aiMock';
import { ResultItem } from './ResultItem';
import { SearchableEntity } from './lib/types';

function getStreamedSegments(
  segments: AIResponseSegment[],
  length: number,
): { text: string; linked?: boolean }[] {
  const result: { text: string; linked?: boolean }[] = [];
  let pos = 0;
  for (const seg of segments) {
    if (pos >= length) break;
    const show = seg.text.slice(0, Math.max(0, length - pos));
    if (show.length > 0) result.push({ text: show, linked: seg.linked });
    pos += seg.text.length;
  }
  return result;
}

interface AIResponseViewProps {
  response: MockAIResponse;
  entities: SearchableEntity[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  phase: 'thinking' | 'cooking';
  enterTime: number;
  onEntitiesComplete: () => void;
  loaderSize?: number;
  loaderSpeed?: number;
  loaderPattern?: string;
  loaderColor?: string;
  entityStagger?: number;
  statusExitX?: number;
}

export function AIResponseView({
  response, entities, selectedIndex, onSelect,
  phase, enterTime, onEntitiesComplete,
  loaderSize = 16, loaderSpeed = 1.35, loaderPattern = 'rings', loaderColor = '#1969fe',
  entityStagger = 0.08, statusExitX = 20,
}: AIResponseViewProps) {
  const [streamedLength, setStreamedLength] = useState(0);
  const [entitiesVisible, setEntitiesVisible] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [streamingDone, setStreamingDone] = useState(false);
  const [entitiesShown, setEntitiesShown] = useState(false);

  const onEntitiesCompleteRef = useRef(onEntitiesComplete);
  onEntitiesCompleteRef.current = onEntitiesComplete;

  const totalLength = response.segments.reduce((s, seg) => s + seg.text.length, 0);

  useEffect(() => {
    setStreamedLength(0);
    setEntitiesVisible(false);
    setIsDone(false);
    setElapsedSeconds(0);
    setStreamingDone(false);
    setEntitiesShown(false);
  }, [enterTime]);

  useEffect(() => {
    if (phase !== 'cooking') return;

    let len = 0;
    const interval = setInterval(() => {
      len += 3;
      if (len >= totalLength) {
        setStreamedLength(totalLength);
        clearInterval(interval);
        setElapsedSeconds(Math.round((Date.now() - enterTime) / 1000));
        setStreamingDone(true);
        setTimeout(() => setEntitiesVisible(true), 280);
      } else {
        setStreamedLength(len);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [phase, totalLength, enterTime]);

  useEffect(() => {
    if (entitiesVisible && entities.length === 0) setEntitiesShown(true);
  }, [entitiesVisible, entities.length]);

  useEffect(() => {
    if (streamingDone && entitiesShown && !isDone) {
      setIsDone(true);
      onEntitiesCompleteRef.current();
    }
  // onEntitiesComplete is accessed via ref — intentionally excluded from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamingDone, entitiesShown]);

  const handleLastEntityDone = useCallback(() => {
    setEntitiesShown(true);
  }, []);

  const streamedSegments = getStreamedSegments(response.segments, streamedLength);
  const isStreaming = phase === 'cooking' && streamedLength < totalLength;
  const statusWord = phase === 'thinking' ? 'Thinking' : 'Cooking';

  return (
    <div className="flex flex-col py-[10px] gap-[12px]">

      {/* ── Status row ── */}
      <div className="flex items-center">
        <AnimatePresence mode="popLayout">
          {!isDone ? (
            <motion.div
              key="status-active"
              className="flex items-center gap-[8px]"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: statusExitX,
                transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
              }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            >
              <DotmSquare3
                size={loaderSize}
                dotSize={Math.max(2, Math.round(loaderSize / 7))}
                color={loaderColor}
                speed={loaderSpeed}
                pattern={loaderPattern as MatrixPattern}
              />
              {/* Word swap: Thinking ↔ Cooking */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={statusWord}
                  className="text-caption-2 font-medium leading-tight whitespace-nowrap ai-shimmer-text"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  {statusWord}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="status-done"
              className="flex items-center"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.12, ease: [0.2, 0, 0, 1] }}
            >
              <span className="text-caption-2 font-normal leading-tight text-text-heading-06 whitespace-nowrap">
                Thought for {elapsedSeconds}s
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Content + entities ── */}
      <div className="flex flex-col gap-[20px]">

        {/* Streaming answer — flush left, shimmer while generating */}
        {phase === 'cooking' && streamedLength > 0 && (
          <motion.div
            className="pr-[12px] py-[10px] rounded-[8px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <p className={`text-caption-2 font-medium leading-tight w-full ${isStreaming ? 'ai-shimmer-text' : 'text-text-heading-04'}`}>
              {streamedSegments.map((seg, i) =>
                seg.linked ? (
                  <span
                    key={i}
                    className="text-text-heading-02 underline underline-offset-2 decoration-text-heading-06/40 cursor-pointer hover:text-text-heading-01 transition-colors"
                  >
                    {seg.text}
                  </span>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )}
              {/* Blinking cursor while streaming */}
              {isStreaming && (
                <motion.span
                  className="inline-block w-[1.5px] h-[12px] bg-blue-400 ml-[1px] rounded-full align-middle"
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9, times: [0, 0.45, 0.55, 1] }}
                />
              )}
            </p>
          </motion.div>
        )}

        {/* Entity rows — stagger in one by one after text is complete */}
        <AnimatePresence>
          {entitiesVisible && (
            <div className="flex flex-col gap-[12px] py-[10px]">
              <div>
                <span className="text-caption-3 font-medium leading-tight text-text-heading-02 tracking-[0.04em] uppercase">
                  {response.entityLabel}
                </span>
              </div>
              <div className="flex flex-col gap-[2px]">
                {entities.map((entity, i) => (
                  <motion.div
                    key={entity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * entityStagger,
                      type: 'spring',
                      stiffness: 240,
                      damping: 30,
                    }}
                    onAnimationComplete={i === entities.length - 1 ? handleLastEntityDone : undefined}
                  >
                    <ResultItem
                      entity={entity}
                      isSelected={i === selectedIndex}
                      onClick={() => onSelect(i)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
