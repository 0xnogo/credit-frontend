import { CreditPair, CreditPool } from 'types/credit';
import { useMemo } from 'react';

/////////////////////////////////////// HOOKS /////////////////////////////////////////////////////

export function useLendingPoolsByMaturity(pair: CreditPair) {
  return useMemo(() => {
    let poolsByMaturity: { [maturity: number]: CreditPool } = {};
    pair?.pools &&
      pair.pools.forEach((pool) => {
        poolsByMaturity[pool.maturity] = pool;
      });

    return poolsByMaturity;
  }, [pair]);
}

export function useActiveLendingPoolsByMaturity(pair: CreditPair) {
  return useMemo(() => {
    let poolsByMaturity: { [maturity: number]: CreditPool } = {};
    pair?.pools &&
      pair.pools.forEach((pool) => {
        if (Number(pool.maturity) > Date.now() / 1000) {
          poolsByMaturity[pool.maturity] = pool;
        }
      });

    return poolsByMaturity;
  }, [pair]);
}
