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

export type DayWindow = { name: string; label: string; startHour: number; endHour: number; available: boolean };
export type PickupDay = { offset: number; label: string; sub: string; long: string; windows: DayWindow[] };

/**
 * Pickup days for the next `count` days in IST, computed on the visitor's device each time,
 * so dates never need updating. A window is offered only if it starts at least an hour from now.
 */
export const pickupDays = (count = 7): PickupDay[] => {
  const now = istNow();
  const out: PickupDay[] = [];
  for (let offset = 0; offset < count; offset++) {
    const noon = new Date(Date.UTC(now.y, now.m, now.day + offset, 12, 0) - IST_OFFSET_MIN * 60000);
    const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-IN', { ...o, timeZone: 'Asia/Kolkata' }).format(noon);
    const weekday = fmt({ weekday: 'short' });
    const sub = `${fmt({ day: 'numeric' })} ${fmt({ month: 'short' })}`;
    const windows = slots.map((s) => ({ ...s, available: offset > 0 || now.hour <= s.startHour - 1 }));
    if (!windows.some((w) => w.available)) continue;
    const label = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : weekday;
    out.push({ offset, label, sub, long: label === weekday ? `${weekday} ${sub}` : `${label}, ${weekday} ${sub}`, windows });
  }
  return out;
};

/** Exact UTC start and end of a window on a pickup day (for calendar reminders). */
export const windowTimes = (day: PickupDay, w: DayWindow) => {
  const now = istNow();
  return {
    startUtc: new Date(Date.UTC(now.y, now.m, now.day + day.offset, w.startHour, 0) - IST_OFFSET_MIN * 60000),
    endUtc: new Date(Date.UTC(now.y, now.m, now.day + day.offset, w.endHour, 0) - IST_OFFSET_MIN * 60000),
  };
};

const icsDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** A weekly recurring calendar reminder for a slot, as .ics text. */
export const buildIcs = (slot: { startUtc: Date; endUtc: Date }, whatsapp: string) =>
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
  if (!/^\d{6}$/.test(v)) return { text: 'Pickup is free within 5 km of HSR Layout.', cls: '', valid: false };
  if (v.startsWith('560')) return { text: 'We serve your area. Pin your location to check free pickup (within 5 km).', cls: 'is-ok', valid: true };
  if (/^56[12]/.test(v)) return { text: "You may be outside our zone. Send your request and we'll confirm.", cls: 'is-maybe', valid: true };
  return { text: "We're in Bangalore only for now. Message us and we'll let you know when we reach you.", cls: 'is-maybe', valid: true };
};
