import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import * as LendMath from 'functions/credit/helpers/LendMath';
import { CreditPair as CreditPairMath } from 'functions/credit';

import { CreditPool, CreditPair } from 'types/credit';
import { useCurrentBlockTimestamp } from 'hooks/useCurrentBlockTimestamp';
import { ChainIds } from '@constants/chains';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';

export const useLendQuote = (
  pair: CreditPair,
  pool: CreditPool,
  assetIn: BigNumber,
  aprPercent: number,
) => {
  const { chainId } = useActiveWeb3React();

  const { X, Y, Z, maturity } = pool;
  const { fee, protocolFee, stakingFee } = pair;
  const current = new BigNumber(Date.now() / 1000 + 10);

  const { data: blockTimestamp = 0 } = useCurrentBlockTimestamp();

  const now =
    chainId === ChainIds.LOCALHOST ? new BigNumber(blockTimestamp) : current;

  const state = { x: X, y: Y, z: Z };

  const lendPercent = useMemo(
    () =>
      new BigNumber(aprPercent).div(100).times(new BigNumber(Math.pow(2, 32))),
    [aprPercent],
  );

  const { lendFees, xIncrease, yDecrease, zDecrease } = useMemo(
    () =>
      CreditPairMath.calculateLendGivenPercent(
        state,
        new BigNumber(maturity),
        assetIn,
        lendPercent,
        now,
        fee,
        protocolFee,
        stakingFee,
      ),
    [state, maturity, assetIn, lendPercent],
  );

  const cdp = useMemo(
    () =>
      CreditPairMath.calculateCdp(
        xIncrease.plus(X),
        zDecrease.plus(Z),
        pair.asset,
        pair.collateral,
      ),
    [xIncrease, zDecrease, X, Z],
  );
  const apr = useMemo(
    () => CreditPairMath.calculateApr(xIncrease.plus(X), Y.minus(yDecrease)),
    [xIncrease, yDecrease, X, Y],
  );

  const delState = { x: xIncrease, y: yDecrease, z: zDecrease };
  const insurance = useMemo(
    () => LendMath.getInsurance(state, delState, new BigNumber(maturity), now),
    [state, delState, maturity, now],
  );
  const bond = useMemo(
    () => LendMath.getBond(delState, new BigNumber(maturity), now),
    [state, delState, maturity, now],
  );
  return { lendFees, insurance, bond, cdp, apr, lendPercent };
};
