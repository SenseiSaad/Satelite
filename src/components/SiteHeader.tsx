'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { buttonClass } from './ui/Button';
import { ThemeToggle } from './ThemeToggle';
import { Wordmark } from './Wordmark';
import { useReducedMotionSafe } from '@/hooks/useReducedMotion';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

const links = [
  { href: '#product', label: 'Product' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#early-access', label: 'Early access' },
];

export function SiteHeader() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    const onScroll = (): void => setCompact(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 h-16 border-b transition-colors duration-300 ease-entrance lg:h-[72px]',
        compact ? 'border-line bg-page shadow-soft' : 'border-transparent bg-transparent',
      )}
    >
      <div className="container-page flex h-full items-center justify-between gap-6">
        <a
          href="#top"
          aria-label={`${site.name} home`}
          className="rounded-full text-ink"
          onClick={() => setOpen(false)}
        >
          <Wordmark compact={compact} />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-sm text-sm text-ink-2 transition-colors duration-200 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#early-access"
            className={cn(buttonClass('primary', 'hidden px-5 py-2.5 text-[13px] sm:inline-flex'))}
          >
            Request early access
          </a>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <svg aria-hidden="true" viewBox="0 0 18 14" className="h-3.5 w-4.5">
              {open ? (
                <>
                  <path d="M2 2 16 12" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M16 2 2 12" stroke="currentColor" strokeWidth="1.6" />
                </>
              ) : (
                <>
                  <path d="M1 1h16" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M1 7h16" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M1 13h16" stroke="currentColor" strokeWidth="1.6" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            className="border-b border-line bg-page lg:hidden"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile" className="container-page py-4">
              <ul className="flex flex-col gap-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-2 py-2.5 text-base text-ink hover:bg-surface-2"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="mt-2">
                  <a
                    href="#early-access"
                    onClick={() => setOpen(false)}
                    className={buttonClass('primary', 'w-full')}
                  >
                    Request early access
                  </a>
                </li>
                <li className="mt-3 flex items-center justify-center">
                  <ThemeToggle />
                </li>
              </ul>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
