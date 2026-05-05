import { SearchableEntity } from './types';

// Placeholder images from Figma — expire after 7 days
const IMG_LEKKI_MAIN = 'https://www.figma.com/api/mcp/asset/b2ddd63b-79f8-4e9a-b1b9-de91ccc08ff5';
const IMG_LEKKI_B = 'https://www.figma.com/api/mcp/asset/0373ceb0-1d0e-4fa0-9602-07cb298119f7';
const IMG_LEKKI_C = 'https://www.figma.com/api/mcp/asset/3a364713-6e47-42cf-aeeb-08a1a5b283ec';
const IMG_KEMI = 'https://www.figma.com/api/mcp/asset/848c9bf5-246f-4c1f-a2f7-ad24cbf2eb1c';

export const MOCK_DATA: SearchableEntity[] = [
  {
    id: 'F001',
    type: 'folder',
    title: 'Victoria Island Portfolio',
    subtitle: 'Folder · 7 items',
    href: '/folders/F001',
    searchTokens: ['victoria', 'island', 'portfolio', 'vi', 'folder'],
    preview: {
      images: [],
      fields: [{ label: 'Items', value: '7 listings' }],
    },
  },
  {
    id: 'A001',
    type: 'agent',
    title: 'Kemi Adeyemi',
    subtitle: '14 listings · Lagos East',
    meta: 'Agent',
    thumbnail: IMG_KEMI,
    href: '/agents/A001',
    searchTokens: ['kemi', 'adeyemi', 'lagos', 'east', 'agent'],
    preview: {
      images: [IMG_KEMI],
      fields: [
        { label: 'Listings', value: '14' },
        { label: 'Region', value: 'Lagos East' },
      ],
    },
  },
  {
    id: 'L001',
    type: 'listing',
    title: '4-Bed Duplex, Lekki Phase 1',
    subtitle: 'Listing · ₦85M · Available',
    meta: 'Tosin Gbenga',
    thumbnail: IMG_LEKKI_MAIN,
    href: '/listings/L001',
    searchTokens: ['lekki', 'duplex', 'phase 1', 'tosin', 'gbenga', '85m', '4 bed', 'listing'],
    preview: {
      images: [IMG_LEKKI_MAIN, IMG_LEKKI_B, IMG_LEKKI_C],
      fields: [{ label: 'Agent', value: 'Tosin Gbenga' }],
    },
  },
  {
    id: 'L002',
    type: 'listing',
    title: '3-Bed Apartment, Ikoyi',
    subtitle: 'Listing · ₦120M · Pending',
    meta: 'Kemi Adeyemi',
    href: '/listings/L002',
    searchTokens: ['ikoyi', 'apartment', '3 bed', 'kemi', 'adeyemi', '120m', 'pending'],
    preview: {
      images: [],
      fields: [{ label: 'Agent', value: 'Kemi Adeyemi' }],
    },
  },
  {
    id: 'L003',
    type: 'listing',
    title: '5-Bed Villa, Banana Island',
    subtitle: 'Listing · ₦350M · Available',
    meta: 'Tosin Gbenga',
    href: '/listings/L003',
    searchTokens: ['banana', 'island', 'villa', '5 bed', 'tosin', 'gbenga', '350m'],
    preview: {
      images: [],
      fields: [{ label: 'Agent', value: 'Tosin Gbenga' }],
    },
  },
];

export const RECENT_IDS = ['F001', 'A001', 'L001'];

export function getRecent(): SearchableEntity[] {
  return RECENT_IDS
    .map(id => MOCK_DATA.find(e => e.id === id))
    .filter(Boolean) as SearchableEntity[];
}

function matchScore(entity: SearchableEntity, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  if (entity.title.toLowerCase() === q) return 100;
  if (entity.title.toLowerCase().startsWith(q)) return 80;
  if (entity.title.toLowerCase().includes(q)) return 60;
  if (entity.searchTokens.some(t => t.includes(q))) return 40;
  if (entity.subtitle?.toLowerCase().includes(q)) return 30;
  if (entity.meta?.toLowerCase().includes(q)) return 20;
  return 0;
}

export function searchEntities(query: string): SearchableEntity[] {
  const q = query.trim();
  if (!q) return getRecent();
  return MOCK_DATA
    .map(e => ({ entity: e, score: matchScore(e, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ entity }) => entity);
}
