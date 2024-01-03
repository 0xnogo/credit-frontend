import { useMemo } from 'react';
import { useEpochData } from './currentEpochData';
import BigNumber from 'bignumber.js';
import { CREDIT_TOKEN_ADDRESS } from '@constants/contracts/addresses';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { useTokenMapping } from 'hooks/useTokenMapping';

export function useStakingRewards() {
  const { chainId } = useActiveWeb3React();

  const { data } = useEpochData('global');

  const { data: tokenMapping = {} } = useTokenMapping();

  return useMemo(() => {
    const dividendTokens = data?.dividendsInfo ?? [];

    const globalCreditStaked = data?.totalAllocation ?? new BigNumber(0);

    const totalRewardsUSD = dividendTokens.reduce((prev, curr) => {
      const token = tokenMapping[curr.token];
      return prev.plus(
        token
          ? (curr.distributedAmount ?? new BigNumber(0))
              .div(Math.pow(10, token.decimals))
              .times(token.price ?? 0)
          : 0,
      );
    }, new BigNumber(0));

    const currentCycleRewards = dividendTokens.reduce((prev, curr) => {
      const token = tokenMapping[curr.token];
      return prev.plus(
        token
          ? curr.currentCycleDistributedAmount
              .div(Math.pow(10, token.decimals))
              .times(token.price ?? 0)
          : 0,
      );
    }, new BigNumber(0));

    const creditTokenInfo = tokenMapping[CREDIT_TOKEN_ADDRESS[chainId]];

    const xCreditAPR = creditTokenInfo
      ? totalRewardsUSD.div(
          globalCreditStaked
            .div(Math.pow(10, creditTokenInfo.decimals))
            .times(creditTokenInfo.price),
        )
      : new BigNumber(0);

    const period = (data?.cycleDurationSeconds ?? new BigNumber(0))
      .div(86400)
      .toFixed();

    const rewardDistribution = dividendTokens.map((curr) => {
      const token = tokenMapping[curr.token];
      const rewardUSD = token
        ? curr.currentCycleDistributedAmount
            .div(Math.pow(10, token.decimals))
            .times(token.price ?? 0)
            .times(Math.pow(10, token.decimals))
        : new BigNumber(0);
      return {
        usdValue: rewardUSD,
        rewardAmt: curr.currentCycleDistributedAmount,
      };
    });

    return {
      globalCreditStaked,
      xCreditAPR,
      totalRewardsUSD,
      currentCycleRewards,
      period,
      rewardDistribution,
    };
  }, [data, chainId, tokenMapping]);
}
