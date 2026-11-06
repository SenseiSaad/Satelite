/**
 * Central site configuration. Edit these values to rebrand the site.
 * Every value can be overridden with an environment variable, see .env.example.
 */

const env = process.env;

export const site = {
  name: 'Fieldline',
  positioning: 'Clear, field-by-field information about crop conditions and flood impacts.',
  tagline: 'Helping agricultural teams understand crop and flood risk, one field at a time.',
  // Set NEXT_PUBLIC_SITE_URL to the final public domain before launch.
  url: env.NEXT_PUBLIC_SITE_URL ?? 'https://fieldline.ag',
  email: env.NEXT_PUBLIC_CONTACT_EMAIL,
  // Coverage is global; specific pilot regions are agreed with partners.
  coverage: {
    scope: 'Worldwide',
    crops: 'cotton, wheat, rice, maize and soybean',
  },
  description:
    'Fieldline is developing field-level crop condition and flood impact information from open satellite data, to help agricultural insurers, lenders and public agencies make better-informed decisions.',
} as const;

export type Site = typeof site;
