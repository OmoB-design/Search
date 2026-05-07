'use client';

import { SearchModal } from '@/components/search/SearchModal';
import { SearchTrigger } from '@/components/search/SearchTrigger';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [anchorBottom, setAnchorBottom] = useState(0);

  const handleOpen = () => {
    if (triggerRef.current) {
      setAnchorBottom(triggerRef.current.getBoundingClientRect().bottom);
    }
    setOpen(true);
  };

  // ⌘A (Mac) / Ctrl+A (Win) — open modal unless cursor is in a text field
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key !== 'a') return;
      const target = e.target as HTMLElement;
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
      e.preventDefault();
      if (!open) handleOpen();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="min-h-screen bg-surface-primary flex flex-col items-center pt-[80px]">
      <div ref={triggerRef}>
        <SearchTrigger onClick={handleOpen} />
      </div>
      <SearchModal open={open} onClose={() => setOpen(false)} anchorBottom={anchorBottom} />
    </div>
  );
}
