import { useEpochData } from './currentEpochData';
import BigNumber from 'bignumber.js';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import useSWR from 'swr';
import { useMultiCall } from 'hooks/useMulticall';
import { assetSWRConfig } from '@constants/swr';
import { DividendsInfo } from 'types/staking';
import { getCreditStakingContract } from '@constants/contracts';
import { tryMulticallSplitOnOverflow } from '@/lib/multicall/helpers';
import Multicall from '@/lib/multicall';
import { useTokenMapping } from 'hooks/useTokenMapping';
import { formatCurrency } from '@utils/index';

export function useClaimableRewards() {
  const { chainId, account, web3 } = useActiveWeb3React();

  const { data } = useEpochData('global');

  const multicall = useMultiCall();

  const { data: tokenMapping = {} } = useTokenMapping();

  return useSWR(
    account && chainId && web3 && multicall && data && tokenMapping
      ? ['user-staking-claimable-rewards', chainId, account, data, tokenMapping]
      : null,
    async () => {
      try {
        const creditStakingContract = getCreditStakingContract(web3, chainId);

        const dividends = data?.dividendsInfo ?? [];

        let rewardCalls = dividends.map((dividend: DividendsInfo) =>
          creditStakingContract.methods.pendingDividendsAmount(
            dividend.token,
            account as string,
          ),
        );

        const callResult = (
          await tryMulticallSplitOnOverflow(rewardCalls, multicall as Multicall)
        ).map((res) => (!res.success ? 0 : res.result));

        return dividends.flatMap((dividend, index) => {
          const token = tokenMapping[dividend.token];
          const dividendInfo = new BigNumber(callResult[index]).div(
            Math.pow(10, token.decimals),
          );
          if (dividendInfo.lte(0)) return [];
          return [
            {
              usdAmount: new BigNumber(token?.price ?? 0).times(dividendInfo),
              dividendAmount: formatCurrency(dividendInfo),
              symbol: token.symbol,
              logoURI: token.logoURI,
              token,
            },
          ];
        });
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    assetSWRConfig,
  );
}
