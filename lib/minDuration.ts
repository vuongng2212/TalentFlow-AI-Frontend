/**
 * Pure utility: ensures a loading state stays visible for at least `minDuration` ms.
 * Can be used in Zustand stores or directly in components.
 *
 * In a hook (React):  useMinDuration(ms) → wraps this with useRef
 * In a store (Zustand): createMinDuration(ms) → plain object
 */

export function createMinDuration(minDuration = 600) {
  let startTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function start() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    startTime = Date.now();
  }

  function end(callback: () => void) {
    const elapsed = Date.now() - startTime;
    const remaining = minDuration - elapsed;
    if (remaining > 0) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        callback();
        timer = null;
      }, remaining);
    } else {
      callback();
    }
  }

  function cancel() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  return { start, end, cancel };
}
