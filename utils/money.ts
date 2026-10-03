export const dollars = (cents: number): string => `$${(cents / 100).toFixed(2)}`;

export function cartTotal(items: readonly { unitCents: number; quantity: number }[]): number {
  return items.reduce((total, item) => total + item.unitCents * item.quantity, 0);
}
