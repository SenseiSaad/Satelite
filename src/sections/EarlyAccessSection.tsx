import { EarlyAccessForm } from '@/components/EarlyAccessForm';
import { Reveal, RevealGroup } from '@/components/Reveal';
import { earlyAccessBenefits } from '@/lib/content';

export function EarlyAccessSection() {
  return (
    <section
      id="early-access"
      aria-labelledby="early-access-title"
      className="on-ink scroll-mt-24 bg-ink text-page"
    >
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:py-24">
        <div>
          <Reveal>
            <p className="eyebrow text-page/70">Early access</p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              id="early-access-title"
              className="mt-4 text-3xl leading-[1.05] tracking-tight text-page sm:text-4xl lg:text-5xl"
            >
              Join the pilot.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-page/80 sm:text-lg">
              We are speaking with organizations worldwide. Tell us where you work and what you
              need to decide; we will follow up to discuss whether an evaluation is a fit.
            </p>
          </Reveal>

          <RevealGroup className="mt-10 space-y-5" delay={0.18} stagger={0.06}>
            {earlyAccessBenefits.map((benefit) => (
              <div key={benefit.index} className="flex gap-4 border-t border-white/15 pt-5">
                <span className="font-mono text-xs text-page/60 tabular">{benefit.index}</span>
                <div>
                  <h3 className="font-display text-lg tracking-tight text-page">{benefit.title}</h3>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-page/75">
                    {benefit.body}
                  </p>
                </div>
              </div>
            ))}
          </RevealGroup>
        </div>

        <div>
          <EarlyAccessForm />
        </div>
      </div>
    </section>
  );
}
