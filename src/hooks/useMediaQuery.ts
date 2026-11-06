'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * SSR safe media query hook.
 *
 * Implemented with useSyncExternalStore so the first client snapshot is read
 * from the browser during hydration instead of being set inside an effect.
 * The server always reports false.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void): (() => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback((): boolean => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback((): boolean => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
