import { GridLines } from '@/components/GridLines';
import { MaskReveal, Reveal } from '@/components/Reveal';
import { buttonClass } from '@/components/ui/Button';
import { site } from '@/lib/site';

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24"
    >
      <GridLines />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow">Satellite insights for agriculture</p>
          </Reveal>

          <MaskReveal delay={0.06} className="pt-2">
            <h1
              id="hero-title"
              className="text-4xl leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
            >
              See crop and flood risk, field by field.
            </h1>
          </MaskReveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">
              {site.name} is developing clear, field-by-field summaries of crop conditions and
              possible flood impacts using open satellite observations.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">
              The goal is to help insurers, agricultural lenders and public agencies decide where to
              look closer and what needs attention.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#early-access" className={buttonClass('primary')}>
                Request early access
              </a>
              <a
                href="#how-it-works"
                className="group inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-medium text-ink"
              >
                <span className="border-b border-ink/30 pb-0.5 transition-colors duration-200 group-hover:border-ink">
                  See how it works
                </span>
                <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3">
                  <path
                    d="M6 1v9M2.5 6.5 6 10l3.5-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.36}>
            <p className="mt-10 border-t border-line pt-5 font-mono text-xs text-ink-2">
              {site.coverage.scope}: {site.coverage.crops}; {site.coverage.regions}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.18}>
          <aside
            aria-label="Fieldline in brief"
            className="rounded-[1.25rem] border border-line bg-surface p-6 sm:p-8"
          >
            <p className="mono-label text-brand">A practical early-warning view</p>
            <h2 className="mt-3 max-w-lg font-display text-2xl leading-tight tracking-tight text-ink sm:text-3xl">
              From a satellite image to a clearer next step.
            </h2>
            <dl className="mt-7 divide-y divide-line">
              <div className="grid gap-1 py-4 first:pt-0 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <dt className="text-sm font-medium text-ink">What it looks at</dt>
                <dd className="text-sm leading-relaxed text-ink-2">
                  Crop condition and possible flood impact
                </dd>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <dt className="text-sm font-medium text-ink">How it helps</dt>
                <dd className="text-sm leading-relaxed text-ink-2">
                  Prioritize follow-up and understand changes over time
                </dd>
              </div>
              <div className="grid gap-1 py-4 last:pb-0 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <dt className="text-sm font-medium text-ink">Product stage</dt>
                <dd className="text-sm leading-relaxed text-ink-2">
                  Early access: onboarding pilot partners
                </dd>
              </div>
            </dl>
            <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-ink-2">
              Satellite estimates are intended to support local knowledge and field checks, not
              replace them.
            </p>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
