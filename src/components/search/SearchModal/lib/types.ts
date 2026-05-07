export type EntityType =
  | 'listing'
  | 'agent'
  | 'super_agent'
  | 'folder'
  | 'transaction'
  | 'document'
  | 'action';

export type EntityStatus =
  | 'available'
  | 'pending'
  | 'rented'
  | 'sold'
  | 'active'
  | 'on_leave'
  | 'archived'
  | 'negotiating';

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
  actions?: Array<{ label: string; href?: string }>;
}
