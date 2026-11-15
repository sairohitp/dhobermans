/**
 * dhobermans Worker.
 * The website itself is static and is served straight from Cloudflare's asset cache: this script
 * only runs for /api/* (see run_worker_first in wrangler.jsonc).
 *
 * POST /api/event  Receives a conversion from the booking flow and forwards it to
 *                  - Meta Conversions API, when site.marketing.metaPixelId and the META_CAPI_TOKEN secret are set
 *                  - Brevo contacts, when the BREVO_API_KEY secret is set and the visitor ticked the opt-in
 * Nothing is stored here, and both integrations stay off until their secret exists.
 */
import { site } from '../src/config';

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  LIMITER?: { limit: (options: { key: string }) => Promise<{ success: boolean }> };
  META_CAPI_TOKEN?: string;
  META_TEST_EVENT_CODE?: string;
  BREVO_API_KEY?: string;
}
interface Ctx {
  waitUntil: (promise: Promise<unknown>) => void;
}

const GRAPH_VERSION = 'v26.0';
const EVENTS = new Set(['Lead', 'Contact']);
const MAX_BODY = 4096;

const reply = (status: number) => new Response(null, { status, headers: { 'cache-control': 'no-store' } });
const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

/** Digits with country code and no plus sign (India assumed for 10-digit mobile numbers), or '' when invalid. */
export const normalisePhone = (raw: string) => {
  let d = raw.replace(/\D/g, '').replace(/^00/, '');
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  if (d.length === 10 && /^[6-9]/.test(d)) d = `91${d}`;
  return d.length >= 11 && d.length <= 15 ? d : '';
};

const post = async (label: string, url: string, headers: Record<string, string>, body: unknown) => {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', ...headers }, body: JSON.stringify(body) });
    if (!res.ok) console.warn(`${label} responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
  } catch (err) {
    console.warn(`${label} request failed`, err instanceof Error ? err.message : err);
  }
};

async function event(request: Request, env: Env, ctx: Ctx): Promise<Response> {
  if (request.method !== 'POST') return reply(405);
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return reply(403);

  const ip = request.headers.get('cf-connecting-ip') ?? '';
  if (env.LIMITER && !(await env.LIMITER.limit({ key: ip || 'unknown' })).success) return reply(429);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return reply(413);
  let b: Record<string, unknown>;
  try {
    b = JSON.parse(raw);
  } catch {
    return reply(400);
  }
  const name = text(b.event, 20);
  const id = text(b.id, 64);
  if (!EVENTS.has(name) || !id) return reply(400);

  const consent = b.consent === true;
  const phone = consent ? normalisePhone(text(b.phone, 20)) : '';
  const firstName = consent ? text(b.name, 80).split(/\s+/)[0] : '';
  const custom = b.custom && typeof b.custom === 'object' ? (b.custom as Record<string, unknown>) : {};
  const attr = b.attr && typeof b.attr === 'object' ? (b.attr as Record<string, unknown>) : {};
  const tasks: Promise<unknown>[] = [];

  const pixel = site.marketing.metaPixelId;
  if (pixel && env.META_CAPI_TOKEN && b.meta === true) {
    const user: Record<string, unknown> = {
      client_ip_address: ip || undefined,
      client_user_agent: request.headers.get('user-agent') ?? undefined,
      fbp: text(b.fbp, 120) || undefined,
      fbc: text(b.fbc, 600) || undefined,
    };
    if (phone) user.ph = [await sha256(phone)];
    if (firstName) user.fn = [await sha256(firstName.toLowerCase())];
    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: id,
          action_source: 'website',
          event_source_url: text(b.url, 300) || `${site.url}/`,
          user_data: user,
          custom_data: {
            content_category: text(custom.content_category, 40) || undefined,
            content_name: text(custom.content_name, 120) || undefined,
          },
        },
      ],
    };
    if (env.META_TEST_EVENT_CODE) payload.test_event_code = env.META_TEST_EVENT_CODE;
    tasks.push(
      post('Meta Conversions API', `https://graph.facebook.com/${GRAPH_VERSION}/${pixel}/events?access_token=${encodeURIComponent(env.META_CAPI_TOKEN)}`, {}, payload),
    );
  }

  if (env.BREVO_API_KEY && phone) {
    const attributes: Record<string, string> = { SMS: `+${phone}` };
    if (firstName) attributes.FIRSTNAME = firstName;
    const contact: Record<string, unknown> = { attributes, updateEnabled: true };
    if (site.marketing.brevoListId) contact.listIds = [site.marketing.brevoListId];
    tasks.push(post('Brevo', 'https://api.brevo.com/v3/contacts', { 'api-key': env.BREVO_API_KEY }, contact));
  }

  if (tasks.length) ctx.waitUntil(Promise.allSettled(tasks));
  console.log(JSON.stringify({ event: name, category: text(custom.content_category, 40), source: text(attr.source, 40), campaign: text(attr.campaign, 40), consent, forwarded: tasks.length }));
  return reply(204);
}

export default {
  async fetch(request: Request, env: Env, ctx: Ctx): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/event') return event(request, env, ctx);
    if (pathname.startsWith('/api/')) return reply(404);
    return env.ASSETS.fetch(request);
  },
};
