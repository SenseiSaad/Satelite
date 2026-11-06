'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { faqItems } from '@/lib/content';
import { useReducedMotionSafe } from '@/hooks/useReducedMotion';
import { EASE } from './Reveal';
import { cn } from '@/lib/utils';

/**
 * Accessible accordion. Each question is a button with aria-expanded and
 * aria-controls, the answer is a labelled region, and the height animates
 * smoothly. One panel open at a time.
 */
export function FaqAccordion() {
  const reduce = useReducedMotionSafe();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-line">
      {faqItems.map((item, index) => {
        const expanded = open === index;
        const buttonId = `faq-question-${index}`;
        const panelId = `faq-answer-${index}`;

        return (
          <div key={item.question} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
                className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors duration-200 hover:text-brand"
              >
                <span className="font-display text-base leading-snug tracking-tight text-ink sm:text-lg">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-transform duration-300 ease-entrance',
                    expanded && 'rotate-45 border-brand text-brand',
                  )}
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 pr-8 text-sm leading-relaxed text-ink-2 sm:text-base">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
