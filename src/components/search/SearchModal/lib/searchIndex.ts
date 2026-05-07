import { EntityType, SearchableEntity } from './types';
import { getRecentItems } from './recentItems';

// Figma assets from node 7002-32239 (expire ~7 days)
const IMG_LEKKI_MAIN  = 'https://www.figma.com/api/mcp/asset/b694c8ec-e5ae-40d4-a329-937c0e1efb66';
const IMG_VI_APT      = 'https://www.figma.com/api/mcp/asset/dae5452c-6960-4bac-905e-d3104f7a8673';
const IMG_COMMERCIAL  = 'https://www.figma.com/api/mcp/asset/b29ff808-0af2-40db-ab60-296aa8bb0b42';
const IMG_KEMI        = 'https://www.figma.com/api/mcp/asset/1779b902-d845-4561-bb43-cce9f954249d';
const IMG_TUNDE       = 'https://www.figma.com/api/mcp/asset/45ac7e04-381a-42ed-8fa9-5796b3b43e47';
const IMG_AMARA       = 'https://www.figma.com/api/mcp/asset/101e9c26-15dd-4baf-894e-8cd89a38f331';

export const MOCK_DATA: SearchableEntity[] = [
  // — Folders —
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

  // — Agents —
  {
    id: 'A001',
    type: 'agent',
    title: 'Kemi Adeyemi',
    subtitle: '14 listings · Lagos East',
    meta: 'Agent',
    status: 'active',
    thumbnail: IMG_KEMI,
    href: '/agents/A001',
    searchTokens: ['kemi', 'adeyemi', 'lagos', 'east', 'agent', 'listings'],
    preview: {
      // images[0] = agent avatar; images[1..] = listing thumbnails shown in the preview card row
      images: [IMG_KEMI, IMG_LEKKI_MAIN, IMG_VI_APT, IMG_COMMERCIAL, IMG_VI_APT],
      fields: [
        { label: 'Listings', value: '14' },
        { label: 'Region', value: 'Lagos East' },
        { label: 'Status', value: 'Active' },
      ],
    },
  },
  {
    id: 'A002',
    type: 'agent',
    title: 'Tunde Bello',
    subtitle: '9 listings · Lagos East',
    meta: 'Agent',
    status: 'active',
    thumbnail: IMG_TUNDE,
    href: '/agents/A002',
    searchTokens: ['tunde', 'bello', 'lagos', 'east', 'agent', 'listings'],
    preview: {
      images: [IMG_TUNDE, IMG_VI_APT, IMG_COMMERCIAL, IMG_LEKKI_MAIN],
      fields: [
        { label: 'Listings', value: '9' },
        { label: 'Region', value: 'Lagos East' },
        { label: 'Status', value: 'Active' },
      ],
    },
  },
  {
    id: 'A003',
    type: 'agent',
    title: 'Amara Okonkwo',
    subtitle: '7 listings · Lagos East',
    meta: 'Agent',
    status: 'on_leave',
    thumbnail: IMG_AMARA,
    href: '/agents/A003',
    searchTokens: ['amara', 'okonkwo', 'lagos', 'east', 'agent', 'listings'],
    preview: {
      images: [IMG_AMARA, IMG_COMMERCIAL, IMG_LEKKI_MAIN, IMG_VI_APT],
      fields: [
        { label: 'Listings', value: '7' },
        { label: 'Region', value: 'Lagos East' },
        { label: 'Status', value: 'On leave' },
      ],
    },
  },

  // — Listings —
  {
    id: 'L001',
    type: 'listing',
    title: '4-Bed Duplex, Lekki Phase 1',
    subtitle: 'For Sale · ₦85M · Kemi A.',
    meta: 'Kemi Adeyemi',
    status: 'available',
    thumbnail: IMG_LEKKI_MAIN,
    href: '/listings/L001',
    searchTokens: ['lekki', 'duplex', 'phase 1', 'kemi', 'adeyemi', '85m', '4 bed', 'listing', 'sale'],
    preview: {
      images: [IMG_LEKKI_MAIN, IMG_VI_APT, IMG_COMMERCIAL],
      fields: [
        { label: 'Agent', value: 'Kemi Adeyemi' },
        { label: 'Type', value: 'For Sale' },
        { label: 'Status', value: 'Available' },
      ],
    },
  },
  {
    id: 'L002',
    type: 'listing',
    title: '2-Bed Apartment, Victoria Island',
    subtitle: 'For Rent · ₦1.2M/yr · Tunde B.',
    meta: 'Tunde Bello',
    status: 'rented',
    thumbnail: IMG_VI_APT,
    href: '/listings/L002',
    searchTokens: ['victoria', 'island', 'apartment', '2 bed', 'tunde', 'bello', '1.2m', 'rent'],
    preview: {
      images: [IMG_VI_APT],
      fields: [
        { label: 'Agent', value: 'Tunde Bello' },
        { label: 'Type', value: 'For Rent' },
        { label: 'Status', value: 'Rented' },
      ],
    },
  },
  {
    id: 'L003',
    type: 'listing',
    title: 'Commercial Space, Ikeja GRA',
    subtitle: 'Lease · ₦4.5M/yr · Amara O.',
    meta: 'Amara Okonkwo',
    status: 'pending',
    thumbnail: IMG_COMMERCIAL,
    href: '/listings/L003',
    searchTokens: ['commercial', 'ikeja', 'gra', 'lease', 'amara', 'okonkwo', '4.5m'],
    preview: {
      images: [IMG_COMMERCIAL],
      fields: [
        { label: 'Agent', value: 'Amara Okonkwo' },
        { label: 'Type', value: 'Lease' },
        { label: 'Status', value: 'Pending' },
      ],
    },
  },

  // — Actions —
  {
    id: 'ACT001',
    type: 'action',
    title: 'Add new listing',
    href: '/listings/new',
    searchTokens: ['add', 'new', 'listing', 'create', 'listings'],
  },
  {
    id: 'ACT002',
    type: 'action',
    title: 'Assign Collaborator',
    href: '/collaborators/assign',
    searchTokens: ['assign', 'collaborator', 'invite', 'team', 'colleague'],
  },
  {
    id: 'ACT003',
    type: 'action',
    title: 'View schedule',
    href: '/schedule',
    searchTokens: ['schedule', 'calendar', 'view', 'appointments'],
  },
];

