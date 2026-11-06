import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { steps } from '@/lib/content';

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-24 py-16 lg:py-24">
      <div className="container-page">
        <div className="panel p-6 sm:p-10 lg:p-14">
          <SectionHeading
            titleId="how-title"
            eyebrow="How it works"
            title="A simple path from satellite image to field insight."
            lead="This is the process the product is designed to follow, explained without technical steps or unverified performance claims."
          />
          <ol className="mt-10 divide-y divide-line border-y border-line">
            {steps.map((step) => (
              <li key={step.number} className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr] sm:gap-6">
                <Reveal>
                  <span className="mono-label text-brand">Step {step.number}</span>
                </Reveal>
                <Reveal>
                  <div>
                    <h3 className="font-display text-xl tracking-tight text-ink sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-2 sm:text-base">
                      {step.body}
                    </p>
                    <p className="mt-3 text-sm font-medium text-brand">{step.detail}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
