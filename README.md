# dhobermans.com

Website and installable web app for dhobermans, a laundry pickup and delivery service in Bangalore.
Built with [Astro](https://astro.build) as a static site, hosted on Cloudflare Workers.

## Pages

| Route      | Contents                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| `/`        | Single-page site: hero, why us, services, how it works, pricing and plan finder, locations, care, Stain SOS, FAQs, pickup planner |
| `/care/`   | dhobermans' care shop with category filters and a cart                                                     |
| `/services/`, `/services/<slug>/` | Service overview and one page per service |
| `/laundry-service-hsr-layout/`, `/business/` | Local landing page and business laundry page |
| `/guides/stain-removal/`, `/guides/care-labels/`, `/privacy/` | Guides and the privacy notice |
| `/api/event` | Marketing events endpoint (Worker), see Marketing below |
| `/app/`    | The installed app: a four-step booking survey sent to WhatsApp (not indexed by search engines)             |
| `/offline/`, `/404` | Offline and not-found pages                                                                       |

## WhatsApp touchpoints

Every WhatsApp button first opens a short booking flow (`src/components/BookingSheet.astro`): the visitor's details,
then a preview of the exact message, then "Open WhatsApp" to **+91 88617 61718**. The flow adapts to where it was opened:
a service, a plan or pack size, a care order, a location alert, or a question. Number: `src/config.ts`.
Message wording: `src/lib/booking.ts`. Without JavaScript, every button still links straight to WhatsApp.

## Features

| Feature            | What it does                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| Ordering wizard    | 4 short steps (Service, Time, Address, Review): top services plus "More", optional load size with a live price estimate, plan, wash preferences (detergent, softener), 7-day date strip with morning/evening windows computed live in IST, a "back by" time, repeat weekly or every 2 weeks, location by GPS or map pin (Google Maps link and distance in the message), message preview, then WhatsApp. The same engine runs the installed app (`src/components/OrderWizard.astro`) |
| Book again         | Returning customers get a one-tap "Repeat" button in the hero; the wizard opens pre-filled at the Time step |
| Live pickup promise | The hero shows the next pickup window, when laundry comes back and how long is left to book that slot    |
| Why-us bento       | Count-up numbers, an animated journey and a "Check my distance" tool for the free 5 km zone               |
| Business quotes    | A dedicated quote flow (business type, monthly volume, pickup frequency) from the Business pricing card   |
| Help shortcuts     | "Where is my order?", "Reschedule a pickup" and "Report an issue" open WhatsApp with the question started |
| Care cart          | Add, change quantity, remove and clear products; saved on the device; one itemised order through the wizard |
| Pricing            | ₹100/kg wash, fold and iron; monthly pack 10% off (₹90/kg, 20/40/60 kg); business volume tiers 15% off at 100 kg+ (₹85/kg) and 20% off at 250 kg+ (₹80/kg) |
| Plan finder        | Estimates weekly and monthly laundry weight with an animated washing machine, and compares pay per pickup with a monthly pack |
| Stain SOS + care labels | First-aid steps for six stains, and a decoder for 17 care-label symbols (ISO 3758)                  |
| Calendar reminder  | After booking, downloads a calendar event (.ics) for the chosen slot: one-time, weekly or every 2 weeks   |
| Install prompt     | Once per device; QR code hand-off from laptop to phone; see below                                          |

Saved cart, details, last order and wash preferences stay in the visitor's browser (`localStorage`) and are only sent
when they tap a WhatsApp button.
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

- `wrangler.jsonc` deploys `dist/` as static assets to the Worker `dhobermans`, attached to `dhobermans.com`. The script in `worker/` runs only for `/api/*`.
- **Production:** every push to `main` builds and deploys to dhobermans.com.
- **Previews:** pushes to any other branch build a preview version on `*.sssairohit.workers.dev` without touching the live site.
- `public/_headers` sets security headers (HSTS, CSP, frame and referrer policies) and long-term caching for hashed files.
  If you add third-party scripts (for example analytics), add their hosts to the Content-Security-Policy there.
- DNS is on Cloudflare; the domain stays registered at GoDaddy. `www.dhobermans.com` redirects to `dhobermans.com`
  with a Cloudflare redirect rule. Email (MX, SPF, DMARC) records are unchanged.

## Base location and free delivery zone

`src/config.ts` holds the laundry base (`base`) and the free pickup radius (`freeRadiusKm`, 5 km). The wizard shows each
customer their distance from the base and adds it, with a Google Maps link to their pin, to the WhatsApp message.
The base coordinates are currently the approximate centre of HSR Layout: replace `lat` and `lng` with the exact pin.

The map uses OpenStreetMap tiles (free, attribution shown). Its usage policy suits low-volume use like this; switch to
a commercial tile provider if traffic grows.

## Where to edit

| What                                          | File                    |
| --------------------------------------------- | ----------------------- |
| WhatsApp number, email, app links, socials    | `src/config.ts`         |
| Services, pricing (`pricing`), FAQs, locations, products, stains | `src/data.ts` |
| Images                                        | `src/assets/`           |
| Colours, font, spacing                        | `src/styles/global.css` |
| Security headers and caching                  | `public/_headers`       |

## Search pages and sitemap

- Indexable pages: `/`, `/services/` and one page per service (`/services/<slug>/`), `/laundry-service-hsr-layout/`, `/business/`, `/guides/stain-removal/`, `/guides/care-labels/`, `/care/`, `/privacy/`.
- Copy for the service pages lives in `src/seo.ts`. Only Wash & Fold has a published price; keep every other statement true to how the business runs.
- `sitemap.xml` is generated on every build (see `astro.config.mjs`) from all pages that are not marked `noindex`. Nothing to maintain by hand.
- Structured data: business, services and prices site-wide; `Service`, `FAQPage` and `BreadcrumbList` on service pages; `FAQPage` on the home page; `HowTo` on the stain guide.

## Marketing: Meta and Brevo

Everything is off until it is configured. Public IDs go in `src/config.ts` under `marketing`; secrets are Cloudflare Worker secrets and never go in the repository.

| What | Where | Effect |
| --- | --- | --- |
| `metaPixelId` | `src/config.ts` | Loads the Meta Pixel (PageView, Lead, Contact). Not loaded for browsers sending Global Privacy Control or Do Not Track. |
| `metaDomainVerification` | `src/config.ts` | Adds the `facebook-domain-verification` meta tag. |
| `META_CAPI_TOKEN` | Cloudflare secret | Sends the same events server-side through the Conversions API, deduplicated with the Pixel by event ID. |
| `META_TEST_EVENT_CODE` | Cloudflare secret (optional) | Routes server events to the Test Events tab in Meta Events Manager. Remove after testing. |
| `brevo: true`, `brevoListId` | `src/config.ts` | Shows the optional opt-in (mobile number) on the review step of the booking flow. |
| `BREVO_API_KEY` | Cloudflare secret | Adds opted-in contacts to Brevo (`SMS` and `FIRSTNAME` attributes) and to the list. |

Add a secret in the Cloudflare dashboard (Workers & Pages, dhobermans, Settings, Variables and Secrets, type Secret) or with `npx wrangler secret put META_CAPI_TOKEN`.

How it works:

- `src/lib/track.ts` remembers campaign tags (`utm_source`, `utm_medium`, `utm_campaign`, `fbclid`, `gclid`) for 30 days and adds a line such as `Ref: instagram / launch_offer` to the WhatsApp message, so every chat shows its campaign.
- When a booking is handed to WhatsApp, the browser posts one event to `/api/event`. `worker/index.ts` forwards it to Meta and Brevo. Phone number and name are only sent when the visitor ticked the opt-in.
- The Worker runs only for `/api/*`; all pages are still served as static assets. The endpoint accepts same-origin requests only and is rate limited to 10 a minute per address.
- Tag every advert and campaign link, for example `https://dhobermans.com/?utm_source=instagram&utm_medium=paid&utm_campaign=launch_offer`.

## Search engine checklist

- [ ] Google Search Console: add the domain property, verify with a DNS TXT record in Cloudflare, submit `https://dhobermans.com/sitemap.xml`
- [ ] Google Business Profile: create a service-area business for Bangalore with the WhatsApp number and website
- [ ] Bing Webmaster Tools: import the site from Search Console
- [ ] Use the same name, number and website everywhere (WhatsApp Business, Instagram, directories)
- [ ] Ask customers for Google reviews

## Pre-launch checklist

- [ ] Confirm product prices and monthly pack sizes in `src/data.ts`
- [ ] Confirm FAQ claims (SMS tracking, care guarantee, express options)
- [ ] Add Privacy Policy and Terms pages
