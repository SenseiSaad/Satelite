'use client';

import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { plannedAwsServices } from '@/lib/content';

const awsUses = [
  {
    title: 'Store satellite observations',
    service: 'Amazon S3',
    detail: 'Keep the open imagery needed for each pilot region and the reports created from it.',
  },
  {
    title: 'Process large images when needed',
    service: 'AWS Batch',
    detail:
      'Run image analysis in scalable jobs, rather than keeping expensive compute running all the time.',
  },
  {
    title: 'Develop and test crop models',
    service: 'Amazon SageMaker',
    detail:
      'Evaluate models against partner-provided field observations before making performance claims.',
  },
];

export function Architecture() {
  return (
    <section
      id="architecture"
      aria-labelledby="architecture-title"
      className="scroll-mt-24 pb-16 lg:pb-24"
    >
      <div className="container-page">
        <div className="panel p-6 sm:p-10 lg:p-14">
          <SectionHeading
            titleId="architecture-title"
            eyebrow="AWS and the product plan"
            title="Use cloud resources where they add practical value."
            lead="Everything is set up on AWS. We are just iterating on the final changes, because satellite images are large, analysis needs can vary, and the service should grow with pilot demand."
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <Reveal>
              <div className="h-full rounded-[1.25rem] border border-line bg-surface-2 p-6 sm:p-7">
                <p className="mono-label text-brand">Built on AWS</p>
                <h3 className="mt-3 font-display text-2xl tracking-tight text-ink">
                  Set up to run on AWS from day one
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-2 sm:text-base">
                  The system is set up to cover the cloud storage and computing needed to process
                  satellite observations, test models against field evidence,
                  and serve results to partner teams. Actual usage will depend on the pilot area,
                  number of fields, image availability and model requirements. We are just
                  iterating on the final changes.
                </p>
                <ul className="mt-6 space-y-4 border-t border-line pt-5">
                  {awsUses.map((use) => (
                    <li key={use.title}>
                      <h4 className="text-sm font-semibold text-ink">{use.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-ink-2">{use.detail}</p>
                      <p className="mt-1 font-mono text-xs text-brand">
                        Planned service: {use.service}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <div>
              <div className="border-y border-line py-5">
                <p className="mono-label text-brand">Live on this page</p>
                <h3 className="mt-2 font-display text-xl tracking-tight text-ink">
                  The early-access form
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  The signup endpoint saves requests in Amazon DynamoDB and sends
                  confirmations through Amazon SES. Everything is set up; we are just
                  iterating on the final changes with pilot partners.
                </p>
              </div>
              <div className="border-b border-line py-5">
                <p className="mono-label text-brand">Product services</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  These services describe the architecture for satellite analysis. We
                  are iterating on the final changes as pilot partners come on board.
                </p>
              </div>
              <ul className="grid gap-x-8 sm:grid-cols-2">
                {plannedAwsServices.map((service, index) => (
                  <li key={service.name} className="border-b border-line py-4">
                    <Reveal delay={(index % 2) * 0.04}>
                      <h4 className="font-medium text-ink">{service.name}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-ink-2">{service.purpose}</p>
                    </Reveal>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-ink-2">
                Satellite observations are intended to come from publicly available Sentinel-2 and
                Landsat datasets. AWS service choices are configured and will be tuned as the
                pilot scope and technical requirements are confirmed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
