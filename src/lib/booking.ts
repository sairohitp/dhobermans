import { pricing, packPrice, packRate, tierRate } from '../data';
import { rupees } from './store';
import { mapsLink, type Pin } from './geo';

export type Intent = 'pickup' | 'service' | 'plan' | 'stain' | 'location' | 'question' | 'order' | 'business';
export type Repeat = 'once' | 'weekly' | 'biweekly';

export type FlowData = {
  intent: Intent;
  services?: string[];
  slot?: string;
  plan?: string;
  loadKg?: number | null;
  repeat?: Repeat;
  prefs?: string[];
  pincode?: string;
  address?: string;
  pin?: Pin | null;
  distanceKm?: number | null;
  name?: string;
  notes?: string;
  question?: string;
  location?: string;
  items?: string[];
  total?: string;
  business?: { name: string; type: string; volume: string; frequency: string; area: string };
};

/** The service that is billed by weight. */
export const BY_WEIGHT = 'Wash & Fold';
/** Services covered by the 24-hour turnaround. */
export const DAILY_SERVICES = ['Wash & Fold', 'Steam Ironing'];
/** Load-size choices in the booking flow (kg). The last one means "or more". */
export const LOAD_SIZES = [3, 5, 8, 10];
export const LOAD_MAX = LOAD_SIZES[LOAD_SIZES.length - 1];

const minBusinessRate = tierRate(pricing.businessTiers[pricing.businessTiers.length - 1].discount);

/** Plan choices offered when booking, all derived from the per-kg base rate. */
export const planOptions = [
  { value: 'payg', label: `Pay per pickup · ${rupees(pricing.perKg)}/kg` },
  ...pricing.packSizes.map((kg) => ({
    value: `monthly-${kg}`,
    label: `Monthly pack · ${kg} kg · ${rupees(packPrice(kg))}/month`,
  })),
];

export const isPack = (plan?: string) => !!plan && plan.startsWith('monthly-');
export const rateFor = (plan?: string) => (isPack(plan) ? packRate : pricing.perKg);

export const planLabel = (value?: string) => {
  if (!value) return '';
  if (isPack(value)) {
    const kg = Number(value.split('-')[1]);
    return `Monthly pack, ${kg} kg (${rupees(packPrice(kg))}/month, ${rupees(packRate)}/kg)`;
  }
  if (value === 'business') return `Business volume rate (from ${rupees(minBusinessRate)}/kg)`;
  if (value === 'payg') return `Pay per pickup (${rupees(pricing.perKg)}/kg)`;
  return value;
};

/** Price estimate for a by-weight load. */
export const estimate = (kg: number | null | undefined, plan?: string) => {
  if (!kg) return null;
  const plus = kg >= LOAD_MAX;
  return {
    kgLabel: plus ? `${LOAD_MAX} kg or more` : `about ${kg} kg`,
    priceLabel: `${plus ? 'from' : 'about'} ${rupees(kg * rateFor(plan))}`,
    rate: rateFor(plan),
  };
};

export const repeatLabel = (r?: Repeat) => (r === 'weekly' ? 'every week' : r === 'biweekly' ? 'every 2 weeks' : '');

const line = (label: string, value?: string | null) => (value && value.trim() ? `${label}: ${value.trim()}` : '');

const locationLines = (d: FlowData) =>
  d.pin
    ? [
        `Location pin: ${mapsLink(d.pin)}`,
        d.distanceKm != null ? `Distance: about ${d.distanceKm.toFixed(1)} km from dhobermans` : '',
      ]
    : [];

const loadLine = (d: FlowData) => {
  if (!(d.services ?? []).includes(BY_WEIGHT)) return '';
  const e = estimate(d.loadKg, d.plan);
  if (!e) return '';
  return isPack(d.plan) ? `Estimated load: ${e.kgLabel}` : `Estimated load: ${e.kgLabel} (${e.priceLabel} at ${rupees(e.rate)}/kg)`;
};

/** The WhatsApp message for any booking intent. */
export const compose = (d: FlowData): string => {
  let lines: string[];
  switch (d.intent) {
    case 'question':
      lines = ['Hi dhobermans, I have a question:', (d.question ?? '').trim(), line('Name', d.name)];
      break;
    case 'location':
      lines = [
        `Hi dhobermans, please let me know when the ${d.location ?? 'self-service'} spot opens.`,
        line('Name', d.name),
        line('Pincode', d.pincode),
      ];
      break;
    case 'business': {
      const b = d.business;
      lines = [
        "Hi dhobermans, I'd like a business quote.",
        line('Business', b ? `${b.name}${b.type ? ` (${b.type})` : ''}` : ''),
        line('Laundry per month', b?.volume),
        line('Pickups', b?.frequency),
        line('Contact', d.name),
        line('Area', b?.area),
        line('Notes', d.notes),
      ];
      break;
    }
    case 'order':
      lines = [
        "Hi dhobermans, I'd like to order:",
        ...(d.items ?? []),
        line('Total', d.total),
        line('Name', d.name),
        line('Delivery address', d.address),
        line('Pincode', d.pincode),
        ...locationLines(d),
        line('Notes', d.notes),
      ];
      break;
    default:
      lines = [
        "Hi dhobermans, I'd like to schedule a pickup.",
        line('Services', (d.services ?? []).join(', ')),
        loadLine(d),
        line('Plan', planLabel(d.plan)),
        line('Pickup slot', d.slot),
        line('Repeat', repeatLabel(d.repeat)),
        line('Preferences', (d.prefs ?? []).join(', ')),
        line('Name', d.name),
        line('Address', d.address),
        line('Pincode', d.pincode),
        ...locationLines(d),
        line('Notes', d.notes),
      ];
  }
  return lines.filter(Boolean).join('\n');
};

export const waLink = (whatsapp: string, text: string) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
