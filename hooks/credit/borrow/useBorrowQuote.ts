import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { CreditPair as CreditPairMath } from 'functions/credit';
import { CreditPool, CreditPair } from 'types/credit';
import { useCurrentBlockTimestamp } from 'hooks/useCurrentBlockTimestamp';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { ChainIds } from '@constants/chains';

const defaultParams = {
  assetOut: new BigNumber(0),
  borrowFees: new BigNumber(0),
  dueOut: { debt: new BigNumber(0), collateral: new BigNumber(0) },
  xDecrease: new BigNumber(0),
  yIncrease: new BigNumber(0),
  zIncrease: new BigNumber(0),
};

export const useBorrowQuote = (
  pair: CreditPair,
  pool: CreditPool,
  assetOut: BigNumber,
  aprPercent: number,
) => {
  const { chainId } = useActiveWeb3React();

  const { X, Y, Z, maturity } = pool;
  const { fee, protocolFee, stakingFee } = pair;
  const now = useMemo(() => new BigNumber(Date.now() / 1000 + 10), []);

  const { data: blockTimestamp = 0 } = useCurrentBlockTimestamp();

  const borrowPercent = useMemo(
    () =>
      new BigNumber(aprPercent).div(100).times(new BigNumber(Math.pow(2, 32))),
    [aprPercent],
  );

  const { borrowFees, xDecrease, yIncrease, zIncrease, dueOut, isInvalid } =
    useMemo(() => {
      try {
        if (!assetOut.gt(0)) return { isInvalid: false, ...defaultParams };
        const state = { x: X, y: Y, z: Z };
        const params = CreditPairMath.calculateBorrowGivenPercent(
          state,
          new BigNumber(maturity),
          assetOut,
          borrowPercent,
          chainId === ChainIds.LOCALHOST
            ? new BigNumber(blockTimestamp + 10)
            : now,
          fee,
          protocolFee,
          stakingFee,
        );
        return { ...params, isInvalid: false };
      } catch (error) {
        console.warn('error@useBorrowQuote', error);
        return {
          isInvalid: true,
          ...defaultParams,
        };
      }
    }, [
      X,
      Y,
      Z,
      maturity,
      assetOut,
      borrowPercent,
      fee,
      blockTimestamp,
      protocolFee,
      now,
      chainId,
    ]);

  const cdp = useMemo(
    () =>
      CreditPairMath.calculateCdp(
        X.minus(xDecrease),
        zIncrease.plus(Z),
        pair.asset,
        pair.collateral,
      ),
    [xDecrease, zIncrease, X, Z, pair.asset.decimals, pair.collateral.decimals],
  );
  const apr = useMemo(
    () => CreditPairMath.calculateApr(X.minus(xDecrease), yIncrease.plus(Y)),
    [X, xDecrease, yIncrease, Y],
  );

  return { borrowFees, dueOut, cdp, apr, borrowPercent, isInvalid };
};
