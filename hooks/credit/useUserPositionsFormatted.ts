import { useBorrowedPositions, useLentPositions } from 'functions/credit';
import { useMemo } from 'react';
import { CreditPair, CreditPool } from 'types/credit';
import { useLiquidityPositions } from 'functions/liquidity/liquidityPairs';

export const useLentPositionsFormatted = (
  asset?: string,
  collateral?: string,
  maturity?: string | number,
) => {
  const swrObject = useLentPositions();
  const userLent = useMemo(() => {
    return (
      (swrObject.data as CreditPair[])
        .filter(
          (pair) =>
            pair.asset.address.toLowerCase() === asset?.toLowerCase() &&
            pair.collateral.address.toLowerCase() === collateral?.toLowerCase(),
        )
        .flatMap((pair: CreditPair) =>
          pair.pools.flatMap((pool: CreditPool, idx: number) =>
            Number(maturity) !== Number(pool.maturity)
              ? []
              : pool.creditedPools?.flatMap((positionData, index: number) => ({
                  id: pair.address + pool.maturity + idx + index,
                  pair,
                  pool: { ...pool, ...positionData, index: index },
                })),
          ),
        ) || []
    );
  }, [swrObject.data, asset, collateral, maturity]);

  return { ...swrObject, data: userLent };
};

export const useBorrowPositionsFormatted = (
  asset?: string,
  collateral?: string,
  maturity?: string | number,
) => {
  const swrObject = useBorrowedPositions();
  const userBorrowed = useMemo(() => {
    return (
      (swrObject.data as CreditPair[])
        .filter(
          (pair) =>
            pair.asset.address.toLowerCase() === asset?.toLowerCase() &&
            pair.collateral.address.toLowerCase() === collateral?.toLowerCase(),
        )
        .flatMap((pair: CreditPair) =>
          pair.pools.flatMap((pool: CreditPool, index: number) =>
            Number(maturity) !== Number(pool.maturity)
              ? []
              : pool.dues?.map((due, dueIndex: number) => ({
                  id: pair.address + pool.maturity + index + dueIndex,
                  pair,
                  pool,
                  due,
                })),
          ),
        ) || []
    );
  }, [swrObject.data, asset, collateral, maturity]);

  return { ...swrObject, data: userBorrowed };
};

export const useLiquidityPositionsFormatted = (
  asset?: string,
  collateral?: string,
  maturity?: string | number,
) => {
  const swrObject = useLiquidityPositions();

  const userLP = useMemo(() => {
    return (
      (swrObject.data as CreditPair[])
        .filter(
          (pair) =>
            pair.asset.address.toLowerCase() === asset?.toLowerCase() &&
            pair.collateral.address.toLowerCase() === collateral?.toLowerCase(),
        )
        .flatMap((pair: CreditPair) =>
          pair.pools.flatMap((pool: CreditPool, index: number) =>
            Number(maturity) !== Number(pool.maturity)
              ? []
              : pool.lps?.flatMap((lp, lpIndex: number) => ({
                  id: pair.address + pool.maturity + index + lpIndex,
                  pair,
                  pool,
                  lp,
                })),
          ),
        ) || []
    );
  }, [swrObject.data, asset, collateral, maturity]);

  return { ...swrObject, data: userLP };
};

export const useUserTotalPositions = (asset: string, collateral: string) => {
  const { data: borrowedPositions } = useBorrowPositionsFormatted(
    asset,
    collateral,
  );
  const { data: liqPositions } = useLiquidityPositionsFormatted(
    asset,
    collateral,
  );
  const { data: lentPositions } = useLentPositionsFormatted(asset, collateral);

  return borrowedPositions.length + liqPositions.length + lentPositions.length;
};
