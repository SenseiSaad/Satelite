import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { reportFormat } from '@/lib/content';

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

          <div className="mt-10">
            <Reveal>
              <div className="rounded-[1.25rem] border border-line bg-surface-2 p-5 sm:p-7">
                <p className="mono-label text-brand">Intended report format</p>
                <h3 className="mt-3 font-display text-2xl tracking-tight text-ink">
                  What a field report will contain
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">
                  This is the format we are designing with pilot partners. It shows what each
                  report will cover; no values are shown because no pilot results have been
                  published yet.
                </p>
                <dl className="mt-6 divide-y divide-line border-y border-line">
                  {reportFormat.map((item) => (
                    <div key={item.label} className="py-4">
                      <dt className="text-sm font-semibold text-ink">{item.label}</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-ink-2">{item.body}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-xs leading-relaxed text-ink-2">
                  Reports are intended to be dated and presented with their limitations, so a team
                  can decide whether to investigate further.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
