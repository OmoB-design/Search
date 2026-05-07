import { EntityType } from './types';

export const ASK_ANYTHING_EXAMPLES = [
  'which agents have pending deals?',
  'show me Lekki listings',
] as const;

export type FilterChip = {
  label: string;
  filterType: EntityType | null;
  href?: string;
};

// Chips that set a type filter stay in the modal; chips with href navigate.
export const FILTER_CHIPS: FilterChip[] = [
  { label: 'All listings', filterType: 'listing' },
  { label: 'Agents',       filterType: 'agent' },
  { label: 'Schedule',     filterType: null, href: '/dashboard/schedule' },
  { label: 'Settings',     filterType: null, href: '/dashboard/settings' },
];
