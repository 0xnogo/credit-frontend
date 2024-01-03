import Multicall from '@/lib/multicall';
import { multicallSplitOnOverflow } from '@/lib/multicall/helpers';
import { getLPFarmingContract } from '@constants/contracts';
import { CREDIT_TOKEN_ADDRESS } from '@constants/contracts/addresses';
import { assetSWRConfig } from '@constants/swr';
import { getUserFarmPositions } from '@graph/core/fetchers/credit';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import BigNumber from 'bignumber.js';
import { useMultiCall } from 'hooks/useMulticall';
import { useTokenMapping } from 'hooks/useTokenMapping';
import useSWR from 'swr';

export type FarmPositions = {
  [id: number]: {
    creditPositionId: number;
    pool: {
      id: string;
    };
    pendingCredit: BigNumber;
    pendingCreditUSD: BigNumber;
    positionInfo: {
      amount: BigNumber;
      rewardDebt: BigNumber;
      rewardDebtUSD: BigNumber;
    };
  };
};

//using a multicall instead of subgraph here so we get latest data quick
export function useFarmPositions() {
  const { account, web3, chainId } = useActiveWeb3React();

  const { data: tokenMapping = {} } =
    useTokenMapping();

  const multicall = useMultiCall();

  return useSWR(
    account && chainId && multicall && web3 && tokenMapping[CREDIT_TOKEN_ADDRESS[chainId]]
      ? ['lp-farm-user-positions', chainId, account, tokenMapping]
      : null,
    async () => {
      try {
        const creditToken = tokenMapping[CREDIT_TOKEN_ADDRESS[chainId]];
        const creditTokenPrice = creditToken
          ? creditToken.price
          : new BigNumber(0);
        const lpFarmingContract = getLPFarmingContract(web3, chainId);

        const userPositions = await getUserFarmPositions(
          chainId,
          account as string,
        );

        let pendingCreditCalls: any = [];
        let positionInfoCalls: any = [];

        let activePositions: FarmPositions = {};

        userPositions.forEach((position) => {
          pendingCreditCalls.push(
            lpFarmingContract.methods.pendingCredit(
              position.pool.id,
              account as string,
              position.creditPositionId,
            ),
          );
          positionInfoCalls.push(
            lpFarmingContract.methods.positionInfo(
              position.pool.id,
              account as string,
              position.creditPositionId,
            ),
          );
        });

        const pendingCredit = await multicallSplitOnOverflow(
          pendingCreditCalls,
          multicall as Multicall,
        );

        const positionInfo = await multicallSplitOnOverflow(
          positionInfoCalls,
          multicall as Multicall,
        );
        userPositions.forEach((position, index) => {
          activePositions[position.creditPositionId] = {
            ...position,
            pool: position.pool,
            creditPositionId: position.creditPositionId,
            pendingCredit: new BigNumber(pendingCredit[index]),
            pendingCreditUSD: new BigNumber(pendingCredit[index]).times(
              creditTokenPrice,
            ),
            positionInfo: {
              amount: new BigNumber(positionInfo[index][0]),
              rewardDebt: new BigNumber(positionInfo[index][1]),
              rewardDebtUSD: new BigNumber(positionInfo[index][1]).times(
                creditTokenPrice,
              ),
            },
          };
        });

        return activePositions;
      } catch (error) {
        console.log(error);
      }
    },
    assetSWRConfig,
  );
}
