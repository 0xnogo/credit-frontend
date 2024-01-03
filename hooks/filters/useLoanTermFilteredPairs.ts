import { useMemo } from 'react';
import { CreditPair } from 'types/credit';

export function useLoanTermFilteredPairs(
  loanTermIndex: number,
  pairs: CreditPair[],
) {
  return useMemo(() => {
    return pairs.flatMap((pair) => {
      const pools = pair.pools;
      let filteredPools = [];
      if (loanTermIndex === 0) {
        filteredPools = pair.pools;
      } else if (loanTermIndex === 1) {
        filteredPools = pools.filter(
          (val) => Number(val.maturity) - Date.now() / 1000 <= 2628288,
        );
      } else {
        filteredPools = pools.filter(
          (val) => Number(val.maturity) - Date.now() / 1000 > 2628288,
        );
      }

      if (!filteredPools.length) return [];
      return { ...pair, pools: filteredPools };
    });
  }, [loanTermIndex, pairs]);
}
