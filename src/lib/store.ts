/**
 * Small client-side stores kept in localStorage: the shopping cart and the visitor's saved details.
 * Everything stays on the visitor's device; nothing is sent anywhere until they tap a WhatsApp button.
 */
import { products } from '../data';

const CART_KEY = 'dhobermans:cart';
const PROFILE_KEY = 'dhobermans:profile';
export const CART_EVENT = 'dhobermans:cart';

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: the cart still works for this page view */
  }
};

/* ---------- Cart (create, read, update, delete) ---------- */

export type CartLine = { slug: string; qty: number };
let memory: CartLine[] | null = null;

const valid = (lines: CartLine[]) =>
  lines.filter((l) => products.some((p) => p.slug === l.slug) && Number.isInteger(l.qty) && l.qty > 0);

const load = (): CartLine[] => (memory ??= valid(read<CartLine[]>(CART_KEY, [])));

const save = (lines: CartLine[]) => {
  memory = lines;
  write(CART_KEY, lines);
  document.dispatchEvent(new CustomEvent(CART_EVENT));
};

export const MAX_QTY = 20;

export const cart = {
  /** Read */
  lines: (): CartLine[] => load().map((l) => ({ ...l })),
  qty: (slug: string) => load().find((l) => l.slug === slug)?.qty ?? 0,
  count: () => load().reduce((n, l) => n + l.qty, 0),
  total: () => load().reduce((sum, l) => sum + l.qty * (products.find((p) => p.slug === l.slug)?.amount ?? 0), 0),
  /** Create, or add to an existing line */
  add(slug: string, qty = 1) {
    const lines = load().map((l) => ({ ...l }));
    const line = lines.find((l) => l.slug === slug);
    if (line) line.qty = Math.min(MAX_QTY, line.qty + qty);
    else lines.push({ slug, qty: Math.min(MAX_QTY, qty) });
    save(lines);
  },
  /** Update; a quantity of 0 removes the line */
  set(slug: string, qty: number) {
    const q = Math.max(0, Math.min(MAX_QTY, Math.round(qty)));
    const lines = load()
      .map((l) => (l.slug === slug ? { ...l, qty: q } : { ...l }))
      .filter((l) => l.qty > 0);
    save(lines);
  },
  /** Delete one line */
  remove(slug: string) {
    save(load().filter((l) => l.slug !== slug));
  },
  /** Delete everything */
  clear() {
    save([]);
  },
  /** Pick up changes made in another tab */
  reload() {
    memory = null;
    document.dispatchEvent(new CustomEvent(CART_EVENT));
  },
};

export const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/* ---------- Saved details for faster repeat requests ---------- */

export type Profile = { name?: string; pincode?: string; address?: string; pin?: { lat: number; lng: number } };

export const profile = {
  get: (): Profile => read<Profile>(PROFILE_KEY, {}),
  save(p: Profile) {
    const clean: Profile = {};
    if (p.name?.trim()) clean.name = p.name.trim().slice(0, 80);
    if (p.pincode && /^\d{6}$/.test(p.pincode)) clean.pincode = p.pincode;
    if (p.address?.trim()) clean.address = p.address.trim().slice(0, 300);
    if (p.pin && Number.isFinite(p.pin.lat) && Number.isFinite(p.pin.lng)) clean.pin = { lat: p.pin.lat, lng: p.pin.lng };
    write(PROFILE_KEY, clean);
  },
  clear() {
    try {
      localStorage.removeItem(PROFILE_KEY);
    } catch {
      /* ignore */
    }
  },
};
