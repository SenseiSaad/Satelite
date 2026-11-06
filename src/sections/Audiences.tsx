import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { audiences } from '@/lib/content';

export function Audiences() {
  return (
    <section
      id="audiences"
      aria-labelledby="audiences-title"
      className="scroll-mt-24 pb-16 lg:pb-24"
    >
      <div className="container-page">
        <div className="panel p-6 sm:p-10 lg:p-14">
          <SectionHeading
            titleId="audiences-title"
            eyebrow="Who it may help"
            title="One shared view of field conditions."
            lead="Different teams ask different questions. Northgate Labs gives them a common, dated starting point for those conversations."
          />

          <div className="mt-10 divide-y divide-line border-y border-line">
            {audiences.map((audience, index) => (
              <Reveal key={audience.id} delay={index * 0.05}>
                <article className="grid gap-5 py-7 sm:grid-cols-[14rem_1fr] sm:gap-10">
                  <div>
                    <p className="mono-label text-brand">{audience.label}</p>
                    <h3 className="mt-2 font-display text-xl tracking-tight text-ink sm:text-2xl">
                      {audience.title}
                    </h3>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 md:gap-8">
                    <div>
                      <h4 className="text-sm font-semibold text-ink">The question</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{audience.job}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-ink">The intended information</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{audience.output}</p>
                      <p className="mt-3 text-xs leading-relaxed text-ink-2">{audience.extra}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-ink-2">
            These are intended use cases, not current customer deployments or validated outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}
