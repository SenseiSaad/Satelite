'use client';

import { useEffect, useLayoutEffect, useState } from 'react';

/**
 * Runs the effect before paint on the client and falls back to useEffect on
 * the server, so the reduced motion branch is settled before the first paint
 * and hydration never sees a different tree.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Reduced motion preference for animation components.
 *
 * Returns false during server rendering and during hydration, then flips to
 * the real value before paint. Components can branch on it without causing
 * hydration mismatches, and static final states show with no flash.
 */
export function useReducedMotionSafe(): boolean {
  const [reduce, setReduce] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const list = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(list.matches);

    const onChange = (event: MediaQueryListEvent): void => setReduce(event.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, []);

  return reduce;
}
