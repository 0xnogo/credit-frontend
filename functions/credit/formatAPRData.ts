import { CREDIT_TOKEN_ADDRESS } from '@constants/contracts/addresses';
import { Token } from 'types/assets';
import BigNumber from 'bignumber.js';
import { CreditPool } from 'types/credit';
import { FarmQuery, CreditPairQuery } from '@graph/core/types';

export type Reward = {
  currency: Token;
  rewardPerSecond: BigNumber;
  rewardPerDay: BigNumber;
  rewardPrice: BigNumber;
};

export type LPFarming = {
  poolHash: string;
  accTokenPerShare: BigNumber;
  allocPoint: BigNumber;
  rewardAprPerHour: BigNumber;
  rewardAprPerDay: BigNumber;
  rewardAprPerMonth: BigNumber;
  rewardAprPerYear: BigNumber;
  rewards: Reward[];
  hasExpired: boolean;
  owner: {
    emissionRate: BigNumber;
    totalAllocPoint: BigNumber;
  };
};

export const getFarmRewards = (
  pair: CreditPairQuery,
  pool: CreditPool,
  farm: FarmQuery,
  assetPrice: BigNumber,
  collateralPrice: BigNumber,
  creditPrice: BigNumber,
  chainId: number,
): LPFarming => {
  let poolEmissionRate = new BigNumber(farm.owner.emissionRate);
  let allocPoint = new BigNumber(farm.allocPoint);
  let totalAllocPoint = new BigNumber(farm.owner.totalAllocPoint);

  const rewardPerSecond = allocPoint
    .div(totalAllocPoint)
    .times(poolEmissionRate);

  const defaultReward: Reward = {
    currency: {
      name: 'CREDIT',
      decimals: 18,
      symbol: 'CREDIT',
      address: CREDIT_TOKEN_ADDRESS[chainId],
      price: new BigNumber(0),
      derivedETH: new BigNumber(0),
    },
    rewardPerSecond,
    rewardPerDay: rewardPerSecond.times(86400),
    rewardPrice: creditPrice,
  };

  let rewards: Reward[] = [defaultReward];

  let rewardAprPerHour: BigNumber = new BigNumber(0);
  let rewardAprPerDay: BigNumber = new BigNumber(0);
  let rewardAprPerMonth: BigNumber = new BigNumber(0);
  let rewardAprPerYear: BigNumber = new BigNumber(0);
  if (poolEmissionRate.gt(0) && pool.totalSupply?.gt(0)) {
    const tvl = assetPrice
      .times(pool.assetReserve ?? 0)
      .plus(collateralPrice.times(pool.collateralReserve ?? 0))
      .times(Math.pow(10, 18));

    const roiPerSecond = rewards
      .reduce((previousValue, currentValue) => {
        return previousValue.plus(
          currentValue.rewardPerSecond.times(currentValue.rewardPrice),
        );
      }, new BigNumber(0))
      .div(tvl);

    rewardAprPerHour = roiPerSecond.times(3600);
    rewardAprPerDay = rewardAprPerHour.times(24);
    rewardAprPerMonth = rewardAprPerDay.times(30);
    rewardAprPerYear = rewardAprPerMonth.times(12);
  }

  return {
    poolHash: farm.id,
    rewardAprPerHour,
    rewardAprPerDay,
    rewardAprPerMonth,
    rewardAprPerYear,
    rewards,
    accTokenPerShare: new BigNumber(farm.accTokenPerShare),
    allocPoint,
    hasExpired: farm.hasExpired,
    owner: {
      emissionRate: poolEmissionRate,
      totalAllocPoint,
    },
  };
};
