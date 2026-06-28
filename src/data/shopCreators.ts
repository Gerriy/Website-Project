export interface ShopCreatorFilter {
  slug: string;
  label: string;
  collectionId?: string;
  snippetPath?: string;
  isDefault?: boolean;
}

/**
 * 創作者分類 filter source of truth.
 *
 * Labels are from reference/creator-list.txt.
 * Shopify collection/snippet wiring can be added here as each creator collection becomes ready.
 */
export const creatorFilters: ShopCreatorFilter[] = [
  {
    slug: 'all',
    label: '全部',
    collectionId: '319229034543',
    isDefault: true,
  },
  {
    slug: 'ahua',
    label: 'Ahua',
    collectionId: '319252594735',
  },
  {
    slug: 'chowee',
    label: 'Chowee',
    collectionId: '319252693039',
  },
  {
    slug: 'gerri',
    label: 'Gerri',
    collectionId: '319252758575',
  },
  {
    slug: 'p-chan',
    label: 'P-Chan',
    collectionId: '319252824111',
  },
  {
    slug: 'yy',
    label: 'YY',
    collectionId: '319252889647',
  },
  { slug: 'riki', label: 'Riki' },
];
