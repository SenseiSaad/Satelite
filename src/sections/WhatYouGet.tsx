import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { exampleReport, metrics } from '@/lib/content';

export function WhatYouGet() {
  return (
    <section id="product" aria-labelledby="product-title" className="scroll-mt-24 pb-16 lg:pb-24">
      <div className="container-page">
        <div className="panel p-6 sm:p-10 lg:p-14">
          <SectionHeading
            titleId="product-title"
            eyebrow="What the product is designed to provide"
            title="A field report people can understand."
            lead="The aim is to turn satellite observations into a short summary: what may be happening, how much of a field could be affected, and when the image was captured."
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <Reveal>
              <div className="rounded-[1.25rem] border border-line bg-surface-2 p-5 sm:p-7">
                <p className="mono-label text-brand">Illustrative example only</p>
                <h3 className="mt-3 font-display text-2xl tracking-tight text-ink">
                  What a field report might say
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  These sample values are fictional and are not pilot results, measured accuracy, or
                  a promise of performance.
                </p>
                <dl className="mt-6 divide-y divide-line border-y border-line">
                  {exampleReport.map((item) => (
                    <div
                      key={item.label}
                      className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-4"
                    >
                      <div>
                        <dt className="text-sm font-medium text-ink">{item.label}</dt>
                        <dd className="mt-1 text-xs leading-relaxed text-ink-2">
                          {item.explanation}
                        </dd>
                      </div>
                      <dd className="font-mono text-sm font-medium text-ink sm:text-right">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div>
                <h3 className="font-display text-2xl tracking-tight text-ink">
                  Information that supports decisions
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-2 sm:text-base">
                  Each result should be dated and presented with its limitations, so a team can
                  decide whether to investigate further.
                </p>
                <dl className="mt-6 divide-y divide-line border-y border-line">
                  {metrics.map((metric) => (
                    <div key={metric.name} className="py-4">
                      <dt className="text-sm font-semibold text-ink">{metric.name}</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-ink-2">{metric.body}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
