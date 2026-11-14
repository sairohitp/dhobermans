/*
 * dhobermans service worker.
 * Template: the build step (astro.config.mjs) fills in VERSION and PRECACHE_URLS and writes dist/sw.js.
 */
const VERSION = '__VERSION__';
const PRECACHE = `dhb-precache-${VERSION}`;
const RUNTIME = 'dhb-runtime';
const PRECACHE_URLS = __PRECACHE__;
const OFFLINE_URL = '/offline/';
const RUNTIME_MAX_ENTRIES = 60;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('dhb-precache-') && k !== PRECACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const isPageRequest = (request) =>
  request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');

const trimCache = async (name, max) => {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
};

/** Cached copy of a page, trying both "/path" and "/path/". */
const cachedPage = async (url) => {
  const cache = await caches.open(PRECACHE);
  const { pathname } = new URL(url);
  const candidates = [pathname];
  if (!pathname.endsWith('/') && !pathname.includes('.')) candidates.push(`${pathname}/`);
  for (const path of candidates) {
    const hit = await cache.match(path, { ignoreSearch: true });
    if (hit) return hit;
  }
  return undefined;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname === '/sw.js') return;

  // Pages: network first so content is always fresh, cached copy or offline page when offline.
  if (isPageRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic' && !response.redirected) {
            const copy = response.clone();
            caches.open(PRECACHE).then((cache) => cache.put(url.pathname, copy));
          }
          return response;
        })
        .catch(async () => (await cachedPage(request.url)) || (await caches.match(OFFLINE_URL)) || Response.error()),
    );
    return;
  }

  // Hashed build assets never change: cache first.
  if (url.pathname.startsWith('/_astro/')) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            if (response.ok && response.type === 'basic') {
              const copy = response.clone();
              caches.open(RUNTIME).then((cache) => cache.put(request, copy).then(() => trimCache(RUNTIME, RUNTIME_MAX_ENTRIES)));
            }
            return response;
          }),
      ),
    );
    return;
  }

  // Everything else (icons, manifest): network first, cache as fallback.
  event.respondWith(fetch(request).catch(async () => (await caches.match(request)) || Response.error()));
});
