import React, { useCallback, useEffect, useRef, useMemo } from "react";
import { createMinDuration } from "../lib/minDuration";

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
  const minDurationRef = useRef(createMinDuration(minDuration));

  useEffect(() => {
    minDurationRef.current.cancel();
    minDurationRef.current = createMinDuration(minDuration);

    return () => {
      minDurationRef.current.cancel();
    };
  }, [minDuration]);

  const start = useCallback(() => {
    minDurationRef.current.start();
  }, []);

  const end = useCallback((onDone: () => void) => {
    minDurationRef.current.end(onDone);
  }, []);

  return useMemo(() => ({ start, end }), [start, end]);
}
