'use client';

import { SearchModal } from '@/components/search/SearchModal';
import { SearchTrigger } from '@/components/search/SearchTrigger';
import { useRef, useState } from 'react';

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

  return (
    <div className="min-h-screen bg-surface-primary flex flex-col items-center pt-[80px]">
      <div ref={triggerRef}>
        <SearchTrigger onClick={handleOpen} />
      </div>
      <SearchModal open={open} onClose={() => setOpen(false)} anchorBottom={anchorBottom} />
    </div>
  );
}
