import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { CreditPair } from 'functions/credit';
import { PriorityAsset, Token } from 'types/assets';

type AddQuote = {
  debt: BigNumber;
  liquidityMinted: BigNumber;
  amount0: BigNumber;
  amount1: BigNumber;
  error: boolean;
  numDays: BigNumber;
  cdp: BigNumber;
  apr: BigNumber;
};

export const useQuoteAddLiquidityCredit = (
  priorityAmount: string,
  X: BigNumber,
  Y: BigNumber,
  Z: BigNumber,
  mat: number,
  totalSupply: BigNumber,
  feeStored: BigNumber,
  priorityAsset: PriorityAsset,
  expiredPool: boolean,
  asset: Token,
  collateral: Token,
) => {
  return useMemo((): AddQuote => {
    if (!priorityAmount || expiredPool) {
      return {
        debt: new BigNumber('0'),
        liquidityMinted: new BigNumber('0'),
        amount0: new BigNumber('0'),
        amount1: new BigNumber('0'),
        error: false,
        numDays: new BigNumber('0'),
        cdp: new BigNumber('0'),
        apr: new BigNumber('0'),
      };
    }
    const state = {
      x: new BigNumber(X),
      y: new BigNumber(Y),
      z: new BigNumber(Z),
    };
    const maturity = new BigNumber(mat);
    const totalLiquidity = new BigNumber(totalSupply);
    const amountIn =
      priorityAsset === 0
        ? new BigNumber(priorityAmount).times(Math.pow(10, asset.decimals))
        : new BigNumber(priorityAmount).times(
            Math.pow(10, collateral.decimals),
          );
    const now = new BigNumber(Math.round(new Date().getTime() / 1000));
    const feeStoredBN = new BigNumber(feeStored || 0);

    const { liquidityOut, dueOut, assetIn, xIncrease, yIncrease, zIncrease } =
      priorityAsset === 0
        ? CreditPair.calculateLiquidityGivenAsset(
            state,
            maturity,
            totalLiquidity,
            amountIn,
            now,
            feeStoredBN,
          )
        : CreditPair.calculateLiquidityGivenCollateral(
            state,
            maturity,
            totalLiquidity,
            amountIn,
            now,
            feeStoredBN,
          );
    const cdp = CreditPair.calculateCdp(assetIn, zIncrease, asset, collateral);
    const apr = CreditPair.calculateApr(
      xIncrease.plus(state.x),
      yIncrease.plus(state.y),
    );

    return {
      debt: dueOut.debt,
      liquidityMinted: liquidityOut,
      amount0: assetIn,
      amount1: dueOut.collateral,
      error: false,
      numDays: maturity.minus(now).div(3600 * 24),
      cdp: cdp,
      apr: apr,
    };
  }, [
    priorityAmount,
    X,
    Y,
    Z,
    mat,
    totalSupply,
    feeStored,
    priorityAsset,
    expiredPool,
    asset,
    collateral,
  ]);
};
