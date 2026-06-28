export interface ShopCollection {
  slug: string;
  label: string;
  collectionId?: string;
  snippetPath?: string;
  layout?: 'standard' | 'large';
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
  { slug: 'blue-archive', label: '蔚藍檔案', snippetPath: '/shopify-snippets/blue-archive.html' },
  { slug: 'monster-hunter', label: '魔物獵人', snippetPath: '/shopify-snippets/monster-hunter.html' },
  { slug: 'dungeon-meshi', label: '迷宮飯', snippetPath: '/shopify-snippets/dungeon-meshi.html' },
  { slug: 'splatoon', label: '斯普拉遁', snippetPath: '/shopify-snippets/splatoon.html' },
  {
    slug: 'legend-of-zelda',
    label: '薩爾達傳說',
    collectionId: '319252725807',
    layout: 'large',
  },
  { slug: 'mygo-mujica', label: 'MyGO!!!!! / Ave Mujica', snippetPath: '/shopify-snippets/mygo-mujica.html' },
  { slug: 'project-sekai', label: '世界計畫', snippetPath: '/shopify-snippets/project-sekai.html' },
  { slug: 'vocaloid', label: 'VOCALOID', snippetPath: '/shopify-snippets/vocaloid.html' },
  { slug: 'pokemon', label: '寶可夢', snippetPath: '/shopify-snippets/pokemon.html' },
  { slug: 'elden-ring', label: '艾爾登法環', snippetPath: '/shopify-snippets/elden-ring.html' },
  { slug: 'ffxiv', label: '最終幻想14', snippetPath: '/shopify-snippets/ffxiv.html' },
  { slug: 'vtuber', label: 'Vtuber', snippetPath: '/shopify-snippets/vtuber.html' },
];
