import { z } from 'zod';

export const organizationTypes = ['insurer', 'lender', 'ngo_agency', 'other'] as const;
export type OrganizationType = (typeof organizationTypes)[number];

export const organizationTypeLabels: Record<OrganizationType, string> = {
  insurer: 'Crop insurer',
  lender: 'Lender',
  ngo_agency: 'NGO or agency',
  other: 'Other',
};

export const hectareRanges = ['under_50', '50_500', '500_5000', 'over_5000', 'unsure'] as const;
export type HectareRange = (typeof hectareRanges)[number];

export const hectareLabels: Record<HectareRange, string> = {
  under_50: 'Under 50 ha',
  '50_500': '50 to 500 ha',
  '500_5000': '500 to 5,000 ha',
  over_5000: 'Over 5,000 ha',
  unsure: 'Not sure yet',
};

export const cropOptions = [
  'cotton',
  'wheat',
  'rice',
  'maize',
  'sugarcane',
  'soybean',
  'other',
] as const;
export type CropOption = (typeof cropOptions)[number];

/**
 * Early access signup schema.
 * Shared by the client form (react hook form) and the route handler, so both
 * sides validate with exactly the same rules.
 */
export const earlyAccessSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Enter your full name.' })
    .max(120, { message: 'Keep your name under 120 characters.' }),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(200, { message: 'That email address is too long.' })
    .pipe(z.email({ message: 'Enter a valid work email address.' })),

  organization: z
    .string()
    .trim()
    .min(2, { message: 'Enter your company or organization.' })
    .max(160, { message: 'Keep the name under 160 characters.' }),

  organizationType: z.enum(organizationTypes, {
    message: 'Choose an organization type.',
  }),

  regionOfInterest: z
    .string()
    .trim()
    .min(2, { message: 'Tell us which region you care about.' })
    .max(200, { message: 'Keep the region under 200 characters.' }),

  cropsOfInterest: z.array(z.enum(cropOptions)).min(1, { message: 'Choose at least one crop.' }),

  hectares: z.enum(hectareRanges, { message: 'Choose an approximate range.' }),

  useCase: z
    .string()
    .trim()
    .min(20, { message: 'A couple of sentences is enough, at least 20 characters.' })
    .max(2000, { message: 'Keep it under 2,000 characters.' }),

  consent: z.boolean().refine((value) => value === true, {
    message: 'We need your consent to contact you about early access.',
  }),

  // Hidden spam trap. Left empty by real users, filled by bots.
  honeypot: z.string().max(0, { message: 'Invalid submission.' }),

  // Set when the form mounts. The server checks that enough time passed.
  formStartedAt: z.number({ message: 'Invalid submission.' }).int().positive(),
});

export type EarlyAccessInput = z.input<typeof earlyAccessSchema>;
export type EarlyAccessData = z.output<typeof earlyAccessSchema>;
