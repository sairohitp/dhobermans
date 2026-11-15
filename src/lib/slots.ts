import { slots } from '../data';

const IST_OFFSET_MIN = 330; // India Standard Time is UTC+5:30, no daylight saving.
const HOUR = 3600000;

/** Hours from pickup to return for wash, fold and iron. */
export const TURNAROUND_HOURS = 24;
/** A window can be booked until this many hours before it starts. */
export const CUTOFF_HOURS = 1;

/** Current date and hour in IST. */
const istNow = () => {
  const d = new Date(Date.now() + IST_OFFSET_MIN * 60000);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), day: d.getUTCDate(), hour: d.getUTCHours() + d.getUTCMinutes() / 60 };
};

const hourLabel = (h: number) => `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`;
const weekday = (d: Date) => new Intl.DateTimeFormat('en-IN', { weekday: 'short', timeZone: 'Asia/Kolkata' }).format(d);

/** Whole days between today (IST) and the given moment (IST). */
const daysFromToday = (d: Date) => {
  const day = (x: Date) => {
    const i = new Date(x.getTime() + IST_OFFSET_MIN * 60000);
    return Date.UTC(i.getUTCFullYear(), i.getUTCMonth(), i.getUTCDate());
  };
  return Math.round((day(d) - day(new Date())) / (24 * HOUR));
};

/** "today, 5 PM", "tomorrow, 8 AM" or "Tue, 11 AM" for a moment in IST. */
export const whenLabel = (d: Date) => {
  const diff = daysFromToday(d);
  const h = new Date(d.getTime() + IST_OFFSET_MIN * 60000).getUTCHours();
  return `${diff === 0 ? 'today' : diff === 1 ? 'tomorrow' : weekday(d)}, ${hourLabel(h)}`;
};

export type DayWindow = { name: string; label: string; startHour: number; endHour: number; available: boolean };
export type PickupDay = { offset: number; label: string; sub: string; long: string; windows: DayWindow[] };

/**
 * Pickup days for the next `count` days in IST, computed on the visitor's device each time,
 * so dates never need updating. A window is offered until CUTOFF_HOURS before it starts.
 */
export const pickupDays = (count = 7): PickupDay[] => {
  const now = istNow();
  const out: PickupDay[] = [];
  for (let offset = 0; offset < count; offset++) {
    const noon = new Date(Date.UTC(now.y, now.m, now.day + offset, 12, 0) - IST_OFFSET_MIN * 60000);
    const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-IN', { ...o, timeZone: 'Asia/Kolkata' }).format(noon);
    const wd = fmt({ weekday: 'short' });
    const sub = `${fmt({ day: 'numeric' })} ${fmt({ month: 'short' })}`;
    const windows = slots.map((s) => ({ ...s, available: offset > 0 || now.hour <= s.startHour - CUTOFF_HOURS }));
    if (!windows.some((w) => w.available)) continue;
    const label = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : wd;
    out.push({ offset, label, sub, long: label === wd ? `${wd} ${sub}` : `${label}, ${wd} ${sub}`, windows });
  }
  return out;
};

/** Exact UTC start and end of a window on a pickup day. */
export const windowTimes = (day: PickupDay, w: DayWindow) => {
  const now = istNow();
  return {
    startUtc: new Date(Date.UTC(now.y, now.m, now.day + day.offset, w.startHour, 0) - IST_OFFSET_MIN * 60000),
    endUtc: new Date(Date.UTC(now.y, now.m, now.day + day.offset, w.endHour, 0) - IST_OFFSET_MIN * 60000),
  };
};

/** When laundry picked up in a window is back: TURNAROUND_HOURS after the window ends. */
export const returnLabel = (endUtc: Date) => whenLabel(new Date(endUtc.getTime() + TURNAROUND_HOURS * HOUR));

/** The next bookable pickup window, its booking cut-off and the return time. */
export const nextPickup = () => {
  const day = pickupDays(7)[0];
  const w = day?.windows.find((x) => x.available);
  if (!day || !w) return null;
  const { startUtc, endUtc } = windowTimes(day, w);
  const cutoffUtc = new Date(startUtc.getTime() - CUTOFF_HOURS * HOUR);
  return {
    pickup: `${day.label}, ${w.label}`,
    back: returnLabel(endUtc),
    cutoff: whenLabel(cutoffUtc),
    minutesLeft: Math.max(0, Math.round((cutoffUtc.getTime() - Date.now()) / 60000)),
  };
};

const icsDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** A calendar event for a pickup window as .ics text: one-time, weekly or every two weeks. */
export const buildIcs = (slot: { startUtc: Date; endUtc: Date }, whatsapp: string, repeat: 'once' | 'weekly' | 'biweekly' = 'weekly') =>
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
    repeat === 'weekly' ? 'RRULE:FREQ=WEEKLY' : repeat === 'biweekly' ? 'RRULE:FREQ=WEEKLY;INTERVAL=2' : '',
    'SUMMARY:dhobermans laundry pickup',
    `DESCRIPTION:Book or change your pickup on WhatsApp: https://wa.me/${whatsapp}`,
    `URL:https://wa.me/${whatsapp}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Laundry pickup reminder',
    'TRIGGER:-PT2H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

/** Pincode coverage. Bangalore pincodes start with 560. */
export const pincodeStatus = (pin: string): { text: string; cls: '' | 'is-ok' | 'is-maybe'; valid: boolean } => {
  const v = pin.trim();
  if (!/^\d{6}$/.test(v)) return { text: 'Pickup is free within 5 km of HSR Layout.', cls: '', valid: false };
  if (v.startsWith('560')) return { text: 'We serve your area. Pin your location to check free pickup (within 5 km).', cls: 'is-ok', valid: true };
  if (/^56[12]/.test(v)) return { text: "You may be outside our zone. Send your request and we'll confirm.", cls: 'is-maybe', valid: true };
  return { text: "We're in Bangalore only for now. Message us and we'll let you know when we reach you.", cls: 'is-maybe', valid: true };
};
