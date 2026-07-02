import { useState, useEffect, useCallback } from 'react';

/**
 * A hook that simulates asynchronous data fetching for our mock data.
 * It enforces the Loading -> Success/Empty -> Error pattern.
 *
 * @param {any} data - The actual synchronous data to wrap.
 * @param {number} delay - How long to delay the response (ms).
 * @param {Array} deps - Dependencies that trigger a re-fetch (e.g. ID changing).
 */
export function useSimulatedFetch(data, delay = 800, deps = []) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSim = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      setError(null);
    }, delay);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...deps]);

  useEffect(() => {
    const cleanup = fetchSim();
    return cleanup;
  }, [fetchSim]);

  const retry = () => {
    fetchSim();
  };

  return { 
    isLoading, 
    data: isLoading ? null : data, 
    error, 
    retry 
  };
}
