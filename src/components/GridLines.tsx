import { cn } from '@/lib/utils';

/**
 * Decorative vertical grid lines behind open sections.
 * Purely visual, hidden from assistive technology.
 */
export function GridLines({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('grid-overlay pointer-events-none absolute inset-0', className)}
    />
  );
}
