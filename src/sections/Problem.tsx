import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { problemItems } from '@/lib/content';

export function Problem() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="scroll-mt-24 pb-16 lg:pb-24">
      <div className="container-page">
        <div className="panel p-6 sm:p-10 lg:p-14">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                titleId="problem-title"
                eyebrow="The problem"
                title="It is hard to see what is happening on every farm."
                lead="When teams need to assess many farms, local visits and reports can take time. Satellite images may offer a wider view, but they need careful interpretation before they can help guide a decision."
              />
            </div>

            <ol className="lg:pt-2">
              {problemItems.map((item) => (
                <li
                  key={item.index}
                  className="border-t border-line py-8 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <Reveal>
                    <div className="flex gap-5 sm:gap-7">
                      <span className="pt-1 font-mono text-xs text-ink-2 tabular">
                        {item.index}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-xl leading-snug tracking-tight text-ink sm:text-2xl">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2 sm:text-base">
                          {item.body}
                        </p>
                        <p className="mono-label mt-4 text-brand">{item.note}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
