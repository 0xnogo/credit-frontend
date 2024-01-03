import useSWR, { SWRResponse } from 'swr';
import BigNumber from 'bignumber.js';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import Multicall from '@/lib/multicall';
import { useMultiCall } from 'hooks/useMulticall';
import { assetSWRConfig } from '@constants/swr';
import { CreditStaking } from 'types/web3Typings';
import { multicallSplitOnOverflow } from '@/lib/multicall/helpers';
import { DividendsInfo, StakingEpoch, StakingUserInfo } from 'types/staking';
import { getCreditStakingContract } from '@constants/contracts';

async function getDividendsInfo(
  multicall: Multicall,
  creditStakingContract: CreditStaking,
  distributedTokens: string[],
): Promise<DividendsInfo[]> {
  let dividendInfoCalls = distributedTokens.map((token: string) =>
    creditStakingContract.methods.dividendsInfo(token),
  );

  const callResult = await multicallSplitOnOverflow(
    dividendInfoCalls,
    multicall,
  );

  return distributedTokens.map((_: any, index) => ({
    currentDistributionAmount: new BigNumber(callResult[index][0]),
    currentCycleDistributedAmount: new BigNumber(callResult[index][1]),
    pendingAmount: new BigNumber(callResult[index][2]),
    distributedAmount: new BigNumber(callResult[index][3]),
    accDividendsPerShare: new BigNumber(callResult[index][4]),
    lastUpdateTime: new BigNumber(callResult[index][5]),
    distributionDisabled: Boolean(callResult[index][6]),
    token: distributedTokens[index],
  }));
}

async function getUserInfo(
  multicall: Multicall,
  creditStakingContract: CreditStaking,
  distributedTokens: string[],
  account: string,
): Promise<StakingUserInfo[]> {
  let userInfoCalls = distributedTokens.map((token: string) =>
    creditStakingContract.methods.users(account, token),
  );

  const callResult = await multicallSplitOnOverflow(userInfoCalls, multicall);

  return callResult.map((result: any) => ({
    pendingDividends: new BigNumber(result.pendingDividends),
    rewardDebt: new BigNumber(result.rewardDebt),
  }));
}

export function useEpochData(
  epochTimestamp: string = 'global',
): SWRResponse<StakingEpoch | undefined> {
  const { chainId, account, web3 } = useActiveWeb3React();

  const multicall = useMultiCall();

  // const swrData = useStakingEpochData(epochTimestamp);

  // const formattedData: StakingEpoch = useMemo(() => {
  //   return {
  //     dividendsInfo:
  //       swrData.data?.dividendsInfo.map((dividendInfo) => {
  //         return {
  //           token: dividendInfo.token,
  //           currentCycleDistributedAmount: new BigNumber(
  //             dividendInfo.currentCycleDistributedAmount,
  //           ),
  //           currentDistributionAmount: new BigNumber(
  //             dividendInfo.currentDistributionAmount,
  //           ),
  //         };
  //       }) ?? [],
  //     totalAllocation: new BigNumber(swrData.data?.totalAllocation ?? 0),
  //     cycleDurationSeconds: new BigNumber(swrData.data?.totalAllocation ?? 0),
  //     currentCycleStartTime: new BigNumber(
  //       swrData.data?.currentCycleStartTime ?? 0,
  //     ),
  //   };
  // }, [swrData]);

  // return { isValidating: swrData.isValidating, data: formattedData };

  return useSWR(
    account && chainId && web3 && multicall
      ? ['current-staking-epoch-data', chainId, web3.currentProvider, account]
      : null,
    async () => {
      try {
        const creditStakingContract = getCreditStakingContract(web3, chainId);
        const multicalls = [
          creditStakingContract.methods.distributedTokens(),
          creditStakingContract.methods.usersAllocation(account as string),
          creditStakingContract.methods.totalAllocation(),
          creditStakingContract.methods.cycleDurationSeconds(),
          creditStakingContract.methods.currentCycleStartTime(),
          creditStakingContract.methods.unstakingPenalties(0),
          creditStakingContract.methods.unstakingPenalties(1),
          creditStakingContract.methods.unstakingPenalties(2),
          creditStakingContract.methods.unstakingPenalties(3),
        ];
        const [
          distributedTokens,
          userAllocation,
          totalAllocation,
          cycleDurationSeconds,
          currentCycleStartTime,
          us0,
          us1,
          us2,
          us3,
        ] = await multicallSplitOnOverflow(multicalls, multicall as Multicall);

        const dividendsInfo = await getDividendsInfo(
          multicall as Multicall,
          creditStakingContract,
          distributedTokens,
        );
        const userInfo = await getUserInfo(
          multicall as Multicall,
          creditStakingContract,
          distributedTokens,
          account as string,
        );

        const unstakingPenalties = [
          new BigNumber(us0),
          new BigNumber(us1),
          new BigNumber(us2),
          new BigNumber(us3),
        ];

        return {
          dividendsInfo,
          userInfo,
          userAllocation: new BigNumber(userAllocation),
          totalAllocation: new BigNumber(totalAllocation),
          cycleDurationSeconds: new BigNumber(cycleDurationSeconds),
          currentCycleStartTime: new BigNumber(currentCycleStartTime),
          unstakingPenalties,
        };
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    assetSWRConfig,
  );
}
