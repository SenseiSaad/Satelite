/**
 * Structured copy for the site. Editing this file changes most of the words
 * on the page. Longer prose stays inside each section component.
 */

export interface ProblemItem {
  index: string;
  title: string;
  body: string;
  note: string;
}

export const problemItems: ProblemItem[] = [
  {
    index: '01',
    title: 'Checking damage one field at a time is slow',
    body: 'After a flood or dry spell, insurers may need to inspect many farms before they can understand the scale of damage. Travel and access can delay those checks.',
    note: 'A satellite view can help teams decide where an in-person visit matters most.',
  },
  {
    index: '02',
    title: 'Lenders have little information about field conditions',
    body: 'A loan team may know the borrower but have limited information about what is happening on the land during a growing season.',
    note: 'Regular field-level observations could add context to portfolio reviews.',
  },
  {
    index: '03',
    title: 'Large-area assessments are hard to coordinate',
    body: 'Public agencies and relief teams need to understand which areas may be affected, while field access and local reports are still catching up.',
    note: 'A broad satellite-based view can help teams prioritize follow-up checks.',
  },
];

export interface Step {
  number: string;
  label: string;
  title: string;
  body: string;
  detail: string;
}

export const steps: Step[] = [
  {
    number: '01',
    label: 'Look',
    title: 'Use regularly updated satellite observations',
    body: 'We start with open satellite images from sources such as Sentinel-2 and Landsat, which record the same places repeatedly over time.',
    detail: 'The images are free to access; processing them still takes computing resources.',
  },
  {
    number: '02',
    label: 'Check',
    title: 'Focus on the fields and usable observations',
    body: 'Field boundary data and observations are supplied by a partner, and observations are checked for visibility before they are summarized.',
    detail: 'Unclear observations should be treated cautiously, not as certain results.',
  },
  {
    number: '03',
    label: 'Summarize',
    title: 'Turn observations into a field report',
    body: 'The planned product will summarize signs of crop stress and possible flood impact for each field, together with the observation date and an indication of uncertainty.',
    detail: 'These estimates are decision support, not a replacement for field checks.',
  },
  {
    number: '04',
    label: 'Share',
    title: 'Give teams information they can act on',
    body: 'The intended product will make summaries available through a simple dashboard and, for teams that need it, a connection to their own software.',
    detail: 'Pilot requirements will help determine the first delivery format.',
  },
];
/**
 * Sections of the intended field report. Described as format only: no
 * example values, because no pilot results have been published yet.
 */
export const reportFormat = [
  {
    label: 'Crop condition',
    body: 'A summary of signs that crops may be under stress, based on visible changes in the satellite images.',
  },
  {
    label: 'Change over time',
    body: 'How visible crop growth appears to change between usable observations during the season.',
  },
  {
    label: 'Possible flood impact',
    body: 'An estimate of how much of a selected field may be covered by water.',
  },
  {
    label: 'Estimated affected area',
    body: 'A preliminary estimate to help teams prioritize follow-up, not a confirmed insurance loss.',
  },
  {
    label: 'How clear the evidence is',
    body: 'A note about the quality of the observation, including factors such as cloud cover.',
  },
  {
    label: 'Observation date',
    body: 'When the satellite image was captured, so you can see how recent the information is.',
  },
] as const;


export interface Audience {
  id: string;
  label: string;
  title: string;
  job: string;
  output: string;
  extra: string;
}

export const audiences: Audience[] = [
  {
    id: 'insurers',
    label: 'Crop insurers',
    title: 'See where a claim may need attention',
    job: 'Use satellite-based information to help prioritize which reported losses need an in-person review.',
    output: 'A field-level summary of crop condition, possible water coverage and image date.',
    extra: 'The information is intended to support, not replace, an adjuster’s assessment.',
  },
  {
    id: 'lenders',
    label: 'Agricultural lenders',
    title: 'Follow field conditions during a loan',
    job: 'Add context about crop conditions when reviewing agricultural loans and portfolios.',
    output: 'A dated summary of visible crop changes for the fields in a portfolio.',
    extra: 'Teams provide the field locations they want included in an evaluation.',
  },
  {
    id: 'agencies',
    label: 'NGOs and public agencies',
    title: 'Understand possible impact across an area',
    job: 'Build an early overview of areas that may need attention after a flood or dry spell.',
    output: 'Area-level summaries of possible water coverage and crop condition.',
    extra: 'Use the overview to guide local checks and response planning.',
  },
];

export interface AwsService {
  name: string;
  purpose: string;
}

export interface AwsPhase {
  name: string;
  services: AwsService[];
}

