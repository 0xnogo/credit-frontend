import { useRouter } from 'next/router';
import { useLendingPairsInfo } from './lendingPairs';
import { CreditPair, CreditPool } from 'types/credit';
import BigNumber from 'bignumber.js';
import { CreditPairQuery } from '@graph/core/types';
import { CreditPosition } from './creditPositions';

export const calcMaturationPercentage = (
  poolStart: number,
  maturity: number,
) => {
  const now = new Date().getTime() / 1000;
  if (now > maturity) return 100;
  const total = maturity - poolStart;
  const elapsed = now - poolStart;
  return (elapsed / total) * 100;
};

export const isPoolMatured = (maturity: number) => {
  return maturity < new Date().getTime() / 1000;
};

export const usePairFromAddresses = (
  asset: string | undefined,
  collateral: string | undefined,
): CreditPair | undefined => {
  const { data: creditPairs } = useLendingPairsInfo();
  return creditPairs?.find(
    (pair) =>
      pair?.asset.address === asset && pair?.collateral.address === collateral,
  );
};

export const getUtilizationRateDataForChart = (
  X: BigNumber,
  Y: BigNumber,
  Z: BigNumber,
) => {
  const unscaledY = Y?.div(2 ** 32);
  const unscaledZ = Z?.div(2 ** 25);

  const increment = X?.times(0.1);
  const K = X?.times(unscaledY || 0).times(unscaledZ || 0);

  const decrementArray = (
    xValue: BigNumber | undefined,
    increment: BigNumber | undefined,
  ) => {
    const array = [];
    let currentValue = xValue;

    while (currentValue?.gte(0)) {
      array.push(currentValue);
      currentValue = currentValue.minus(increment || 0);
    }

    return array;
  };

  const inPool = decrementArray(X, increment);

  const utilRate = inPool.map((value) =>
    new BigNumber(X || 0).minus(value).div(X || 1),
  );

  const xDecrease = inPool.map((value) => new BigNumber(X || 0).minus(value));

  const yMax = xDecrease.map((value) =>
    new BigNumber(K || 0)
      .div(
        new BigNumber(new BigNumber(X || 0).minus(value)).times(unscaledZ || 0),
      )
      .minus(unscaledY || 0),
  );

  const yMin = yMax.map((yValue) => yValue.div(16));

  const interestRateMin = [];
  const interestRateMax = [];
  const interestRateAverage = [];

  for (let i = 0; i < utilRate?.length; i++) {
    const yMinValue = yMin[i];
    const yMaxValue = yMax[i];
    const xDecreaseValue = new BigNumber(xDecrease[i]);

    if (xDecreaseValue.isZero()) {
      interestRateMin.push('#DIV/0!');
      interestRateMax.push('#DIV/0!');
      interestRateAverage.push('#N/A');
    } else {
      const rateMin = yMinValue.times(31556926).div(xDecreaseValue);
      const rateMax = yMaxValue.times(31556926).div(xDecreaseValue);
      interestRateMin.push(rateMin.toNumber());
      interestRateMax.push(rateMax.toNumber());
      const average = rateMin.plus(rateMax).div(2).toNumber();
      interestRateAverage.push(average);
    }
  }

  return {
    xAxis: utilRate,
    yAxis: interestRateAverage,
  };
};

export const getPairFromQuery = () => {
  const router = useRouter();
  const { query } = router;

  const { asset, collateral } = Array.isArray(query?.addresses)
    ? { asset: query?.addresses[0], collateral: query?.addresses[1] }
    : { asset: undefined, collateral: undefined };

  return { asset, collateral };
};
