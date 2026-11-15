/**
 * Business details. Anything left as an empty string is hidden on the site.
 */
export const site = {
  name: 'dhobermans',
  url: 'https://dhobermans.com',
  city: 'Bangalore',
  title: 'Laundry pickup and delivery in HSR Layout, Bangalore | dhobermans',
  description:
    'Laundry service in HSR Layout, Bangalore: wash, fold and iron at ₹100 per kg, back in 24 hours. Free pickup and delivery within 5 km. Book on WhatsApp.',

  /** WhatsApp number used by every booking touchpoint: digits only, with country code. */
  whatsapp: '918861761718',
  /** How the WhatsApp number is displayed on the site. */
  whatsappDisplay: '+91 88617 61718',

  /** Laundry base. Pickup and delivery are free within `freeRadiusKm` of it. */
  base: {
    label: 'HSR Layout, Sector 1',
    full: 'HSR Layout, Sector 1, Bengaluru, Karnataka',
    postalCode: '560102',
    /**
     * APPROXIMATE: the centre of HSR Layout. Replace with the exact pin of the laundry
     * (in Google Maps, right-click the location and copy the coordinates).
     */
    lat: 12.9121,
    lng: 77.6446,
  },
  freeRadiusKm: 5,

  /** Optional contact email, shown in the footer when set. Example: 'hello@dhobermans.com' */
  email: '',

  /** App store links (optional). Leave empty until the apps are live. */
  playStore: '',
  appStore: '',

  /** Social links (optional). */
  instagram: '',
  linkedin: '',

  /**
   * Marketing. Everything here is public (IDs only) and stays switched off while empty.
   * Secrets (the Meta Conversions API token and the Brevo API key) never go in this file:
   * they are stored as Cloudflare Worker secrets named META_CAPI_TOKEN and BREVO_API_KEY.
   */
  marketing: {
    /** Meta Pixel (dataset) ID, digits only. Loads the Pixel and enables server-side events. */
    metaPixelId: '',
    /** Value of the facebook-domain-verification meta tag (Meta Business settings, Brand safety, Domains). */
    metaDomainVerification: '',
    /** Set to true once BREVO_API_KEY is saved in Cloudflare: shows the opt-in for offers in the booking flow. */
    brevo: false,
    /** Brevo list ID that opted-in contacts are added to (0 = no list). */
    brevoListId: 0,
  },

  /** Search engine ownership tags (optional, only needed if DNS verification is not used). */
  googleSiteVerification: '',
  bingSiteVerification: '',
};
