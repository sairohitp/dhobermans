import { site } from '../config';

/**
 * Campaign attribution and marketing events.
 * - Remembers where a visitor came from (UTM tags, Meta and Google click IDs) on this device.
 * - Loads the Meta Pixel only when a Pixel ID is configured, and never for visitors who send
 *   a Global Privacy Control or Do Not Track signal.
 * - Sends conversion events to /api/event, where the Worker forwards them to Meta and Brevo.
 */

const KEY = 'dhobermans:attr';
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'] as const;
const MAX_AGE_DAYS = 30;

export type Attribution = Partial<Record<(typeof PARAMS)[number], string>> & { at?: number };

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown; callMethod?: (...a: unknown[]) => void };
declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

const { metaPixelId, brevo } = site.marketing;
const backend = !!metaPixelId || brevo;

const optedOut = () => {
  const n = navigator as Navigator & { globalPrivacyControl?: boolean };
  return n.globalPrivacyControl === true || n.doNotTrack === '1';
};

/** Stores the campaign tags of the latest tagged visit (last touch). */
export const captureAttribution = () => {
  try {
    const q = new URLSearchParams(location.search);
    const found: Attribution = {};
    PARAMS.forEach((p) => {
      const v = q.get(p);
      if (v) found[p] = v.slice(0, p === 'fbclid' || p === 'gclid' ? 500 : 80);
    });
    if (Object.keys(found).length) localStorage.setItem(KEY, JSON.stringify({ ...found, at: Date.now() }));
  } catch {
    /* storage unavailable */
  }
};

export const attribution = (): Attribution => {
  try {
    const a = JSON.parse(localStorage.getItem(KEY) || '{}') as Attribution;
    if (!a.at || Date.now() - a.at > MAX_AGE_DAYS * 864e5) return {};
    return a;
  } catch {
    return {};
  }
};

const clean = (v?: string) => (v ?? '').replace(/[^\w .-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40);

/** A short reference line for the WhatsApp message, so each chat shows which campaign it came from. */
export const refLine = () => {
  const a = attribution();
  const parts = [clean(a.utm_source), clean(a.utm_campaign)].filter(Boolean);
  if (parts.length) return `Ref: ${parts.join(' / ')}`;
  if (a.fbclid) return 'Ref: Meta ad';
  if (a.gclid) return 'Ref: Google ad';
  return '';
};

const cookie = (name: string) => document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1] ?? '';

/** Loads the Meta Pixel once. Safe to call on every navigation. */
export const initPixel = () => {
  if (!metaPixelId || optedOut() || window.fbq) return;
  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue!.push(args);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
  fbq('init', metaPixelId);
};

export const pageView = () => window.fbq?.('track', 'PageView');

export type TrackUser = { phone?: string; name?: string; consent?: boolean };

/** Records a conversion in the browser (Pixel) and on the server (Conversions API, Brevo) with one shared event ID. */
export const track = (event: 'Lead' | 'Contact', custom: Record<string, string | number> = {}, user: TrackUser = {}) => {
  if (!backend) return;
  try {
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const meta = !!metaPixelId && !optedOut();
    if (meta) window.fbq?.('track', event, custom, { eventID: id });
    const a = attribution();
    const body = JSON.stringify({
      event,
      id,
      url: location.origin + location.pathname,
      custom,
      meta,
      consent: user.consent === true,
      phone: user.consent ? user.phone : undefined,
      name: user.consent ? user.name : undefined,
      attr: { source: a.utm_source, medium: a.utm_medium, campaign: a.utm_campaign },
      fbp: meta ? cookie('_fbp') : '',
      fbc: meta ? cookie('_fbc') || (a.fbclid ? `fb.1.${a.at}.${a.fbclid}` : '') : '',
    });
    const blob = new Blob([body], { type: 'application/json' });
    if (!navigator.sendBeacon?.('/api/event', blob)) {
      void fetch('/api/event', { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => {});
    }
  } catch {
    /* tracking must never break a booking */
  }
};
