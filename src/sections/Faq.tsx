import { FaqAccordion } from '@/components/FaqAccordion';
import { SectionHeading } from '@/components/SectionHeading';

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 py-16 lg:py-24">
      <div className="container-page">
        <div className="panel p-6 sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                titleId="faq-title"
                eyebrow="FAQ"
                title="Questions we get asked."
                lead="Straight answers, including the ones where the answer is not final yet."
              />
            </div>

            <FaqAccordion />
          </div>
        </div>
      </div>
    </section>
  );
}
