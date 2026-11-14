import { site } from '../config';

/** Builds a WhatsApp click-to-chat link with a pre-filled message. */
export const wa = (text: string = msg.pickup) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

/** Pre-filled WhatsApp messages for each touchpoint. */
export const msg = {
  pickup: "Hi dhobermans, I'd like to schedule a laundry pickup.",
  question: 'Hi dhobermans, I have a question.',
  service: (name: string) => `Hi dhobermans, I'd like to book ${name}. What is the next available pickup slot?`,
  plan: (name: string, price: string) =>
    `Hi dhobermans, I'm interested in the ${name} plan (${price}/month). Could you help me get started?`,
  product: (name: string, size: string, price: string) => `Hi dhobermans, I'd like to order ${name} (${size}, ${price}).`,
  location: (name: string, address: string) =>
    `Hi dhobermans, please let me know when the ${name} self-service spot (${address}) opens.`,
  stain: (stain: string) => `Hi dhobermans, I have a ${stain.toLowerCase()} stain that needs professional stain removal.`,
};
