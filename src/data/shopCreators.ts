export interface ShopCreatorFilter {
  slug: string;
  label: string;
  collectionId?: string;
  snippetPath?: string;
}

/**
 * 創作者分類 filter source of truth.
 *
 * Labels are from reference/creator-list.txt.
 * Shopify collection/snippet wiring can be added here as each creator collection becomes ready.
 */
export const creatorFilters: ShopCreatorFilter[] = [
  { slug: 'ahua', label: 'Ahua' },
  { slug: 'chowee', label: 'Chowee' },
  { slug: 'gerri', label: 'Gerri' },
  { slug: 'p-chan', label: 'P-Chan' },
  {
    slug: 'yy',
    label: 'YY',
    collectionId: '319252889647',
  },
];
