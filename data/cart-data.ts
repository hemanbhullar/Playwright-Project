export interface CartItem {
  name: string;
  unitCents: number;
  quantity: number;
}

export const baskets: Record<string, readonly CartItem[]> = {
  standard: [
    { name: 'Headphones', unitCents: 20_000, quantity: 2 },
    { name: 'Microwave Oven', unitCents: 29_000, quantity: 1 },
  ],
  decimal: [
    { name: 'Apple', unitCents: 220, quantity: 2 },
    { name: 'Dragon Fruit', unitCents: 500, quantity: 1 },
  ],
  headphones: [{ name: 'Headphones', unitCents: 20_000, quantity: 1 }],
  microwave: [{ name: 'Microwave Oven', unitCents: 29_000, quantity: 1 }],
  apple: [{ name: 'Apple', unitCents: 220, quantity: 1 }],
  expanded: [
    { name: 'Headphones', unitCents: 20_000, quantity: 2 },
    { name: 'Microwave Oven', unitCents: 29_000, quantity: 1 },
    { name: 'Apple', unitCents: 220, quantity: 1 },
  ],
};

export function basket(name: string): readonly CartItem[] {
  const items = baskets[name];
  if (!items) throw new Error(`Unknown cart data set: ${name}`);
  return items;
}
