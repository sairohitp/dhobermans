/**
 * Business details. Fill these in before launch.
 * Anything left as an empty string is hidden on the site, so no placeholder
 * contact details are ever shown to visitors.
 */
export const site = {
  name: 'dhobermans',
  url: 'https://dhobermans.com',
  city: 'Bangalore',
  title: 'dhobermans | Laundry pickup and delivery in Bangalore',
  description:
    'Laundry pickup and delivery, done right. Wash and fold, dry cleaning, steam ironing and more, collected from your door in Bangalore.',

  /** Contact details (optional). Example: 'hello@dhobermans.com' */
  email: '',
  /** Display phone number (optional). Example: '+91 98765 43210' */
  phone: '',
  /** WhatsApp number, digits only with country code (optional). Example: '919876543210' */
  whatsapp: '',

  /**
   * Where the pickup form is sent. Any endpoint that accepts a standard form POST
   * works, for example a Formspree form URL: 'https://formspree.io/f/xxxxxxx'.
   * If empty, the form falls back to WhatsApp, then email.
   */
  formEndpoint: '',

  /** App store links (optional). Leave empty until the apps are live. */
  playStore: '',
  appStore: '',

  /** Social links (optional). */
  instagram: '',
  linkedin: '',
};
