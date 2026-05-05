'use client';

import { ResultItem } from './ResultItem';
import { SearchableEntity } from './lib/types';

interface ResultsListProps {
  results: SearchableEntity[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  isRecent: boolean;
}

export function ResultsList({
  results,
  selectedIndex,
  onSelect,
  isRecent,
}: ResultsListProps) {
  return (
    <div className="flex flex-col gap-12 py-10 w-full">
      <span className="text-caption-2 font-medium leading-tight text-text-heading-04 tracking-widest uppercase">
        {isRecent ? 'Recent' : 'Results'}
      </span>

      <div className="flex flex-col gap-2">
        {results.map((entity, i) => (
          <ResultItem
            key={entity.id}
            entity={entity}
            isSelected={i === selectedIndex}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
}
