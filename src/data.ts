import washFold from './assets/service-wash-fold.jpg';
import dryClean from './assets/service-dry-clean.jpg';
import ironing from './assets/service-ironing.jpg';
import comforter from './assets/service-comforter.jpg';
import shoes from './assets/service-shoes.jpg';
import curtains from './assets/service-curtains.jpg';
import express from './assets/service-express.jpg';
import stain from './assets/service-stain.jpg';

export const services = [
  { slug: 'wash-fold', name: 'Wash & Fold', image: washFold },
  { slug: 'dry-cleaning', name: 'Dry Cleaning', image: dryClean },
  { slug: 'steam-ironing', name: 'Steam Ironing', image: ironing },
  { slug: 'comforter-wash', name: 'Comforter Wash', image: comforter },
  { slug: 'shoe-cleaning', name: 'Shoe Cleaning', image: shoes },
  { slug: 'curtain-cleaning', name: 'Curtain Cleaning', image: curtains },
  { slug: 'express-service', name: 'Express Service', image: express },
  { slug: 'stain-removal', name: 'Stain Removal', image: stain },
];

export const steps = [
  {
    title: 'Pick a slot',
    body: 'Choose what needs care and a pickup time that suits you.',
    screen: { icon: 'calendar', heading: 'Book a slot', rows: ['Today · 6–8 PM', 'Tomorrow · 9–11 AM', 'Tomorrow · 6–8 PM'], cta: 'Confirm slot' },
  },
  {
    title: 'We collect',
    body: 'A rider picks up your bag and tags it, so every item is tracked.',
    screen: { icon: 'truck', heading: 'Pickup en route', rows: ['Rider assigned', 'ETA · 12 mins', 'Bag tagged · #DH204'], cta: 'Track live' },
  },
  {
    title: 'Delivered fresh',
    body: 'Washed, folded and ironed, back at your door within 24 hours.',
    screen: { icon: 'check-circle', heading: 'Order ready', rows: ['Wash · Done', 'Fold · Done', 'Out for delivery'], cta: 'View order' },
  },
];

/** Pricing: everything stems from the per-kg base rate for wash, fold and iron. */
export const pricing = {
  perKg: 100,
  packDiscount: 0.1,
  packSizes: [20, 40, 60],
  defaultPack: 40,
  /** Business volume tiers (monthly kg). Proposed: confirm before launch. */
  businessTiers: [
    { minKg: 100, maxKg: 249, discount: 0.15 },
    { minKg: 250, maxKg: null as number | null, discount: 0.2 },
  ],
};
export const packRate = Math.round(pricing.perKg * (1 - pricing.packDiscount)); // 90
export const packPrice = (kg: number) => Math.round(kg * pricing.perKg * (1 - pricing.packDiscount));
export const fullPrice = (kg: number) => kg * pricing.perKg;
export const tierRate = (discount: number) => Math.round(pricing.perKg * (1 - discount));
/** Business rate for a monthly volume, or null below the first tier. */
export const businessRate = (kg: number) => {
  const tier = [...pricing.businessTiers].reverse().find((t) => kg >= t.minKg);
  return tier ? tierRate(tier.discount) : null;
};

export const plans = [
  {
    id: 'payg',
    name: 'Pay per pickup',
    tagline: 'Wash, fold & iron, billed by weight',
    rate: pricing.perKg,
    features: ['Wash, fold & iron included', '24-hour turnaround', 'Free pickup & delivery within 5 km', 'Eco-friendly detergents'],
    cta: 'Book a pickup',
  },
  {
    id: 'monthly',
    name: 'Monthly pack',
    tagline: 'Save 10% on every kg',
    rate: packRate,
    featured: true,
    features: ['10% off the per-kg rate', 'Wash, fold & iron included', '24-hour turnaround', 'Free pickup & delivery within 5 km'],
    cta: 'Choose this pack',
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Offices, hostels, PGs & short-stay hosts',
    rate: tierRate(pricing.businessTiers[pricing.businessTiers.length - 1].discount),
    from: true,
    features: ['Scheduled pickup days', 'Dedicated account manager', 'Monthly invoice', 'Free pickup & delivery within 5 km'],
    cta: 'Get a business quote',
  },
];

