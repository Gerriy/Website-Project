export interface ShopCollection {
  slug: string;
  label: string;
  collectionId?: string;
  snippetPath?: string;
  isDefault?: boolean;
}

/**
 * 作品分類 filter source of truth.
 *
 * For future Shopify Buy Button snippets, place HTML files in:
 * public/shopify-snippets/
 *
 * Recommended filename format:
 * public/shopify-snippets/{slug}.html
 */
export const themeCollections: ShopCollection[] = [
  {
    slug: 'all',
    label: '全部',
    collectionId: '319229034543',
    isDefault: true,
  },
  { slug: 'blue-archive', label: '蔚藍檔案', collectionId: '319233294383' },
  { slug: 'monster-hunter', label: '魔物獵人', collectionId: '319252561967' },
  { slug: 'dungeon-meshi', label: '迷宮飯', collectionId: '319252627503' },
  { slug: 'splatoon', label: '斯普拉遁', collectionId: '319252660271' },
  {
    slug: 'legend-of-zelda',
    label: '薩爾達傳說',
    collectionId: '319252725807',
  },
  { slug: 'mygo-mujica', label: 'MyGO!!!!! / Ave Mujica', collectionId: '319252791343' },
  { slug: 'project-sekai', label: '世界計畫', collectionId: '319252856879' },
  { slug: 'vocaloid', label: 'VOCALOID', snippetPath: '/shopify-snippets/vocaloid.html' },
  { slug: 'pokemon', label: '寶可夢', collectionId: '319252922415' },
  { slug: 'elden-ring', label: '艾爾登法環', collectionId: '319252987951' },
  { slug: 'ffxiv', label: '最終幻想14', snippetPath: '/shopify-snippets/ffxiv.html' },
  { slug: 'vtuber', label: 'Vtuber', collectionId: '319253053487' },
];
