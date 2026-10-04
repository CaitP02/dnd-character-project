import { useCallback, useEffect, useState } from 'react';
import { errorMessage, isCancel } from '../api/client.js';

/**
 * Runs `request(signal)` whenever `deps` change and tracks its state.
 * Earlier requests are aborted so stale responses never overwrite newer ones.
 */
export const useApi = (request, deps) => {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));
    request(controller.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (isCancel(error) || controller.signal.aborted) return;
        setState({ data: null, loading: false, error: { message: errorMessage(error), status: error?.response?.status } });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- callers pass the request's inputs as deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
};

/** True once `active` has stayed true for `delay` ms, e.g. while a sleeping free-tier server wakes up. */
export const useSlow = (active, delay = 3000) => {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!active) {
      setSlow(false);
      return undefined;
    }
    const timer = setTimeout(() => setSlow(true), delay);
    return () => clearTimeout(timer);
  }, [active, delay]);
  return slow;
};

export const useDebounced = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};
