# dhobermans.com

Marketing website for dhobermans, a laundry pickup and delivery service in Bangalore.
Built with [Astro](https://astro.build) as a fully static site: fast, SEO-friendly, and deployable to any static host.

## Pages

| Route   | Contents                                                                                           |
| ------- | -------------------------------------------------------------------------------------------------- |
| `/`     | Hero, why us, services, how it works, pricing, self-laundry locations, care preview, FAQs, booking |
| `/care` | dhobermans' care product catalogue with category filters                                           |
| `/404`  | Not-found page                                                                                     |

## Run locally

Requires Node.js 22.23.4 or newer.

```bash
npm install
npm run dev
```

The site runs at http://localhost:4321. `npm run build` writes the production site to `dist/`.

## Where to edit

| What                                                        | File                       |
| ----------------------------------------------------------- | -------------------------- |
| Contact details, form endpoint, app links, socials          | `src/config.ts`            |
| Services, pricing, FAQs, locations, products                | `src/data.ts`              |
| Images                                                      | `src/assets/`              |
| Colours, fonts, spacing                                     | `src/styles/global.css`    |
| Page layout                                                 | `src/pages/*.astro`        |

Empty values in `src/config.ts` are hidden on the site, so no placeholder contact details are ever shown.

## Receiving pickup requests

The booking form sends requests in this order of preference:

1. `formEndpoint`: any service that accepts a standard form POST, for example a free [Formspree](https://formspree.io) form. Requests arrive by email.
2. `whatsapp`: opens WhatsApp with the request pre-filled.
3. `email`: opens the visitor's email app with the request pre-filled.

If none is set, the form shows "Online booking is being set up". Set at least one before launch.

## Deploy and connect dhobermans.com

Any static host works. Vercel, Netlify and Cloudflare Pages all have free tiers:

1. Import this GitHub repository in the host's dashboard.
2. Build command: `npm run build`. Output directory: `dist`. Node version: 22.
3. Add `dhobermans.com` and `www.dhobermans.com` as custom domains in the host's dashboard.
4. At your domain registrar, replace the current parking records with the DNS records the host shows you.

## Pre-launch checklist

- [ ] Set `formEndpoint`, `whatsapp` or `email` in `src/config.ts`
- [ ] Confirm prices, plan features and product prices in `src/data.ts`
- [ ] Confirm FAQ claims (SMS tracking, care guarantee, dry cleaning in plans)
- [ ] Add app store links once the apps are live
- [ ] Add Privacy Policy and Terms pages if you collect customer data