/** Planned self-service spots. x/y are positions (%) on the illustrative map. */
export const locations = [
  { name: 'Koramangala Hub', address: '4th Block, Koramangala', x: 41, y: 56 },
  { name: 'Indiranagar Point', address: '100 Feet Road, Indiranagar', x: 47, y: 30 },
  { name: 'HSR Layout Center', address: 'Sector 2, HSR Layout', x: 53, y: 79 },
  { name: 'Whitefield Station', address: 'Main Road, Whitefield', x: 78, y: 32 },
  { name: 'JP Nagar Spot', address: '15th Cross, JP Nagar', x: 18, y: 84 },
];

export const productCategories = ['Detergent', 'Comforters', 'Diffusers', 'Fragrances'] as const;

export const products = [
  { slug: 'cloud-wash-detergent', category: 'Detergent', size: '1L', name: 'Cloud Wash Detergent', short: 'Plant-based, gentle on fabrics.', body: 'Ultra-gentle liquid detergent with plant-based surfactants. Removes stains without harsh chemicals.', price: '₹349', amount: 349, featured: true },
  { slug: 'fresh-breeze-detergent', category: 'Detergent', size: '1 kg', name: 'Fresh Breeze Detergent', body: 'Concentrated powder formula for everyday loads. Works brilliantly in cold water.', price: '₹299', amount: 299 },
  { slug: 'silk-touch-comforter-wash', category: 'Comforters', size: '750 mL', name: 'Silk Touch Comforter Wash', short: 'For duvets & heavy bedding.', body: 'Specially formulated for duvets, comforters, and heavy bedding. Keeps fill fluffy and fresh.', price: '₹499', amount: 499, featured: true },
  { slug: 'lavender-dream-diffuser', category: 'Diffusers', size: '200 mL', name: 'Lavender Dream Diffuser', short: 'Calming scent, lasts 60 days.', body: 'Reed diffuser that fills your wardrobe with calming lavender. Lasts up to 60 days.', price: '₹599', amount: 599, featured: true },
  { slug: 'ocean-mist-diffuser', category: 'Diffusers', size: '200 mL', name: 'Ocean Mist Diffuser', body: 'Crisp, aquatic scent for living spaces. Natural essential oils, no artificial aerosols.', price: '₹599', amount: 599 },
  { slug: 'linen-spray-cotton-fields', category: 'Fragrances', size: '100 mL', name: 'Linen Spray: Cotton Fields', short: 'Quick spritz freshness.', body: 'A quick spritz to keep clothes smelling fresh between washes. Light, airy cotton scent.', price: '₹249', amount: 249, featured: true },
  { slug: 'wardrobe-sachet-set', category: 'Fragrances', size: '4 pack', name: 'Wardrobe Sachet Set', body: 'Set of 4 aromatic sachets for drawers and closets. Cedar, lavender, rose, and jasmine.', price: '₹199', amount: 199 },
  { slug: 'fabric-softener-petal-soft', category: 'Detergent', size: '1L', name: 'Fabric Softener: Petal Soft', body: 'Concentrated softener that leaves clothes silky. Subtle floral fragrance that lasts all day.', price: '₹279', amount: 279 },
];

export const categoryIcon: Record<string, string> = {
  Detergent: 'droplet',
  Comforters: 'bed',
  Diffusers: 'flask',
  Fragrances: 'wind',
};

export const faqs = [
  {
    q: 'How do I schedule a pickup?',
    a: "Tap any 'Book a pickup' button, choose your services and slot, and check the message preview. It opens in WhatsApp, we confirm, and we'll be at your door.",
  },
  {
    q: 'What detergents do you use?',
    a: "We use our own dhobermans' care line: eco-friendly, gentle on fabrics, and free from harsh chemicals.",
  },
  {
    q: 'Can I track my laundry?',
    a: "Yes. You'll receive real-time updates via SMS from pickup to delivery.",
  },
  {
    q: 'What if my clothes are damaged?',
    a: "We have a comprehensive care guarantee. Any damage is fully covered and we'll compensate or replace the item.",
  },
  {
    q: 'How much does it cost?',
    a: '₹100 per kg for wash, fold and iron. Take a monthly pack and save 10% (₹90 per kg). Businesses sending 100 kg or more a month get volume rates from ₹80 per kg.',
  },
  {
    q: 'How long does it take?',
    a: 'Your clothes come back washed, folded and ironed within 24 hours of pickup.',
  },
  {
    q: 'Do you handle dry cleaning?',
    a: 'Absolutely. Dry cleaning for delicates and formal wear is priced per item. Send us a message and we will share the price.',
  },
  {
    q: 'What areas do you service?',
    a: 'We are based in HSR Layout, Sector 1. Pickup and delivery are free within 5 km of us. Further away? Message us and we will confirm the delivery charge.',
  },
];

