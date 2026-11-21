// Line-art icon paths in a 100x100 box. PLACEHOLDERS: swap for generated line-art stills later.
export type IconKey =
  | 'nursery' | 'inputs' | 'machine' | 'estate' | 'harvest' | 'thresh' | 'ffb'
  | 'mill' | 'cpo' | 'nut' | 'crack' | 'biomass' | 'cake';

export const ring = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy}`;

const spokes = (cx: number, cy: number, r1: number, r2: number, n: number) =>
  Array.from({length: n}, (_, i) => {
    const a = (Math.PI * 2 * i) / n;
    const p = (r: number) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
    return `M${p(r1)} L${p(r2)}`;
  });

export const ICONS: Record<IconKey, string[]> = {
  nursery: ['M50 80 V46', 'M50 58 C30 58 20 44 22 30 C40 30 50 42 50 58', 'M50 48 C50 32 62 22 78 24 C80 40 66 50 50 48', 'M32 80 H68 L63 96 H37 Z'],
  inputs: ['M28 34 Q50 24 72 34 L76 92 H24 Z', 'M36 34 L40 20 H60 L64 34', 'M38 58 H62', 'M38 72 H62'],
  machine: [ring(50, 50, 10), ring(50, 50, 24), ...spokes(50, 50, 24, 36, 8)],
  estate: ['M26 22 H74 V94 H26 Z', 'M40 14 H60 V28 H40 Z', 'M36 48 L42 54 L52 42', 'M58 48 H66', 'M36 70 L42 76 L52 64', 'M58 70 H66'],
  harvest: ['M26 94 L66 24', 'M66 24 C86 22 92 38 84 50 C80 40 74 32 66 24', 'M58 42 C46 38 38 48 42 60'],
  thresh: ['M50 18 C26 26 22 62 50 90 C78 62 74 26 50 18Z', ring(42, 44, 4), ring(58, 44, 4), ring(50, 58, 4), ring(40, 66, 4), ring(60, 66, 4), 'M50 8 V18'],
  ffb: ['M8 72 V36 H56 V72', 'M56 50 H76 L92 64 V72 H56', ring(26, 76, 8), ring(74, 76, 8), 'M8 72 H18 M34 72 H66 M82 72 H92'],
  mill: ['M12 92 V48 L38 32 V48 L62 32 V48 H88 V92 Z', 'M72 48 V14 H84 V48', 'M40 92 V72 H56 V92'],
  cpo: ['M30 24 H70 V88 H30 Z', 'M30 40 H70', 'M30 72 H70', 'M30 24 C30 16 70 16 70 24', 'M44 8 V16'],
  nut: ['M50 20 C76 20 84 50 72 74 C64 90 36 90 28 74 C16 50 24 20 50 20Z', 'M50 30 C42 50 42 64 50 80', 'M50 8 V20'],
  crack: ['M16 52 C16 32 34 22 46 28 L40 48 L52 60 L42 84 C26 84 16 70 16 52Z', 'M84 52 C84 32 70 26 58 32 L64 50 L54 64 L62 84 C76 82 84 70 84 52Z'],
  biomass: ['M50 8 C60 22 66 30 60 44 C56 38 54 36 50 32 C46 40 40 44 42 52 C32 44 36 24 50 8Z', 'M18 94 H82', 'M26 80 H74', 'M34 66 H66'],
  cake: ['M16 38 L50 22 L84 38 L50 54Z', 'M16 38 V68 L50 84 V54', 'M84 38 V68 L50 84'],
};

// Oil palm for the hook, 200 x 260 box.
export const PALM: string[] = [
  'M100 250 C96 200 108 150 100 92',
  'M100 92 C70 60 40 60 12 84',
  'M100 92 C80 50 50 30 20 36',
  'M100 92 C100 50 96 30 92 8',
  'M100 92 C120 50 150 30 180 36',
  'M100 92 C130 60 160 60 188 84',
  'M100 92 C80 82 60 96 40 124',
  'M100 92 C120 82 140 96 160 124',
  ring(94, 104, 6), ring(108, 108, 6), ring(100, 118, 6),
  'M70 250 H130',
];
