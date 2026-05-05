export type EntityType = 'listing' | 'agent' | 'folder' | 'transaction' | 'action';

export type EntityStatus =
  | 'available'
  | 'pending'
  | 'rented'
  | 'sold'
  | 'active'
  | 'archived';

export interface SearchableEntity {
  id: string;
  type: EntityType;
  title: string;
  subtitle?: string;
  meta?: string;
  status?: EntityStatus;
  thumbnail?: string;
  href: string;
  searchTokens: string[];
  preview?: PreviewData;
}

export interface PreviewData {
  images?: string[];
  fields: Array<{ label: string; value: string }>;
}