/** Pickup windows (IST). startHour/endHour are 24h clock. */
export const slots = [
  { name: 'Morning', label: '9–11 AM', startHour: 9, endHour: 11 },
  { name: 'Evening', label: '6–8 PM', startHour: 18, endHour: 20 },
];

/**
 * Plan finder. Typical dry weights per item, rounded from published laundry weight guides
 * (T-shirt 150–250 g, jeans 600–900 g, bath towel 400–600 g, double sheet 700–900 g).
 */
export const finderItems = [
  { id: 'tops', label: 'T-shirts, shirts & tops', kg: 0.2, hint: '~200 g each' },
  { id: 'bottoms', label: 'Trousers & jeans', kg: 0.65, hint: '~650 g each' },
  { id: 'towels', label: 'Bath towels', kg: 0.5, hint: '~500 g each' },
  { id: 'sheets', label: 'Bedsheets', kg: 0.8, hint: '~800 g each' },
  { id: 'small', label: 'Innerwear & socks', kg: 0.06, hint: '~60 g each' },
];

export const finderPresets = [
  { id: 'solo', label: 'Just me', counts: { tops: 5, bottoms: 3, towels: 1, sheets: 1, small: 5 } },
  { id: 'couple', label: 'Couple', counts: { tops: 10, bottoms: 5, towels: 2, sheets: 1, small: 10 } },
  { id: 'family', label: 'Family of 4', counts: { tops: 18, bottoms: 9, towels: 4, sheets: 2, small: 18 } },
];

/** Stain first aid. Conservative, widely accepted home-care guidance. */
export const stains = [
  {
    id: 'turmeric',
    name: 'Turmeric & curry',
    steps: [
      'Scrape off any excess with a spoon. Do not rub it in.',
      'Rinse from the back of the fabric under cold running water. Hot water can set the stain.',
      'Gently work in a little liquid detergent, leave it for 10 minutes, then rinse.',
      "For whites and colourfast fabrics, dry in direct sunlight: it helps fade turmeric's yellow tint.",
    ],
  },
  {
    id: 'tea',
    name: 'Tea & coffee',
    steps: [
      'Blot with a clean cloth as soon as possible.',
      'Rinse from the back of the fabric under cold running water.',
      'Gently work in a drop of liquid detergent, wait 5 minutes, then rinse.',
      'Repeat if needed, then wash as usual.',
    ],
  },
  {
    id: 'oil',
    name: 'Oil & ghee',
    steps: [
      'Blot excess oil with a paper towel.',
      'Cover with talcum powder or cornflour and leave for 15 to 30 minutes to absorb the oil.',
      'Brush the powder off, then work in a little dishwashing liquid.',
      'Rinse with the warmest water the care label allows.',
    ],
  },
  {
    id: 'ink',
    name: 'Ink',
    steps: [
      'Place a paper towel under the stain.',
      'Dab, do not rub, with rubbing alcohol or an alcohol-based hand sanitiser on a cotton ball.',
      'Keep dabbing with a clean part of the cotton as the ink lifts.',
      'Rinse well, then wash as usual.',
    ],
  },
  {
    id: 'mud',
    name: 'Mud',
    steps: [
      'Let the mud dry completely.',
      'Brush off as much as you can.',
      'Pre-treat with liquid detergent for 10 minutes.',
      'Wash as usual.',
    ],
  },
  {
    id: 'makeup',
    name: 'Lipstick & makeup',
    steps: [
      'Scrape off the excess with a blunt edge.',
      'Dab with a little dishwashing liquid or micellar water.',
      'Work from the outside of the stain inwards so it does not spread.',
      'Rinse, then wash as usual.',
    ],
  },
];
