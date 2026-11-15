import { pricing, packRate } from './data';

/**
 * Copy for the service pages (/services/<slug>/). Keep every statement true to how the business runs:
 * only Wash & Fold has a published price; everything else is quoted on WhatsApp before pickup.
 */

const QUOTE = 'Priced per item. Tell us what you have and we share the price on WhatsApp before pickup.';
const CONFIRM = 'We confirm the return date when you book.';

export type ServicePage = {
  /** Page title for search results. */
  title: string;
  description: string;
  h1: string;
  lead: string;
  body: string[];
  includes: string[];
  price: string;
  time: string;
  faqs: { q: string; a: string }[];
};

export const servicePages: Record<string, ServicePage> = {
  'wash-fold': {
    title: `Wash and fold laundry in HSR Layout, Bangalore at ₹${pricing.perKg}/kg | dhobermans`,
    description: `Wash, fold and iron at ₹${pricing.perKg} per kg in HSR Layout, Bangalore. Doorstep pickup, back within 24 hours, free delivery within 5 km. Book on WhatsApp.`,
    h1: 'Wash & Fold laundry service',
    lead: `Everyday laundry washed, folded and ironed for ₹${pricing.perKg} per kg, collected from your door and back within 24 hours.`,
    body: [
      'Wash & Fold is our everyday laundry service for clothes, towels and bed linen. We collect your bag from your door, wash it, then fold and iron everything so it comes back ready for the wardrobe.',
      'Your bag is tagged at pickup so every item is tracked, and you pay by weight rather than per piece, which keeps regular laundry simple and predictable.',
    ],
    includes: ['Washing with eco-friendly detergents', 'Folding and ironing, included in the per-kg rate', 'Doorstep pickup and delivery', 'Back within 24 hours of pickup'],
    price: `₹${pricing.perKg} per kg for wash, fold and iron. Monthly packs of ${pricing.packSizes.join(', ')} kg bring the rate down to ₹${packRate} per kg.`,
    time: 'Back at your door within 24 hours of pickup.',
    faqs: [
      { q: 'Is ironing included in Wash & Fold?', a: `Yes. The ₹${pricing.perKg} per kg rate covers washing, folding and ironing.` },
      { q: 'How is Wash & Fold billed?', a: `By weight, at ₹${pricing.perKg} per kg. The booking form shows an estimate for your load size, and a monthly pack lowers the rate to ₹${packRate} per kg.` },
      { q: 'How quickly do I get my clothes back?', a: 'Within 24 hours of pickup.' },
    ],
  },
  'dry-cleaning': {
    title: 'Dry cleaning with pickup and delivery in HSR Layout, Bangalore | dhobermans',
    description: 'Dry cleaning for suits, silks, sarees and delicates in HSR Layout, Bangalore, with doorstep pickup and delivery. Priced per item. Book on WhatsApp.',
    h1: 'Dry cleaning service',
    lead: 'Careful dry cleaning for suits, silks, sarees and other delicates, with doorstep pickup and delivery.',
    body: [
      'Dry cleaning uses a solvent instead of water, which is why it suits fabrics that can shrink, lose their shape or bleed colour in a normal wash. Suits, blazers, silk, wool and embellished pieces are typical examples.',
      'Not sure whether a garment needs it? Check the care label: a circle means the item is meant for professional cleaning. You can also send us a photo of the label and we will tell you.',
    ],
    includes: ['Suits, blazers, silk, wool and occasion wear', 'Advice on what does and does not need dry cleaning', 'Doorstep pickup and delivery', 'Price shared before pickup'],
    price: QUOTE,
    time: `Turnaround depends on the garment. ${CONFIRM}`,
    faqs: [
      { q: 'Which clothes should be dry cleaned?', a: 'Anything labelled dry clean only, and most suits, blazers, silk, wool and embellished garments. A circle on the care label means professional cleaning.' },
      { q: 'How much does dry cleaning cost?', a: 'Dry cleaning is priced per item. Send us what you have on WhatsApp and we share the price before pickup.' },
    ],
  },
  'steam-ironing': {
    title: 'Steam ironing service with pickup in HSR Layout, Bangalore | dhobermans',
    description: 'Steam ironing in HSR Layout, Bangalore: we collect your clean clothes, press them and return them within 24 hours. Free pickup within 5 km. Book on WhatsApp.',
    h1: 'Steam ironing service',
    lead: 'Crisp, steam-pressed clothes without the weekend ironing pile.',
    body: [
      'Send us your clean clothes and we steam iron them and bring them back within 24 hours. It is the simplest way to keep work shirts, trousers, kurtas and school uniforms ready to wear.',
      'If you want your clothes washed as well, choose Wash & Fold instead: ironing is already included in its per-kg rate.',
    ],
    includes: ['Steam pressing for everyday and formal wear', 'Doorstep pickup and delivery', 'Back within 24 hours of pickup'],
    price: QUOTE,
    time: 'Back at your door within 24 hours of pickup.',
    faqs: [
      { q: 'Do I need to wash my clothes before sending them for ironing?', a: 'Yes. Steam ironing is for clean clothes. If you want them washed too, book Wash & Fold, which includes ironing.' },
      { q: 'How quickly is ironing returned?', a: 'Within 24 hours of pickup.' },
    ],
  },
  'comforter-wash': {
    title: 'Comforter, duvet and blanket wash in HSR Layout, Bangalore | dhobermans',
    description: 'Comforter, duvet, quilt and blanket washing in HSR Layout, Bangalore, with doorstep pickup and delivery. Priced per item. Book on WhatsApp.',
    h1: 'Comforter wash',
    lead: 'Comforters, duvets, quilts and blankets washed and dried properly, collected from your door.',
    body: [
      'Bulky bedding is hard to clean at home: it rarely fits a household machine and takes a long time to dry all the way through. We collect it, wash it and dry it thoroughly before it comes back to you.',
      'Tell us the size (single, double or king) and the filling when you book, so we can confirm the right method and the price.',
    ],
    includes: ['Comforters, duvets, quilts and blankets', 'Thorough drying before return', 'Doorstep pickup and delivery', 'Price shared before pickup'],
    price: QUOTE,
    time: CONFIRM,
    faqs: [
      { q: 'How often should a comforter be washed?', a: 'Most bedding care guides suggest a few times a year, and more often if it is used without a cover.' },
      { q: 'How much does a comforter wash cost?', a: 'It depends on the size. Send us the details on WhatsApp and we share the price before pickup.' },
    ],
  },
  'shoe-cleaning': {
    title: 'Shoe and sneaker cleaning with pickup in HSR Layout, Bangalore | dhobermans',
    description: 'Shoe and sneaker cleaning in HSR Layout, Bangalore, with doorstep pickup and delivery. Priced per pair. Book on WhatsApp.',
    h1: 'Shoe cleaning',
    lead: 'Sneakers, sports shoes and everyday footwear cleaned and returned to your door.',
    body: [
      'Shoes need different care from clothes, and the right method depends on the material. Tell us whether your pair is canvas, mesh, leather or suede when you book, and send a photo if you can.',
      'We confirm what is possible for that material, and the price, before we collect.',
    ],
    includes: ['Sneakers, sports shoes and everyday footwear', 'Method confirmed for the material before pickup', 'Doorstep pickup and delivery', 'Price shared before pickup'],
    price: 'Priced per pair. Tell us what you have and we share the price on WhatsApp before pickup.',
    time: CONFIRM,
    faqs: [
      { q: 'Which shoes can you clean?', a: 'Tell us the material (canvas, mesh, leather or suede) and send a photo on WhatsApp. We confirm what is possible before pickup.' },
      { q: 'How much does shoe cleaning cost?', a: 'It is priced per pair. We share the price on WhatsApp before pickup.' },
    ],
  },
  'curtain-cleaning': {
    title: 'Curtain cleaning with pickup and delivery in HSR Layout, Bangalore | dhobermans',
    description: 'Curtain and drape cleaning in HSR Layout, Bangalore, with doorstep pickup and delivery. Priced per item. Book on WhatsApp.',
    h1: 'Curtain cleaning',
    lead: 'Curtains and drapes cleaned and returned, without the struggle of washing them at home.',
    body: [
      'Curtains quietly collect dust and cooking smells, and their size and weight make them awkward to wash and dry at home. Take them down, and we collect, clean and return them.',
      'Lined, blackout and delicate curtains need different handling. Send us a photo of the care label and the approximate size, and we confirm the method and the price before pickup.',
    ],
    includes: ['Sheer, cotton, lined and blackout curtains', 'Method confirmed from the care label', 'Doorstep pickup and delivery', 'Price shared before pickup'],
    price: QUOTE,
    time: CONFIRM,
    faqs: [
      { q: 'Do you take the curtains down and hang them again?', a: 'Please have the curtains taken down and ready at the door. We collect, clean and deliver them.' },
      { q: 'How much does curtain cleaning cost?', a: 'It depends on the size and fabric. Send us the details on WhatsApp and we share the price before pickup.' },
    ],
  },
  'express-service': {
    title: 'Express laundry service in HSR Layout, Bangalore | dhobermans',
    description: 'Need laundry back sooner than 24 hours in HSR Layout, Bangalore? Tell us your deadline on WhatsApp and we confirm what is possible before pickup.',
    h1: 'Express laundry service',
    lead: 'For the days when 24 hours is not fast enough.',
    body: [
      'Our standard turnaround for Wash & Fold and Steam Ironing is already 24 hours. If you need something sooner, for a trip, an interview or an event, tell us your deadline when you book.',
      'We confirm before pickup whether we can meet it and whether an express charge applies, so there are no surprises.',
    ],
    includes: ['Faster return, subject to confirmation', 'Deadline agreed before pickup', 'Doorstep pickup and delivery'],
    price: 'Depends on the service and the deadline. We confirm any express charge on WhatsApp before pickup.',
    time: 'Agreed with you before pickup.',
    faqs: [
      { q: 'How fast is the express service?', a: 'It depends on the items and the day. Tell us your deadline on WhatsApp and we confirm before pickup whether we can meet it.' },
      { q: 'What is the standard turnaround?', a: 'Wash & Fold and Steam Ironing come back within 24 hours of pickup.' },
    ],
  },
  'stain-removal': {
    title: 'Stain removal service in HSR Layout, Bangalore | dhobermans',
    description: 'Stain treatment for turmeric, oil, ink, tea and more in HSR Layout, Bangalore, with doorstep pickup and delivery. Send a photo on WhatsApp for advice.',
    h1: 'Stain removal',
    lead: 'Turmeric, oil, ink or tea: send us a photo and we tell you honestly what we can do.',
    body: [
      'Stains respond best when they are treated early and have not been through a hot wash or a dryer, because heat can set them. Tell us what caused the stain and how old it is, and send a photo when you book.',
      'No cleaner can promise that every stain will come out completely, especially old ones. We tell you what to expect before we start.',
    ],
    includes: ['Assessment from a photo before pickup', 'Treatment matched to the stain and the fabric', 'Doorstep pickup and delivery', 'Price shared before pickup'],
    price: QUOTE,
    time: CONFIRM,
    faqs: [
      { q: 'Can every stain be removed?', a: 'No. Fresh stains respond best. Old stains and stains that have been through a hot wash or dryer are harder, and some will only fade. We tell you what to expect first.' },
      { q: 'What should I do right after a spill?', a: 'Blot, do not rub, rinse from the back of the fabric with cold water, and avoid heat. Our stain removal guide has step-by-step first aid for common stains.' },
    ],
  },
};

/** Neighbourhoods whose centres lie within about 5 km of HSR Layout Sector 1 in a straight line. */
export const nearbyAreas = ['HSR Layout (all sectors)', 'Agara', 'Koramangala', 'BTM Layout', 'Bommanahalli', 'Kudlu', 'Haralur Road', 'Bellandur'];

export const faqSchema = (items: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
