import { EntityType, SearchableEntity } from './types';

const STORAGE_KEY = 'terrah360.search.recent';
const MAX_RECENT = 5;

export interface RecentItem {
  id: string;
  type: EntityType;
  title: string;
  subtitle?: string;
  href: string;
  visitedAt: number;
}

export function getRecentItems(): RecentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentItem(entity: SearchableEntity): void {
  if (typeof window === 'undefined') return;
  const current = getRecentItems();
  const filtered = current.filter(item => item.id !== entity.id);
  const next: RecentItem[] = [
    {
      id: entity.id,
      type: entity.type,
      title: entity.title,
      subtitle: entity.subtitle,
      href: entity.href,
      visitedAt: Date.now(),
    },
    ...filtered,
  ].slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearRecentItems(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
