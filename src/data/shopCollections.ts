export interface ShopCollection {
  slug: string;
  label: string;
  collectionId?: string;
  snippetPath?: string;
  isDefault?: boolean;
}

/**
 * Theme / 作品 filter source of truth.
 *
 * For future Shopify Buy Button snippets, place HTML files in:
 * public/shopify-snippets/
 *
 * Recommended filename format:
 * public/shopify-snippets/{slug}.html
 */
export const themeCollections: ShopCollection[] = [
  {
    slug: 'home-page',
    label: 'Home Page',
    collectionId: '319229034543',
    isDefault: true,
  },
  { slug: 'blue-archive', label: 'Blue Archive', snippetPath: '/shopify-snippets/blue-archive.html' },
  { slug: 'monster-hunter', label: 'Monster Hunter', snippetPath: '/shopify-snippets/monster-hunter.html' },
  { slug: 'dungeon-meshi', label: 'Dungeon Meshi', snippetPath: '/shopify-snippets/dungeon-meshi.html' },
  { slug: 'splatoon', label: 'Splatoon', snippetPath: '/shopify-snippets/splatoon.html' },
  { slug: 'legend-of-zelda', label: 'Legend of Zelda', snippetPath: '/shopify-snippets/legend-of-zelda.html' },
  { slug: 'mygo-mujica', label: 'MyGO!!!!! / Ave Mujica', snippetPath: '/shopify-snippets/mygo-mujica.html' },
  { slug: 'project-sekai', label: 'Project Sekai', snippetPath: '/shopify-snippets/project-sekai.html' },
  { slug: 'vocaloid', label: 'VOCALOID', snippetPath: '/shopify-snippets/vocaloid.html' },
  { slug: 'pokemon', label: 'Pokemon', snippetPath: '/shopify-snippets/pokemon.html' },
  { slug: 'elden-ring', label: 'Elden Ring', snippetPath: '/shopify-snippets/elden-ring.html' },
  { slug: 'ffxiv', label: 'FFXIV', snippetPath: '/shopify-snippets/ffxiv.html' },
  { slug: 'vtuber', label: 'Vtuber', snippetPath: '/shopify-snippets/vtuber.html' },
];
