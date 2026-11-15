import { slots } from '../data';

const IST_OFFSET_MIN = 330; // India Standard Time is UTC+5:30, no daylight saving.

export type Slot = { id: string; label: string; long: string; startUtc: Date; endUtc: Date };

/** Current date and hour in IST. */
const istNow = () => {
  const d = new Date(Date.now() + IST_OFFSET_MIN * 60000);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), day: d.getUTCDate(), hour: d.getUTCHours() + d.getUTCMinutes() / 60 };
};

/** The next `count` pickup windows (IST), at least one hour ahead. */
export const nextSlots = (count = 4): Slot[] => {
  const now = istNow();
  const out: Slot[] = [];
  for (let offset = 0; offset < 7 && out.length < count; offset++) {
    for (const s of slots) {
      if (offset === 0 && now.hour > s.startHour - 1) continue;
      const startUtc = new Date(Date.UTC(now.y, now.m, now.day + offset, s.startHour, 0) - IST_OFFSET_MIN * 60000);
      const endUtc = new Date(Date.UTC(now.y, now.m, now.day + offset, s.endHour, 0) - IST_OFFSET_MIN * 60000);
      const dayName = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' }).format(startUtc);
      const rel = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : dayName;
      out.push({
        id: `${offset}-${s.startHour}`,
        label: `${rel} · ${s.label}`,
        long: `${rel === dayName ? dayName : `${rel} (${dayName})`}, ${s.label}`,
        startUtc,
        endUtc,
      });
      if (out.length === count) break;
    }
  }
  return out;
};

const icsDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** A weekly recurring calendar reminder for a slot, as .ics text. */
export const buildIcs = (slot: Slot, whatsapp: string) =>
  [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//dhobermans//Pickup reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@dhobermans.com`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(slot.startUtc)}`,
    `DTEND:${icsDate(slot.endUtc)}`,
    'RRULE:FREQ=WEEKLY',
    'SUMMARY:dhobermans laundry pickup',
    `DESCRIPTION:Book this week's pickup on WhatsApp: https://wa.me/${whatsapp}`,
    `URL:https://wa.me/${whatsapp}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Laundry pickup reminder',
    'TRIGGER:-PT2H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

/** Pincode coverage. Bangalore pincodes start with 560. */
export const pincodeStatus = (pin: string): { text: string; cls: '' | 'is-ok' | 'is-maybe'; valid: boolean } => {
  const v = pin.trim();
  if (!/^\d{6}$/.test(v)) return { text: 'We serve all of Bangalore.', cls: '', valid: false };
  if (v.startsWith('560')) return { text: 'Great news: we pick up in your area.', cls: 'is-ok', valid: true };
  if (/^56[12]/.test(v)) return { text: "You may be just outside our zone. Send your request and we'll confirm.", cls: 'is-maybe', valid: true };
  return { text: "We're Bangalore-only for now. Message us and we'll let you know when we reach you.", cls: 'is-maybe', valid: true };
};
