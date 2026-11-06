/**
 * Structured copy for the site. Editing this file changes most of the words
 * on the page. Longer prose stays inside each section component.
 */

import { site } from './site';

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
    body: 'Clouds can hide the ground, so observations are checked for visibility and matched to the field boundaries supplied by a partner.',
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

export interface Metric {
  name: string;
  body: string;
}

export const metrics: Metric[] = [
  {
    name: 'Crop condition',
    body: 'A summary of signs that crops may be under stress, based on visible changes in the satellite images.',
  },
  {
    name: 'Change over time',
    body: 'How visible crop growth appears to change between usable observations during the season.',
  },
  {
    name: 'Possible flood impact',
    body: 'An estimate of how much of a selected field may be covered by water.',
  },
  {
    name: 'Estimated affected area',
    body: 'A preliminary estimate to help teams prioritize follow-up, not a confirmed insurance loss.',
  },
  {
    name: 'How clear the evidence is',
    body: 'A note about the quality of the observation, including factors such as cloud cover.',
  },
  {
    name: 'Observation date',
    body: 'When the satellite image was captured, so you can see how recent the information is.',
  },
];

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

/** Proposed AWS services for the future satellite-processing product. */
export const plannedAwsServices: AwsService[] = [
  {
    name: 'Amazon S3',
    purpose: 'Keep source satellite images and the field reports created from them.',
  },
  {
    name: 'AWS Lambda and Amazon EventBridge',
    purpose: 'Notice when new satellite images are available and start the next processing steps.',
  },
  {
    name: 'AWS Step Functions',
    purpose: 'Coordinate the multi-step image processing workflow and retry failed tasks.',
  },
  {
    name: 'AWS Batch',
    purpose:
      'Run large image-processing jobs when new observations arrive, scaling compute up and down as needed.',
  },
  {
    name: 'Amazon SageMaker',
    purpose: 'Develop and run models that estimate crop condition and possible flood impact.',
  },
  {
    name: 'Amazon RDS for PostgreSQL with PostGIS',
    purpose: 'Store field boundaries and results, and find results by location.',
  },
  {
    name: 'Amazon ECS with AWS Fargate',
    purpose: 'Run the customer-facing service without managing individual servers.',
  },
  {
    name: 'Amazon API Gateway',
    purpose: 'Provide a controlled way for customer systems to request reports.',
  },
  {
    name: 'Amazon CloudWatch and AWS Secrets Manager',
    purpose: 'Monitor service health and protect access credentials.',
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
    phase: 'First',
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
    phase: 'Later',
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
    phase: 'Later',
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
      'The product is designed to use open satellite observations from Sentinel-2 (European Space Agency) and Landsat (NASA and USGS). These datasets are publicly available; availability and image clarity vary by location and date.',
  },
  {
    question: 'How often is it updated?',
    answer:
      'There is no guaranteed daily update. Satellites revisit locations on their own schedules, and clouds may make an image unusable. Reports will show the date of the observation they use.',
  },
  {
    question: 'How accurate is it?',
    answer:
      'We do not yet have validated accuracy figures to publish. The pilot compares estimates with field observations and partner records before we make performance claims.',
  },
  {
    question: 'Which regions and crops do you support?',
    answer: `Fieldline covers field crops worldwide, including ${site.coverage.crops}. Tell us your region and crop so we can assess whether it fits.`,
  },
  {
    question: 'Can I upload my own field boundaries?',
    answer:
      'Field boundaries identify the land to assess. The product works with partner-supplied field locations; accepted formats and pilot terms are agreed with participants.',
  },
  {
    question: 'How is my data handled?',
    answer:
      'Data access and handling are agreed with pilot partners before their information is processed. Signup data is stored securely in Amazon DynamoDB and used only to contact you about early access.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Pricing and pilot terms are being finalized while we iterate on the final changes. We will discuss scope directly with interested organizations.',
  },
  {
    question: 'Do you need ground truth?',
    answer:
      'Ground observations and partner records will be important for checking whether the estimates are useful. Any data-sharing scope would be agreed before a pilot.',
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

/** Illustrative values only; they are not real pilot observations or validated results. */
export const exampleReport = [
  {
    label: 'Crop stress',
    value: '0.62 / 1',
    explanation: 'Example scale: higher values mean more visible stress.',
  },
  {
    label: 'Field area possibly under water',
    value: '31%',
    explanation: 'Illustrative estimate from a made-up example field.',
  },
  {
    label: 'Estimated affected area',
    value: '24.5%',
    explanation: 'A preliminary estimate, not a confirmed loss.',
  },
  {
    label: 'Evidence clarity',
    value: '81%',
    explanation: 'Illustrative confidence indicator, not a measured accuracy rate.',
  },
] as const;
