import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Wordmark: a small field grid with one scored cell.
 */
export function Wordmark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={cn(
          'transition-transform duration-300 ease-entrance',
          compact ? 'h-[18px] w-[18px]' : 'h-6 w-6',
        )}
      >
        <rect
          x="1.5"
          y="1.5"
          width="21"
          height="21"
          rx="4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <line
          x1="8.5"
          y1="1.5"
          x2="8.5"
          y2="22.5"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.45"
        />
        <line
          x1="15.5"
          y1="1.5"
          x2="15.5"
          y2="22.5"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.45"
        />
        <line
          x1="1.5"
          y1="8.5"
          x2="22.5"
          y2="8.5"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.45"
        />
        <line
          x1="1.5"
          y1="15.5"
          x2="22.5"
          y2="15.5"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.45"
        />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="currentColor" />
      </svg>
      <span
        className={cn(
          'font-display font-semibold tracking-tight transition-all duration-300 ease-entrance',
          compact ? 'text-lg' : 'text-xl',
        )}
      >
        {site.name}
      </span>
    </span>
  );
}
