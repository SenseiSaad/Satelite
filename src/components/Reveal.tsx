'use client';

import { Children, isValidElement, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

/** One entrance curve for the whole site. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const DURATION = 0.7;

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds. Keep delays and staggers under 0.08. */
  delay?: number;
  y?: number;
}

/**
 * Fades and lifts content into place once, when it enters the viewport.
 * Reduced motion renders the static final state.
 */
export function Reveal({ children, className, delay = 0, y = 18 }: RevealProps) {
  const reduce = useReducedMotionSafe();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: DURATION, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps extends RevealProps {
  /** Seconds between children. Under 0.08. */
  stagger?: number;
}

/**
 * Slides content up from behind an overflow mask. Reads as a clean cut,
 * no bounce. Used for section headings and the hero headline.
 */
export function MaskReveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotionSafe();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn('overflow-hidden', className)}
      initial={{ clipPath: 'inset(0% 0% 100% 0%)', y: 26, opacity: 0 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -70px 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Same as Reveal, but staggers each direct child.
 */
export function RevealGroup({
  children,
  className,
  delay = 0,
  stagger = 0.06,
  y = 18,
}: RevealGroupProps) {
  const reduce = useReducedMotionSafe();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const items = Children.toArray(children);

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {items.map((child, index) => (
        <motion.div
          key={isValidElement(child) && 'key' in child ? child.key : index}
          variants={{
            hidden: { opacity: 0, y },
            shown: { opacity: 1, y: 0 },
          }}
          transition={{ duration: DURATION, ease: EASE }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
