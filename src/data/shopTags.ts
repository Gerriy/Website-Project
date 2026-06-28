export type ShopTagCategory = 'Creator' | 'Theme' | 'Other';

export interface ShopTagDefinition {
  shopifyTag: string;
  category: ShopTagCategory;
  displayEn: string;
  displayCn: string;
  color: string;
}

export interface ProductTagBadge {
  sourceTag: string;
  category: ShopTagCategory;
  displayEn: string;
  displayCn: string;
  color: string;
  priority: number;
}

/**
 * Tag display source of truth.
 *
 * Source: reference/tag-color-definition.csv + reference/tag-color-definition.xlsx.
 * The CSV is Big5 encoded; keep this TypeScript file UTF-8.
 */
export const shopTagDefinitions: ShopTagDefinition[] = [
  { shopifyTag: 'Ahua', category: 'Creator', displayEn: 'Ahua', displayCn: 'Ahua', color: '#f6a6c8' },
  { shopifyTag: 'Chow', category: 'Creator', displayEn: 'Chowee', displayCn: 'Chow', color: '#98d96f' },
  { shopifyTag: 'Gerri', category: 'Creator', displayEn: 'Gerri', displayCn: 'Gerry', color: '#7fd7f4' },
  { shopifyTag: 'MastaDan', category: 'Creator', displayEn: 'MastaDan', displayCn: 'MastaDan', color: '#4e98ef' },
  { shopifyTag: 'P', category: 'Creator', displayEn: 'P-Chan', displayCn: 'P-Chan', color: '#e84f5f' },
  { shopifyTag: 'Riki', category: 'Creator', displayEn: 'Riki', displayCn: 'Riki', color: '#63676a' },
  { shopifyTag: 'YY', category: 'Creator', displayEn: 'YY', displayCn: 'YY', color: '#ffbd5a' },
  { shopifyTag: 'Yasaaai', category: 'Creator', displayEn: 'Yasaaai', displayCn: 'Yasaaai', color: '#85d99c' },
  { shopifyTag: 'BA', category: 'Theme', displayEn: 'Blue Archive', displayCn: '蔚藍檔案', color: '#55aee8' },
  { shopifyTag: 'MH', category: 'Theme', displayEn: 'Monster Hunter', displayCn: '魔物獵人', color: '#7d9b57' },
  { shopifyTag: 'DM', category: 'Theme', displayEn: 'Dungeon Meshi', displayCn: '迷宮飯', color: '#d8914f' },
  { shopifyTag: 'SPTN', category: 'Theme', displayEn: 'Splatoon', displayCn: '斯普拉遁', color: '#e84da1' },
  { shopifyTag: 'ZELD', category: 'Theme', displayEn: 'Legend of Zelda', displayCn: '薩爾達傳說', color: '#65b96d' },
  { shopifyTag: 'MYMU', category: 'Theme', displayEn: 'MygoMujica', displayCn: 'MyGO!!!!! / Ave Mujica', color: '#7768de' },
  { shopifyTag: 'PRSK', category: 'Theme', displayEn: 'Project Sekai', displayCn: '世界計畫', color: '#ff8bbd' },
  { shopifyTag: 'V', category: 'Theme', displayEn: 'Vocaloid', displayCn: 'VOCALOID', color: '#56c7de' },
  { shopifyTag: 'POKE', category: 'Theme', displayEn: 'Pokemon', displayCn: '寶可夢', color: '#f4c84f' },
  { shopifyTag: 'ELDR', category: 'Theme', displayEn: 'Elden Ring', displayCn: '艾爾登法環', color: '#b08c5b' },
  { shopifyTag: 'FF', category: 'Theme', displayEn: 'FFXIV', displayCn: '最終幻想14', color: '#7c8ea7' },
  { shopifyTag: 'VTB', category: 'Theme', displayEn: 'Vtuber', displayCn: 'Vtuber', color: '#c27fe8' },
];

const tagMap = new Map(shopTagDefinitions.map((tag) => [tag.shopifyTag.toLowerCase(), tag]));
const categoryPriority: Record<ShopTagCategory, number> = {
  Creator: 0,
  Theme: 1,
  Other: 2,
};

export function buildProductTagBadges(tags: string[] = []): ProductTagBadge[] {
  return tags
    .map((rawTag, originalIndex) => {
      const sourceTag = String(rawTag || '').trim();
      if (!sourceTag) return null;

      const definition = tagMap.get(sourceTag.toLowerCase());
      const category = definition?.category || 'Other';
      const definitionIndex = definition ? shopTagDefinitions.indexOf(definition) : originalIndex;

      return {
        sourceTag,
        category,
        displayEn: definition?.displayEn || sourceTag,
        displayCn: definition?.displayCn || sourceTag,
        color: definition?.color || '#9aa9bc',
        priority: categoryPriority[category] * 1000 + definitionIndex,
      };
    })
    .filter((tag): tag is ProductTagBadge => Boolean(tag))
    .sort((a, b) => a.priority - b.priority || a.displayEn.localeCompare(b.displayEn));
}
