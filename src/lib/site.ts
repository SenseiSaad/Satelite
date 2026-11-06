/**
 * Central site configuration. Edit these values to rebrand the site.
 * Every value can be overridden with an environment variable, see .env.example.
 */

const env = process.env;

export const site = {
  name: 'Northgate Labs',
  positioning: 'Clear, field-by-field information about crop conditions and flood impacts.',
  tagline: 'Helping agricultural teams understand crop and flood risk, one field at a time.',
  // Canonical origin, set with NEXT_PUBLIC_SITE_URL. Falls back to localhost
  // so local development works without extra setup.
  url: env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  // Contact address for the footer and replies. Set with CONTACT_EMAIL.
  email: env.CONTACT_EMAIL ?? env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
  // Planned coverage; specific pilot regions are chosen with pilot partners.
  coverage: {
    scope: 'Planned coverage',
    crops: 'cotton, wheat, rice, maize and soybean',
    regions: 'regions chosen with pilot partners',
  },
  description:
    'Northgate Labs is developing field-level crop condition and flood impact information from open satellite data, to help agricultural insurers, lenders and public agencies make better-informed decisions.',
} as const;

export type Site = typeof site;
