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

export const benefits = [
  {
    icon: 'truck',
    title: 'Pickup & Delivery',
    body: 'We come to you. Schedule a time, and our team handles the rest, door to door.',
  },
  {
    icon: 'clock',
    title: '48-Hour Turnaround',
    body: 'Your clothes returned fresh and folded within two days. Express options available.',
  },
  {
    icon: 'leaf',
    title: 'Eco-Friendly Care',
    body: 'Gentle, sustainable detergents that are kind to your clothes and the planet.',
  },
];

export const steps = [
  {
    title: 'Schedule a pickup in seconds',
    body: 'Choose a pickup slot that suits you and tell us what needs care.',
    screen: { icon: 'calendar', heading: 'Book a slot', rows: ['Today · 6–8 PM', 'Tomorrow · 9–11 AM', 'Tomorrow · 6–8 PM'], cta: 'Confirm slot' },
  },
  {
    title: 'We pick it up from your door',
    body: 'A dhobermans rider collects your bag and tags it, so every item is tracked.',
    screen: { icon: 'truck', heading: 'Pickup en route', rows: ['Rider assigned', 'ETA · 12 mins', 'Bag tagged · #DH204'], cta: 'Track live' },
  },
  {
    title: 'Washed, folded, delivered fresh',
    body: 'Your clothes come back clean, folded and ready to wear, within 48 hours.',
    screen: { icon: 'check-circle', heading: 'Order ready', rows: ['Wash · Done', 'Fold · Done', 'Out for delivery'], cta: 'View order' },
  },
];

export const plans = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Perfect for individuals',
    price: '₹299',
    features: ['Up to 5 kg/week', '48-hour turnaround', 'Free pickup & delivery', 'Eco-friendly wash'],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Best for families',
    price: '₹599',
    featured: true,
    features: ['Up to 15 kg/week', '24-hour express turnaround', 'Free pickup & delivery', 'Premium detergents', 'Ironing included'],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For offices & hostels',
    price: '₹1,499',
    features: ['Unlimited loads', 'Same-day turnaround', 'Dedicated account manager', 'Bulk pricing', 'Invoice billing'],
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
  { slug: 'cloud-wash-detergent', category: 'Detergent', size: '1L', name: 'Cloud Wash Detergent', short: 'Plant-based, gentle on fabrics.', body: 'Ultra-gentle liquid detergent with plant-based surfactants. Removes stains without harsh chemicals.', price: '₹349', featured: true },
  { slug: 'fresh-breeze-detergent', category: 'Detergent', size: '1 kg', name: 'Fresh Breeze Detergent', body: 'Concentrated powder formula for everyday loads. Works brilliantly in cold water.', price: '₹299' },
  { slug: 'silk-touch-comforter-wash', category: 'Comforters', size: '750 mL', name: 'Silk Touch Comforter Wash', short: 'For duvets & heavy bedding.', body: 'Specially formulated for duvets, comforters, and heavy bedding. Keeps fill fluffy and fresh.', price: '₹499', featured: true },
  { slug: 'lavender-dream-diffuser', category: 'Diffusers', size: '200 mL', name: 'Lavender Dream Diffuser', short: 'Calming scent, lasts 60 days.', body: 'Reed diffuser that fills your wardrobe with calming lavender. Lasts up to 60 days.', price: '₹599', featured: true },
  { slug: 'ocean-mist-diffuser', category: 'Diffusers', size: '200 mL', name: 'Ocean Mist Diffuser', body: 'Crisp, aquatic scent for living spaces. Natural essential oils, no artificial aerosols.', price: '₹599' },
  { slug: 'linen-spray-cotton-fields', category: 'Fragrances', size: '100 mL', name: 'Linen Spray: Cotton Fields', short: 'Quick spritz freshness.', body: 'A quick spritz to keep clothes smelling fresh between washes. Light, airy cotton scent.', price: '₹249', featured: true },
  { slug: 'wardrobe-sachet-set', category: 'Fragrances', size: '4 pack', name: 'Wardrobe Sachet Set', body: 'Set of 4 aromatic sachets for drawers and closets. Cedar, lavender, rose, and jasmine.', price: '₹199' },
  { slug: 'fabric-softener-petal-soft', category: 'Detergent', size: '1L', name: 'Fabric Softener: Petal Soft', body: 'Concentrated softener that leaves clothes silky. Subtle floral fragrance that lasts all day.', price: '₹279' },
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
    a: "Tap any 'Book on WhatsApp' button, or use the pickup planner to choose your services and slot. Your request opens in WhatsApp, we confirm, and we'll be at your door.",
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
    q: 'Do you handle dry cleaning?',
    a: 'Absolutely. Our Premium and Business plans include dry cleaning for delicates and formal wear.',
  },
  {
    q: 'What areas do you service?',
    a: 'We currently operate across Bangalore and deliver city-wide. Self-service locations are planned in the neighbourhoods shown on our map.',
  },
];

/** Pickup windows (IST). startHour/endHour are 24h clock. */
export const slots = [
  { label: '9–11 AM', startHour: 9, endHour: 11 },
  { label: '6–8 PM', startHour: 18, endHour: 20 },
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
