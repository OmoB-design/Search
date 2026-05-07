'use client';

import { LayoutGroup } from 'framer-motion';
import { ResultItem } from './ResultItem';
import { EntityType, SearchableEntity } from './lib/types';

const TYPE_LABELS: Partial<Record<EntityType, string>> = {
  listing:     'Listings',
  agent:       'Agents',
  super_agent: 'Agents',
  folder:      'Folders',
  action:      'Actions',
  transaction: 'Transactions',
  document:    'Documents',
};

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-4 pt-10 pb-[4px]">
      <span className="text-caption-2 font-medium leading-tight text-text-heading-02 tracking-[0.04em] uppercase">
        {label}
      </span>
    </div>
  );
}

interface ResultsListProps {
  results: SearchableEntity[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  isRecent: boolean;
  query?: string;
}

export function ResultsList({
  results,
  selectedIndex,
  onSelect,
  isRecent,
  query,
}: ResultsListProps) {
  // No results for an active query
  if (results.length === 0 && query?.trim()) {
    return (
      <div className="px-4 py-9 text-center">
        <span className="text-caption-2 font-normal text-text-heading-06">
          No results for &ldquo;<strong className="font-medium text-text-heading-05">{query}</strong>&rdquo;
          {' '}— try asking a question
        </span>
      </div>
    );
  }

  // Recent: flat list under a single RECENT header
  if (isRecent) {
    return (
      <LayoutGroup>
        <div className="flex flex-col w-full">
          <SectionHeader label="Recent" />
          <div className="flex flex-col gap-[2px]">
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
      </LayoutGroup>
    );
  }

  // Search results: group by type, insert section headers on type change
  const grouped = results.reduce<
    Array<{ type: EntityType; items: { entity: SearchableEntity; globalIndex: number }[] }>
  >((acc, entity, i) => {
    const last = acc[acc.length - 1];
    if (last && last.type === entity.type) {
      last.items.push({ entity, globalIndex: i });
    } else {
      acc.push({ type: entity.type, items: [{ entity, globalIndex: i }] });
    }
    return acc;
  }, []);

  return (
    <LayoutGroup>
      <div className="flex flex-col w-full">
        {grouped.map(section => (
          <div key={section.type}>
            <SectionHeader label={TYPE_LABELS[section.type] ?? section.type} />
            <div className="flex flex-col gap-[2px]">
              {section.items.map(({ entity, globalIndex }) => (
                <ResultItem
                  key={entity.id}
                  entity={entity}
                  isSelected={globalIndex === selectedIndex}
                  query={query}
                  onClick={() => onSelect(globalIndex)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </LayoutGroup>
  );
}
