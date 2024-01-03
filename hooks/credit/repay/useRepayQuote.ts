import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

export function useRepayQuote(
  debt: BigNumber,
  collateral: BigNumber,
  amount0: string,
  amount1: string,
  priorityAsset: 0 | 1,
) {
  return useMemo(() => {
    const amount0BN = new BigNumber(amount0);
    const amount1BN = new BigNumber(amount1);
    if (priorityAsset === 0) {
      return {
        amount0: amount0BN,
        amount1: amount0BN.div(debt).times(collateral),
      };
    } else {
      return {
        amount0: amount1BN.div(collateral).times(debt),
        amount1: amount1BN,
      };
    }
  }, [amount0, amount1, debt, collateral, priorityAsset]);
}