/** Planned AWS services, grouped into a phased rollout. */
export const awsPhases: AwsPhase[] = [
  {
    name: 'Phase 1: pilot',
    services: [
      {
        name: 'Amazon S3',
        purpose:
          'Will store the open satellite imagery for each pilot region. Large images need cheap and durable object storage.',
      },
      {
        name: 'AWS Lambda and Amazon EventBridge',
        purpose:
          'Planned to notice when new satellite observations arrive and trigger the next processing step without a server running all day.',
      },
      {
        name: 'AWS Batch',
        purpose:
          'Will run the bursty image-analysis jobs. Compute scales up when observations arrive and down to zero when they do not.',
      },
      {
        name: 'Amazon DynamoDB and Amazon SES',
        purpose:
          'Planned intake for early-access requests, so the pilot pipeline starts from data that is already structured.',
      },
    ],
  },
  {
    name: 'Phase 2: modelling and data',
    services: [
      {
        name: 'Amazon SageMaker',
        purpose:
          'Will host the development and evaluation of crop condition and flood impact models against field observations.',
      },
      {
        name: 'Amazon RDS for PostgreSQL with PostGIS',
        purpose:
          'Planned home for field boundaries and results. Geospatial queries such as "fields inside this district" fit a spatial database.',
      },
      {
        name: 'AWS Step Functions',
        purpose:
          'Will coordinate the multi-step processing workflow and retry tasks that fail partway.',
      },
    ],
  },
  {
    name: 'Phase 3: delivery',
    services: [
      {
        name: 'Amazon ECS with AWS Fargate',
        purpose:
          'Will serve the report interface without managing individual servers.',
      },
      {
        name: 'Amazon API Gateway',
        purpose:
          'Planned front door for partner systems that request reports programmatically.',
      },
      {
        name: 'Amazon CloudWatch',
        purpose: 'Planned for monitoring service health and job outcomes.',
      },
      {
        name: 'AWS Secrets Manager',
        purpose: 'Planned for keeping access credentials out of code and configuration.',
      },
    ],
  },
];

export interface RoadmapStage {
  number: string;
  title: string;
  place: string;
  body: string;
  items: string[];
  phase: string;
}

export const roadmapStages: RoadmapStage[] = [
  {
    number: '01',
    title: 'Pilot',
    place: 'Global · major field crops',
    body: 'Work with pilot partners to compare satellite-based summaries with what is observed on the ground.',
    items: [
      'Compare crop condition summaries with field observations',
      'Estimate which fields may be affected by water',
      'Agree on a simple report format with pilot partners',
    ],
    phase: 'Planned',
  },
  {
    number: '02',
    title: 'Expansion',
    place: 'Based on pilot findings',
    body: 'Expand only after the first evaluations show where the product is useful.',
    items: [
      'Assess additional crops and regions',
      'Provide a clearer view of possible flood impact',
      'Summarize conditions across larger areas',
    ],
    phase: 'Planned',
  },
  {
    number: '03',
    title: 'Platform',
    place: 'Longer-term goal',
    body: 'Make it easier for organizations to review information and use it in their existing work.',
    items: [
      'A simple online way to review field reports',
      'Options to share results with existing tools',
      'Clear pricing and service information',
    ],
    phase: 'Planned',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'Where does the data come from?',
    answer:
      'Open satellite observations from Sentinel-2 and Landsat, plus other open datasets that are relevant to a region. All planned sources are publicly available; image clarity and availability vary by location and date.',
  },
  {
    question: 'How often is it updated?',
    answer:
      'Update frequency will align with satellite revisit times, and clouds can hide the ground between passes. We will agree the practical update rhythm with each pilot partner.',
  },
  {
    question: 'How accurate is it?',
    answer:
      'We will validate estimates against ground observations with pilot partners before publishing any accuracy figure. Until that work is done we make no accuracy claims.',
  },
  {
    question: 'Which regions and crops do you support?',
    answer: `Planned coverage: cotton, wheat, rice, maize and soybean, with regions chosen with pilot partners. Tell us your region and crop so we can assess whether it fits.`,
  },
  {
    question: 'Can I upload my own field boundaries?',
    answer:
      'That is planned. Partners will supply their field boundaries and we will agree accepted formats with the pilot group before any data processing starts.',
  },
  {
    question: 'How is my data handled?',
    answer:
      'The form only collects the fields you see on it. We use those details to contact you about the pilot and remove them on request. Full details are on the privacy page.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Pricing has not been decided. It will be decided with the pilot group, and early partners are expected to influence it.',
  },
  {
    question: 'Do you need ground truth?',
    answer:
      'Yes. Partner field observations will be used to validate the estimates, and any data-sharing scope is agreed with the partner before a pilot starts.',
  },
];

export const earlyAccessBenefits: { index: string; title: string; body: string }[] = [
  {
    index: '01',
    title: 'Discuss a pilot',
    body: 'Share your use case and region so we can assess whether an early evaluation is a fit.',
  },
  {
    index: '02',
    title: 'Shape the evaluation',
    body: 'Help define which fields, observations and comparisons would make an evaluation useful.',
  },
  {
    index: '03',
    title: 'A direct conversation',
    body: 'Discuss product needs and practical constraints with the team building Fieldline.',
  },
  {
    index: '04',
    title: 'Input on the roadmap',
    body: 'Crops, regions, outputs and pricing are decided with the pilot group before they are decided for everyone.',
  },
];
