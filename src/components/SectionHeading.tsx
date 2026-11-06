'use client';

import type { ReactNode } from 'react';
import { MaskReveal, Reveal } from './Reveal';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  /** Classes for the outer wrapper, use to control width in the grid. */
  className?: string;
  /** Offset the entrance by this many seconds. Under 0.08. */
  delay?: number;
  /** Id for the heading, use it as the section aria-labelledby target. */
  titleId?: string;
}

/**
 * Eyebrow label, mask revealed heading and optional lead paragraph.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
  delay = 0,
  titleId,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', className)}>
      <p className="eyebrow">{eyebrow}</p>
      <MaskReveal delay={delay} className="pt-1 pb-1">
        <h2
          id={titleId}
          className="text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl"
        >
          {title}
        </h2>
      </MaskReveal>
      {lead ? (
        <Reveal delay={delay + 0.08}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
