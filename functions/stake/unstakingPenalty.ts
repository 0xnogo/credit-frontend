import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import BigNumber from 'bignumber.js';
import { useEpochData } from './currentEpochData';
import useSWR from 'swr';
import { assetSWRConfig } from '@constants/swr';

const WEEK_SECONDS = 604800;

function unstakingPenalty(
  blockTimestamp: BigNumber,
  currentCycleStartTime: BigNumber,
  unstakingPenalties: BigNumber[],
) {
  if (blockTimestamp.gte(currentCycleStartTime.plus(3 * WEEK_SECONDS))) {
    return unstakingPenalties[0];
  } else if (blockTimestamp.gte(currentCycleStartTime.plus(2 * WEEK_SECONDS))) {
    return unstakingPenalties[1];
  } else if (blockTimestamp.gte(currentCycleStartTime.plus(1 * WEEK_SECONDS))) {
    return unstakingPenalties[2];
  } else {
    return unstakingPenalties[3];
  }
}

export function useUnstakingPenalty() {
  const { chainId, account, web3 } = useActiveWeb3React();

  const {
    data = { unstakingPenalties: [], currentCycleStartTime: new BigNumber(0) },
  } = useEpochData('global');

  return useSWR(
    account && chainId && web3 && data
      ? ['unstaking-penalty', chainId, account, data]
      : null,
    async () => {
      try {
        return unstakingPenalty(
          new BigNumber(Date.now() / 1000),
          data.currentCycleStartTime,
          data.unstakingPenalties,
        ).div(10000);
      } catch (error) {
        return undefined;
      }
    },
    assetSWRConfig,
  );
}
