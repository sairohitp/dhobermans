import { plans, pricing, packPrice, packRate } from '../data';
import { rupees } from './store';

export type Intent = 'pickup' | 'service' | 'plan' | 'stain' | 'location' | 'question' | 'order';

export type FlowData = {
  intent: Intent;
  services?: string[];
  slot?: string;
  plan?: string;
  pincode?: string;
  address?: string;
  name?: string;
  notes?: string;
  question?: string;
  location?: string;
  items?: string[];
  total?: string;
};

/** Plan choices offered in booking forms, all derived from the per-kg base rate. */
export const planOptions = [
  { value: 'payg', label: `Pay per pickup · ${rupees(pricing.perKg)}/kg` },
  ...pricing.packSizes.map((kg) => ({
    value: `monthly-${kg}`,
    label: `Monthly pack · ${kg} kg · ${rupees(packPrice(kg))}/month`,
  })),
  { value: 'business', label: `Business · from ${rupees(packRate)}/kg` },
];

export const planLabel = (value?: string) => {
  if (!value) return '';
  if (value.startsWith('monthly-')) {
    const kg = Number(value.split('-')[1]);
    return `Monthly pack, ${kg} kg (${rupees(packPrice(kg))}/month, ${rupees(packRate)}/kg)`;
  }
  if (value === 'business') return `Business (from ${rupees(packRate)}/kg)`;
  if (value === 'payg') return `Pay per pickup (${rupees(pricing.perKg)}/kg)`;
  return plans.find((p) => p.id === value)?.name ?? value;
};

const line = (label: string, value?: string) => (value && value.trim() ? `${label}: ${value.trim()}` : '');

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
    case 'order':
      lines = [
        "Hi dhobermans, I'd like to order:",
        ...(d.items ?? []),
        line('Total', d.total),
        line('Name', d.name),
        line('Pincode', d.pincode),
        line('Delivery address', d.address),
        line('Notes', d.notes),
      ];
      break;
    default:
      lines = [
        "Hi dhobermans, I'd like to schedule a pickup.",
        line('Services', (d.services ?? []).join(', ')),
        line('Plan', planLabel(d.plan)),
        line('Slot', d.slot),
        line('Pincode', d.pincode),
        line('Address', d.address),
        line('Name', d.name),
        line('Notes', d.notes),
      ];
  }
  return lines.filter(Boolean).join('\n');
};

export const waLink = (whatsapp: string, text: string) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
