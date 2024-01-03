import { assetSWRConfig } from '@constants/swr';
import { useAllStakingEpochData } from '@graph/core/hooks/credit';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import BigNumber from 'bignumber.js';
import { useTokenMapping } from 'hooks/useTokenMapping';
import useSWR from 'swr';

export function useHistoricalEpochData() {
  const { chainId } = useActiveWeb3React();

  const { data: tokenMapping = {} } = useTokenMapping();

  const { data: allStakingEpochData = [] } = useAllStakingEpochData();

  return useSWR(
    chainId && tokenMapping && allStakingEpochData
      ? ['historical-epoch-data', chainId, tokenMapping, allStakingEpochData]
      : null,
    async () => {
      try {
        return allStakingEpochData.map((data) => {
          const dividendTokens = data?.dividendsInfo ?? [];

          const currentCycleRewards = dividendTokens.reduce((prev, curr) => {
            return prev.plus(curr.currentCycleDistributedAmountUSD);
          }, new BigNumber(0));

          const period = new BigNumber(data?.cycleDurationSeconds ?? 0)
            .div(86400)
            .toFixed();

          const rewardDistribution = dividendTokens.map((curr) => {
            const rewardUSD = new BigNumber(
              curr.currentCycleDistributedAmountUSD,
            );
            return {
              usdValue: rewardUSD,
              rewardAmt: curr.currentCycleDistributedAmount,
            };
          });
          return {
            id: data.id,
            currentCycleRewards,
            period,
            rewardDistribution,
          };
        });
      } catch (error) {
        return [];
      }
    },
    assetSWRConfig,
  );
}
