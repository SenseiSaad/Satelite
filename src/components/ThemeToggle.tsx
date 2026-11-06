'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'northgate-theme';

/**
 * The source of truth is data-theme on <html>, set before first paint by
 * the bootstrap script in layout.tsx. This store reads it and reacts to
 * changes, so the icon always matches the real theme.
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function getServerTheme(): Theme {
  return 'light';
}

/**
 * Light/dark switch. Writes the choice to localStorage and mirrors it to
 * <html data-theme>; icons use currentColor, so no extra variants needed.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  const toggle = useCallback((): void => {
    const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing: the switch still works for this session.
    }
  }, []);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
        'border border-line bg-surface text-ink',
        'transition-colors duration-200 hover:border-ink/35 hover:bg-surface-2',
        className,
      )}
    >
      {isDark ? (
        // Moon: dark theme is active.
        <svg aria-hidden="true" viewBox="0 0 18 18" className="h-4 w-4">
          <path
            d="M15.5 11.4A6.6 6.6 0 0 1 6.6 2.5 6.85 6.85 0 0 0 8.9 8a6.85 6.85 0 0 0 5.5 3.5 6.9 6.9 0 0 0 1.1-.1Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        // Sun: light theme is active.
        <svg aria-hidden="true" viewBox="0 0 18 18" className="h-4 w-4" fill="none">
          <circle cx="9" cy="9" r="3.4" stroke="currentColor" strokeWidth="1.6" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={9 + 5.4 * Math.cos(a)}
                y1={9 + 5.4 * Math.sin(a)}
                x2={9 + 7.4 * Math.cos(a)}
                y2={9 + 7.4 * Math.sin(a)}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      )}
    </button>
  );
}
