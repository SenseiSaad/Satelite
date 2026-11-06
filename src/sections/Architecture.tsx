'use client';

import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { awsPhases } from '@/lib/content';

const phaseNotes = [
  'Large imagery storage: source satellite observations are large, cheap and durable object storage comes first.',
  'Bursty batch compute: image analysis runs when new observations arrive, not continuously, so on-demand jobs fit better than always-on servers.',
  'Model development: crop condition and flood impact models are built and evaluated against field observations before any results are served.',
  'Geospatial queries: finding results by field or district needs a spatial database, planned as PostgreSQL with PostGIS.',
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
            title="A phased plan for cloud resources where they add value."
            lead="Northgate Labs is designed around AWS in three phases. Satellite images are large, analysis needs vary over the season, and this plan will grow with what the pilot proves is needed."
          />

          <div className="mt-10 space-y-8">
            {awsPhases.map((phase, phaseIndex) => (
              <div key={phase.name} className="border-y border-line py-6 first:border-t-0">
                <h3 className="font-display text-xl tracking-tight text-ink">{phase.name}</h3>
                <ul className="mt-4 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                  {phase.services.map((service, index) => (
                    <li key={service.name}>
                      <Reveal delay={((phaseIndex + index) % 4) * 0.03}>
                        <h4 className="font-medium text-ink">{service.name}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-ink-2">
                          {service.purpose}
                        </p>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Reveal>
            <div className="mt-8 rounded-[1.25rem] border border-line bg-surface-2 p-6">
              <h3 className="font-display text-lg tracking-tight text-ink">
                Why these service shapes fit
              </h3>
              <ul className="mt-4 space-y-2.5">
                {phaseNotes.map((note) => (
                  <li key={note} className="flex gap-2.5 text-sm leading-relaxed text-ink-2">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand"
                    />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <p className="mt-6 text-xs leading-relaxed text-ink-2">
            Scope and timing will be tuned with pilot partners.
          </p>
        </div>
      </div>
    </section>
  );
}
