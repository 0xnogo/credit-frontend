import { useMemo } from 'react';
import { CreditPair } from 'types/credit';

export function useMaturityFilteredPairs(
  isActive: boolean,
  pairs: CreditPair[],
) {
  return useMemo(() => {
    return pairs.flatMap((pair) => {
      const pools = pair.pools;
      const filteredPools = pools.filter(
        (val) => Number(val.maturity) > Date.now() / 1000 === isActive,
      );

      if (!filteredPools.length) return [];
      return { ...pair, pools: filteredPools };
    });
  }, [isActive, pairs]);
}
