import { defineConfig } from 'astro/config';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';

const walk = async (dir) =>
  (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)])),
    )
  ).flat();

/** Writes dist/sw.js after each build with a content-based version and the list of files to precache. */
function serviceWorker() {
  return {
    name: 'dhobermans-service-worker',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = (await walk(root)).map((f) => `/${relative(root, f).split(sep).join('/')}`).filter((f) => f !== '/sw.js');

        const pages = files.filter((f) => f.endsWith('/index.html')).map((f) => f.replace(/index\.html$/, ''));
        const assets = files.filter(
          (f) => f.startsWith('/_astro/') && (/\.(css|js)$/.test(f) || /-latin-\d+-normal\.[\w-]+\.woff2$/.test(f)),
        );
        const statics = ['/manifest.webmanifest', '/favicon.svg', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png'].filter((f) =>
          files.includes(f),
        );
        const precache = [...pages, ...assets, ...statics];

        const hash = createHash('sha256');
        for (const f of [...files].sort()) {
          hash.update(f);
          hash.update(await readFile(join(root, f)));
        }
        const version = hash.digest('hex').slice(0, 12);

        const template = await readFile(new URL('./src/pwa/sw.js', import.meta.url), 'utf8');
        const output = template.replace('__VERSION__', version).replace('__PRECACHE__', JSON.stringify(precache, null, 2));
        await writeFile(join(root, 'sw.js'), output);
        logger.info(`sw.js written: version ${version}, ${precache.length} files precached`);
      },
    },
  };
}

export default defineConfig({
  site: 'https://dhobermans.com',
  trailingSlash: 'ignore',
  integrations: [serviceWorker()],
  // Keep every script as an external file (no inline module scripts), which suits the Content-Security-Policy.
  vite: {
    build: {
      assetsInlineLimit: 0,
      // Keep vendor prefixes that older iPhones need (for example -webkit-backdrop-filter before iOS 18).
      cssTarget: ['chrome100', 'edge100', 'firefox103', 'safari15', 'ios15'],
    },
  },
});
