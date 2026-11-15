# dhobermans.com

Website and installable web app for dhobermans, a laundry pickup and delivery service in Bangalore.
Built with [Astro](https://astro.build) as a static site, hosted on Cloudflare Workers.

## Pages

| Route      | Contents                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| `/`        | Single-page site: hero, why us, services, how it works, pricing and plan finder, locations, care, Stain SOS, FAQs, pickup planner |
| `/care/`   | dhobermans' care shop with category filters and a cart                                                     |
| `/app/`    | The installed app: a four-step booking survey sent to WhatsApp (not indexed by search engines)             |
| `/offline/`, `/404` | Offline and not-found pages                                                                       |

## WhatsApp touchpoints

Every booking action opens WhatsApp chat with **+91 88617 61718** with a pre-filled message for its context
(service, plan, product order, location, stain, question, app booking). Number: `src/config.ts`. Message wording:
`src/lib/wa.ts`, `src/components/Cart.astro` (orders) and `src/pages/app/index.astro` (app bookings).

## Features

| Feature            | What it does                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| Care cart          | Add, change quantity, remove and clear products; saved on the device; one itemised WhatsApp order with total |
| App booking survey | Services, slot, address, name, review, send to WhatsApp; remembers details for repeat bookings           |
| Pickup planner     | Pincode coverage check, next pickup slots (IST), live WhatsApp message preview                           |
| Weekly reminder    | Downloads a recurring calendar event (.ics) for the chosen slot                                            |
| Plan finder        | Estimates weekly laundry weight from item counts and suggests a plan                                       |
| Stain SOS          | First-aid steps for six common stains                                                                      |
| Install prompt     | Once per device; QR code hand-off from laptop to phone; see below                                          |

Saved cart and details stay in the visitor's browser (`localStorage`) and are only sent when they tap a WhatsApp button.
The app menu has "Forget my saved details".

## Progressive web app

- **Once per device.** The install sheet opens automatically after 10 seconds or after scrolling past the first screen,
  then never again on that browser (`localStorage` key `dhobermans:pwa-prompt`). It waits if the visitor is typing.
- **Laptop to phone.** On desktop the sheet shows a QR code for `https://dhobermans.com/?install=1`. Opening that link
  shows the install sheet immediately on the phone, even if that phone saw it before.
- **Every phone gets a path:** one-tap install where Chrome/Edge allow it; menu steps on other Android browsers;
  Add to Home Screen steps on iPhone/iPad; "Open in browser" steps inside WhatsApp, Instagram and Facebook.
- **Feels like an app.** The manifest opens `/app/` full-screen. If a phone added the home page instead, the first launch
  in a session is redirected from `/` to `/app/`.
- **Offline.** `src/pwa/sw.js` is the service worker template; each build writes `dist/sw.js` with a content-based version
  and precaches pages, styles, scripts, fonts and icons.

To see the prompt again on your own device, clear site data for dhobermans.com.

## Run locally

Requires Node.js 22.23.4 or newer.

```bash
npm install
npm run dev
```

To run the production build exactly as Cloudflare serves it (headers, 404 handling):

```bash
npm run build && npx wrangler dev
```

## Hosting and deploys (Cloudflare Workers)

- `wrangler.jsonc` deploys `dist/` as static assets to the Worker `dhobermans`, attached to `dhobermans.com`.
- **Production:** every push to `main` builds and deploys to dhobermans.com.
- **Previews:** pushes to any other branch build a preview version on `*.sssairohit.workers.dev` without touching the live site.
- `public/_headers` sets security headers (HSTS, CSP, frame and referrer policies) and long-term caching for hashed files.
  If you add third-party scripts (for example analytics), add their hosts to the Content-Security-Policy there.
- DNS is on Cloudflare; the domain stays registered at GoDaddy. `www.dhobermans.com` redirects to `dhobermans.com`
  with a Cloudflare redirect rule. Email (MX, SPF, DMARC) records are unchanged.

## Where to edit

| What                                          | File                    |
| --------------------------------------------- | ----------------------- |
| WhatsApp number, email, app links, socials    | `src/config.ts`         |
| Services, pricing, FAQs, locations, products, stains | `src/data.ts`    |
| Images                                        | `src/assets/`           |
| Colours, font, spacing                        | `src/styles/global.css` |
| Security headers and caching                  | `public/_headers`       |

## Search engine checklist

- [ ] Google Search Console: add the domain property, verify with a DNS TXT record in Cloudflare, submit `https://dhobermans.com/sitemap.xml`
- [ ] Google Business Profile: create a service-area business for Bangalore with the WhatsApp number and website
- [ ] Bing Webmaster Tools: import the site from Search Console
- [ ] Use the same name, number and website everywhere (WhatsApp Business, Instagram, directories)
- [ ] Ask customers for Google reviews

## Pre-launch checklist

- [ ] Confirm prices, plan features and product prices in `src/data.ts`
- [ ] Confirm FAQ claims (SMS tracking, care guarantee, dry cleaning in plans)
- [ ] Add Privacy Policy and Terms pages