const MOCK_RECENT_IDS = ['F001', 'A001', 'L001'];

export function getRecent(): SearchableEntity[] {
  const stored = getRecentItems();
  if (stored.length > 0) {
    return stored
      .map(item => MOCK_DATA.find(e => e.id === item.id) ?? {
        id: item.id,
        type: item.type,
        title: item.title,
        subtitle: item.subtitle,
        href: item.href,
        searchTokens: [],
      } as SearchableEntity)
      .filter(Boolean);
  }
  return MOCK_RECENT_IDS
    .map(id => MOCK_DATA.find(e => e.id === id))
    .filter(Boolean) as SearchableEntity[];
}

const LIMITS: Partial<Record<EntityType, number>> = {
  listing: 3,
  agent: 3,
  super_agent: 3,
  folder: 2,
  action: 3,
  transaction: 3,
  document: 3,
};

export const GROUP_ORDER: EntityType[] = [
  'listing', 'agent', 'super_agent', 'folder', 'transaction', 'document', 'action',
];

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

export function searchEntities(query: string, typeFilter?: EntityType | null): SearchableEntity[] {
  const q = query.trim();

  if (typeFilter) {
    // Expand 'agent' to include super_agent
    const candidates = MOCK_DATA.filter(e =>
      e.type === typeFilter || (typeFilter === 'agent' && e.type === 'super_agent')
    );
    if (!q) return candidates;
    return candidates
      .map(e => ({ entity: e, score: matchScore(e, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ entity }) => entity);
  }

  if (!q) return getRecent();

  const scored = MOCK_DATA
    .map(e => ({ entity: e, score: matchScore(e, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const countByType: Partial<Record<EntityType, number>> = {};
  const capped: SearchableEntity[] = [];
  for (const { entity } of scored) {
    const limit = LIMITS[entity.type] ?? 3;
    const count = countByType[entity.type] ?? 0;
    if (count < limit) {
      capped.push(entity);
      countByType[entity.type] = count + 1;
    }
  }

  return capped.sort(
    (a, b) => GROUP_ORDER.indexOf(a.type) - GROUP_ORDER.indexOf(b.type)
  );
}

export function highlightSegments(
  text: string,
  query: string
): Array<{ text: string; highlighted: boolean }> {
  if (!query.trim()) return [{ text, highlighted: false }];
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'gi');
  const result: Array<{ text: string; highlighted: boolean }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push({ text: text.slice(lastIndex, match.index), highlighted: false });
    }
    result.push({ text: match[0], highlighted: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    result.push({ text: text.slice(lastIndex), highlighted: false });
  }
  return result.length ? result : [{ text, highlighted: false }];
}
