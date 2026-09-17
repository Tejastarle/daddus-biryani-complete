import raw from '@/data/menu.json';

export type SectionKey = 'biryani' | 'tawa' | 'starters' | 'rolls' | 'combos' | 'bulk' | 'beverages';

export type MenuEntry = {
  id: string;
  name: string;
  section: SectionKey;
  group: string;
  veg?: boolean;
  prices: { small?: number; large?: number; perKg?: number; price?: number };
  note?: string;
  includes?: string[];
  serves?: string;
  image?: string;
};

/** Generated from the owner's pricing workbook by scripts/extract_menu.py */
export const MENU = raw as MenuEntry[];

export const SECTIONS: { key: SectionKey; title: string; blurb?: string }[] = [
  { key: 'biryani', title: 'Biryani & Pulao', blurb: 'Slow-cooked on dum. Small serves 1, large serves 1–2.' },
  { key: 'tawa', title: 'Tawa Pulao', blurb: 'Tossed to order on the tawa.' },
  { key: 'starters', title: 'Kebabs & Starters' },
  { key: 'rolls', title: 'Rolls' },
  { key: 'combos', title: 'Combos', blurb: 'Biryani, kebabs, gulab jamun and a drink in one order.' },
  { key: 'bulk', title: 'Party orders', blurb: 'Priced per kg for gatherings, offices and functions.' },
  { key: 'beverages', title: 'Drinks' },
];

export const inr = (n?: number) => (n ? `₹${n.toLocaleString('en-IN')}` : '');

export function lowestPrice(e: MenuEntry) {
  const vals = [e.prices.small, e.prices.large, e.prices.price].filter(Boolean) as number[];
  return vals.length ? Math.min(...vals) : e.prices.perKg;
}

export function findEntry(match: (e: MenuEntry) => boolean) {
  return MENU.find(match);
}

/** Dishes available by the kilo, for the party estimator */
export const BULK = MENU.filter((e) => e.section === 'bulk' && e.prices.perKg);
