// Care symbols per the international care-labelling standard (ISO 3758 / GINETEX), drawn on a 48px grid.
const TUB = '<path d="M6 15 10 38h28l4-23"/>';
const WAVE = '<path d="M8 21q4-5 8 0t8 0 8 0 8 0"/>';
const CROSS = '<path d="M5 5 43 43M43 5 5 43"/>';
const TRIANGLE = '<path d="M24 7 43 40H5Z"/>';
const SQUARE = '<rect x="6" y="6" width="36" height="36" rx="1.5"/>';
const DRUM = '<circle cx="24" cy="24" r="13"/>';
const IRON = '<path d="M5 37h38c-1-9-7-15-15-15H9Z"/><path d="M9 22v-7h20"/>';
const CIRCLE = '<circle cx="24" cy="24" r="17"/>';
const dot = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="2.3" fill="currentColor" stroke="none"/>`;
const text = (t: string, y: number, size: number) =>
  `<text x="24" y="${y}" text-anchor="middle" font-size="${size}" font-weight="700" fill="currentColor" stroke="none">${t}</text>`;

export const careGroups = [
  {
    name: 'Washing',
    symbols: [
      { id: 'w30', title: 'Machine wash, 30°C', svg: TUB + WAVE + text('30', 34.5, 11), text: 'The number is the highest water temperature in °C. 30 means a cool wash.' },
      { id: 'gentle', title: 'Gentle cycle', svg: TUB + WAVE + '<path d="M11 44h26"/>', text: 'A bar under the tub means a mild cycle with less spin. Two bars mean a very mild cycle, used for wool and silk.' },
      { id: 'hand', title: 'Hand wash', svg: TUB + '<path d="M18 23v-9M22 23V9M26 23V10M30 24v-8M18 23v3a6 6 0 0 0 12 0v-2M18 26l-4-4"/>', text: 'Wash by hand in water no warmer than 40°C, and handle gently.' },
      { id: 'nowash', title: 'Do not wash', svg: TUB + WAVE + CROSS, text: 'Do not wash in water. These items usually need dry cleaning.' },
    ],
  },
  {
    name: 'Bleaching',
    symbols: [
      { id: 'bleach', title: 'Any bleach', svg: TRIANGLE, text: 'Any bleach may be used when needed.' },
      { id: 'oxy', title: 'Oxygen bleach only', svg: TRIANGLE + '<path d="M14 40 28.5 14.8M23 40l10-17.4"/>', text: 'Use only non-chlorine (oxygen) bleach.' },
      { id: 'nobleach', title: 'Do not bleach', svg: TRIANGLE + CROSS, text: 'Do not use any bleach.' },
    ],
  },
  {
    name: 'Drying',
    symbols: [
      { id: 'tumble', title: 'Tumble dry, low heat', svg: SQUARE + DRUM + dot(24, 24), text: 'One dot means low heat (up to 60°C). Two dots mean normal heat (up to 80°C).' },
      { id: 'notumble', title: 'Do not tumble dry', svg: SQUARE + DRUM + CROSS, text: 'Keep out of the dryer. Air-dry instead.' },
      { id: 'line', title: 'Line dry', svg: SQUARE + '<path d="M24 13v22"/>', text: 'Hang on a line to dry.' },
      { id: 'flat', title: 'Dry flat', svg: SQUARE + '<path d="M13 24h22"/>', text: 'Lay flat to dry, so the garment keeps its shape.' },
    ],
  },
  {
    name: 'Ironing',
    symbols: [
      { id: 'iron', title: 'Iron, medium heat', svg: IRON + dot(19, 30.5) + dot(27, 30.5), text: 'Dots show the heat: one for low (up to 110°C), two for medium (up to 150°C), three for high (up to 200°C).' },
      { id: 'noiron', title: 'Do not iron', svg: IRON + CROSS, text: 'Do not iron or press.' },
    ],
  },
  {
    name: 'Professional care',
    symbols: [
      { id: 'dryp', title: 'Dry clean (P)', svg: CIRCLE + text('P', 30, 17), text: 'Professional dry cleaning with the usual solvents, including perchloroethylene.' },
      { id: 'dryf', title: 'Dry clean (F)', svg: CIRCLE + text('F', 30, 17), text: 'Professional dry cleaning with hydrocarbon solvents only: a gentler process.' },
      { id: 'wet', title: 'Professional wet clean (W)', svg: CIRCLE + text('W', 30, 16), text: 'Professional wet cleaning: a water-based process done by a cleaner.' },
      { id: 'nodry', title: 'Do not dry clean', svg: CIRCLE + CROSS, text: 'Do not dry clean.' },
    ],
  },
];

export const careSvgAttrs =
  'viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
