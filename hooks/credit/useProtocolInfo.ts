import { useLendingPairsInfo } from '@functions/credit/lendingPairs';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

export function useProtocolInfo() {
  const { data: creditPairs = [], isValidating } = useLendingPairsInfo();

  return useMemo(() => {
    let supplyBalance = new BigNumber(0);
    let totalBorrow = new BigNumber(0);
    let collateralBalance = new BigNumber(0);
    let totalDue = new BigNumber(0);
    creditPairs.forEach((pair) => {
      pair.pools
        .filter(({ matured }) => !matured)
        .forEach((pool) => {
          supplyBalance = supplyBalance.plus(pool.assetReserveUSD);
          collateralBalance = collateralBalance.plus(pool.collateralReserveUSD);
          totalBorrow = totalBorrow.plus(pool.totalBorrowedUSD);
          totalDue = totalDue.plus(pool.totalDebtUSD);
        });
    });

    return {
      supplyBalance,
      totalBorrow,
      collateralBalance,
      totalDue,
    };
  }, [creditPairs, isValidating]);
}
