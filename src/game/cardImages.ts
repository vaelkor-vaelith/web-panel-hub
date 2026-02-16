const cardImgs = import.meta.glob('/src/assets/cards/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;
const rootImgs = import.meta.glob('/src/assets/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;

export function getCardImage(cardName: string): string | undefined {
  const slug = cardName.toLowerCase().replace(/\b(the|of|and)\b/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return cardImgs[`/src/assets/cards/${slug}.jpg`] || rootImgs[`/src/assets/${slug}.jpg`];
}
