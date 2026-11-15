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

- `wrangler.jsonc` deploys `dist/` as static assets to the Worker `dhobermans`, attached to `dhobermans.com`.
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
