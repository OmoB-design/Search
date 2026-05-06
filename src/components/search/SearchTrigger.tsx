'use client';

import { useDialKit } from 'dialkit';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchTriggerProps {
  onClick?: () => void;
  className?: string;
}

export function SearchTrigger({ onClick, className = '' }: SearchTriggerProps) {
  const params = useDialKit('Search · Trigger', {
    tapScale: 0.97,
    spring: {
      type: 'spring',
      stiffness: 420,
      damping: 28,
    },
  });

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Open search"
      className={`
        group flex items-center gap-6
        w-search-trigger
        bg-surface-fg-01
        border-[0.8px] border-surface-stroke
        rounded-lg shadow-card
        px-8 py-4
        cursor-pointer select-none outline-none
        transition-colors duration-150 ease-out
        hover:bg-grey-100
        focus-visible:shadow-inset-focus focus-visible:border-blue-500
        ${className}
      `}
      whileTap={{ scale: params.tapScale as number }}
      transition={params.spring as object}
    >
      <Search
        size={16}
        strokeWidth={1.75}
        className="text-text-heading-05 shrink-0"
      />
      <span
        className="
          flex-1 text-left
          text-caption-2 font-normal leading-tight
          text-text-heading-05 whitespace-nowrap
        "
      >
        Search
      </span>
    </motion.button>
  );
}
