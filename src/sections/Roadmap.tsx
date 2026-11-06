'use client';

import { motion } from 'motion/react';
import { Reveal, EASE } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { roadmapStages } from '@/lib/content';
import { useReducedMotionSafe } from '@/hooks/useReducedMotion';

export function Roadmap() {
  const reduce = useReducedMotionSafe();

  return (
    <section id="roadmap" aria-labelledby="roadmap-title" className="scroll-mt-24 pb-16 lg:pb-24">
      <div className="container-page">
        <div className="panel p-6 sm:p-10 lg:p-14">
          <SectionHeading
            titleId="roadmap-title"
            eyebrow="Roadmap"
            title="Validate the need before expanding."
            lead="This is a direction, not a dated delivery commitment. The first priority is to agree on a useful pilot and check the estimates against real field observations."
          />

          <div className="relative mt-12">
            {/* Rails. The active line draws in on entry. */}
            <span
              aria-hidden="true"
              className="absolute bottom-3 left-1.5 top-3 w-px bg-line lg:hidden"
            />
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 top-0 hidden h-px bg-line lg:block"
            />
            {reduce ? (
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 top-0 hidden h-px bg-brand lg:block"
              />
            ) : (
              <motion.span
                aria-hidden="true"
                className="absolute left-0 right-0 top-0 hidden h-px origin-left bg-brand lg:block"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '0px 0px -80px 0px' }}
                transition={{ duration: 1.1, ease: EASE }}
              />
            )}

            <ol className="grid gap-10 lg:grid-cols-3 lg:gap-10">
              {roadmapStages.map((stage) => (
                <li key={stage.number} className="relative pl-8 lg:pl-0 lg:pt-9">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-brand bg-surface lg:top-0 lg:-translate-y-1/2"
                  />

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="mono-label text-brand">Stage {stage.number}</span>
                    <span className="mono-label rounded-full border border-line px-2.5 py-1 text-ink-2">
                      {stage.phase}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl tracking-tight text-ink">
                    {stage.title}
                  </h3>
                  <p className="mono-label mt-1 text-ink-2">{stage.place}</p>

                  <p className="mt-4 text-sm leading-relaxed text-ink-2 sm:text-base">
                    {stage.body}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {stage.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          <Reveal>
            <p className="mt-12 border-t border-line pt-6 font-mono text-xs text-ink-2">
              The stages and features shown are proposed priorities; timing and final scope depend
              on partner feedback and pilot findings.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
