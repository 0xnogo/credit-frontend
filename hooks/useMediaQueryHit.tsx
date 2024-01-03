import { useEffect, useState } from 'react';

export const useMediaQueryHit = (query: string, type: 'min' | 'max') => {
  const [matches, setMatches] = useState(false);

  const mediaQueryFn = (e: any) => setMatches(e.matches);

  useEffect(() => {
    window
      .matchMedia(`(${type}-width: ${query})`)
      .addEventListener('change', mediaQueryFn);
    return () => {
      window
        .matchMedia(`(${type}-width: ${query})`)
        .removeEventListener('change', mediaQueryFn);
    };
  }, []);

  return matches;
};
