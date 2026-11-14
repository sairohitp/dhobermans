# dhobermans.com

Marketing website for dhobermans, a laundry pickup and delivery service in Bangalore.
Built with [Astro](https://astro.build) as a static site with app-like (single-page style) navigation between `/` and `/care`.

## Pages

| Route   | Contents                                                                                                        |
| ------- | --------------------------------------------------------------------------------------------------------------- |
| `/`     | Hero, why us, services, how it works, pricing + plan finder, locations, care preview, Stain SOS, FAQs, pickup planner |
| `/care` | dhobermans' care product catalogue with category filters                                                        |
| `/404`  | Not-found page                                                                                                  |

## WhatsApp touchpoints

Every booking action opens WhatsApp chat with **+91 88617 61718**, with a pre-filled message for its context
(service, plan, product, location, stain, question). The number and messages live in:

- `src/config.ts` (`whatsapp`, `whatsappDisplay`)
- `src/lib/wa.ts` (message templates)

## Interactive features

| Feature            | What it does                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| Pickup planner     | Pincode coverage check, next four pickup slots (IST), service picker, live WhatsApp message preview      |
| Weekly reminder    | Downloads a recurring calendar event (.ics) for the chosen slot, with a two-hour alert                    |
| Plan finder        | Estimates weekly laundry weight from item counts and suggests Basic, Premium or Business                  |
| Stain SOS          | First-aid steps for six common stains, with a hand-off to professional stain removal                       |
| Mobile action bar  | Fixed "Book on WhatsApp" bar on phones; floating WhatsApp button on desktop                                |
| Share              | Native share sheet on phones, WhatsApp share elsewhere                                                     |
| Installable        | Web app manifest and icons; an "Install web app" button appears where the browser supports it              |

## Run locally

Requires Node.js 22.23.4 or newer.

```bash
npm install
npm run dev
```

The site runs at http://localhost:4321. `npm run build` writes the production site to `dist/`.

## Where to edit

| What                                          | File                    |
| --------------------------------------------- | ----------------------- |
| WhatsApp number, email, app links, socials    | `src/config.ts`         |
| WhatsApp message wording                      | `src/lib/wa.ts`         |
| Services, pricing, FAQs, locations, products, stains, plan finder weights | `src/data.ts` |
| Images                                        | `src/assets/`           |
| Colours, fonts, spacing                       | `src/styles/global.css` |

## Deploy to GitHub Pages with dhobermans.com (GoDaddy)

The workflow in `.github/workflows/deploy.yml` builds and deploys the site on every push to `main`.

**1. GitHub**

1. Make sure a `main` branch exists with this code, and set it as the default branch (Settings > General > Default branch).
2. Settings > Pages > Build and deployment > Source: **GitHub Actions**.
3. Settings > Pages > Custom domain: enter `dhobermans.com` and save.
4. Recommended: verify the domain in your GitHub account (profile Settings > Pages > Add a domain). GitHub gives you a TXT record to add at GoDaddy.

**2. GoDaddy** (Domain Portfolio > dhobermans.com > DNS)

1. Remove the existing parking A record for `@` and any domain forwarding.
2. Add four A records for `@`:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Optional IPv6: four AAAA records for `@`:
   `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
4. Set the CNAME record for `www` to `sairohitp.github.io`.

**3. HTTPS**

Once DNS has propagated and GitHub shows the domain check as successful, tick **Enforce HTTPS** in Settings > Pages.

Note: the site is built for the root of `dhobermans.com`. Before the custom domain is set, the temporary
`sairohitp.github.io/dhobermans/` address will show unstyled pages; that resolves once the domain is connected.

## Pre-launch checklist

- [ ] Confirm prices, plan features and product prices in `src/data.ts`
- [ ] Confirm FAQ claims (SMS tracking, care guarantee, dry cleaning in plans)
- [ ] Add app store links once the apps are live
- [ ] Add Privacy Policy and Terms pages
