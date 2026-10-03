export interface Product { name: string; category: string; unitCents: number }

export const catalogue: readonly Product[] = [
  { name: 'Laptop', category: 'electronics', unitCents: 100000 },
  { name: 'Mobile', category: 'electronics', unitCents: 150000 },
  { name: 'Headphones', category: 'electronics', unitCents: 20000 },
  { name: 'Microwave Oven', category: 'electronics', unitCents: 29000 },
  { name: 'Refrigerator', category: 'electronics', unitCents: 88800 },
  { name: 'Smartwatch', category: 'electronics', unitCents: 49900 },
  { name: 'Mango', category: 'Fruits', unitCents: 100 },
  { name: 'Apple', category: 'Fruits', unitCents: 220 },
  { name: 'Dragon Fruit', category: 'Fruits', unitCents: 500 },
  { name: 'Cauliflower', category: 'Vegitables', unitCents: 80 },
  { name: 'Eggplant', category: 'Vegitables', unitCents: 50 },
  { name: 'Treadmill', category: 'Sports & Fitness', unitCents: 89900 },
  { name: 'Football', category: 'Sports & Fitness', unitCents: 9999 },
  { name: 'Dumbbell', category: 'Sports & Fitness', unitCents: 48900 },
  { name: 'Bat', category: 'Sports & Fitness', unitCents: 64900 },
];

export const categoryOptions = ['All Categories', 'electronics', 'Fruits', 'Vegitables', 'Sports & Fitness'];
export const priceOptions = ['All Prices', 'Under $25', '$25 to $50', '$50 to $100', '$100 to $500', 'Over $500'];
