import { useRef, useCallback } from 'react';
import { createMinDuration } from '../lib/minDuration';

/**
 * React hook: ensures a loading state stays visible for at least `minDuration` ms.
 *
 * Usage:
 *   const minDur = useMinDuration(600);
 *   minDur.start();
 *   setLoading(true);
 *   // ... fetch data ...
 *   minDur.end(() => setLoading(false));
 */

export function useMinDuration(minDuration = 600) {
  const ref = useRef(createMinDuration(minDuration));
  // Keep minDuration in sync if caller ever changes it (rare)
  ref.current.start = useCallback(() => {
    ref.current.cancel();
    ref.current = createMinDuration(minDuration);
    ref.current.start();
  }, [minDuration]);

  const start = useCallback(() => {
    ref.current.start();
  }, []);

  const end = useCallback(
    (onDone: () => void) => {
      ref.current.end(onDone);
    },
    []
  );

  return { start, end };
}
