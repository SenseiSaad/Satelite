'use client';

import { useEffect, type ReactNode } from 'react';
import { loadGsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

/**
 * Lenis smooth scrolling, synced to the GSAP ticker so Lenis, ScrollTrigger
 * and every GSAP animation share one requestAnimationFrame loop.
 *
 * Disabled entirely under prefers-reduced-motion, where native scrolling and
 * scroll-behavior take over. GSAP and Lenis are imported dynamically so they
 * stay out of the first paint.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let disposed = false;
    let destroy: (() => void) | null = null;

    void (async () => {
      const [{ gsap, ScrollTrigger }, { default: Lenis }] = await Promise.all([
        loadGsap(),
        import('lenis'),
      ]);

      if (disposed) return;

      const lenis = new Lenis({ lerp: 0.12, autoRaf: false });

      const onScroll = (): void => ScrollTrigger.update();
      lenis.on('scroll', onScroll);

      const raf = (time: number): void => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const headerOffset = 88;

      const onClick = (event: MouseEvent): void => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) {
          return;
        }
        const target = event.target;
        if (!(target instanceof Element)) return;

        const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
        if (!anchor) return;

        const hash = anchor.getAttribute('href');
        if (!hash || hash === '#') return;

        const element = document.querySelector(hash);
        if (!element) return;

        event.preventDefault();
        lenis.scrollTo(element as HTMLElement, {
          offset: -headerOffset,
          duration: 1.1,
        });
        history.replaceState(null, '', hash);
      };

      document.addEventListener('click', onClick);

      destroy = () => {
        document.removeEventListener('click', onClick);
        lenis.off('scroll', onScroll);
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    })();

    return () => {
      disposed = true;
      destroy?.();
      destroy = null;
    };
  }, []);

  return <>{children}</>;
}
