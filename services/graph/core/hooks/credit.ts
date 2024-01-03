import { assetSWRConfig } from 'constants/swr';
import useSWR from 'swr';
import {
  getLendingPoolDayDatas,
  getLendingPairs,
  getMaturitiesForLendingPair,
  getStakingEpoch,
  getAllStakingEpochs,
  getAllCreditPositionMetrics,
  getBorrowedAmount,
} from '../fetchers/credit';
import { Token } from 'types/assets';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import {  CreditStakingDataQuery } from '../types';
import BigNumber from 'bignumber.js';
import { useETHPrice } from 'hooks/useETHPrice';
import { useMemo } from 'react';

export function useMaturitiesForLendingPair(asset: Token, collateral: Token) {
  const { chainId } = useActiveWeb3React();
  return useSWR(
    asset && collateral && chainId
      ? ['maturitiesForLendingPair', asset, collateral, chainId]
      : null,
    () => getMaturitiesForLendingPair(asset, collateral, chainId),
    assetSWRConfig,
  );
}

export function useLendingPoolDayDatas() {
  const { chainId } = useActiveWeb3React();
  return useSWR(chainId ? ['creditPoolDayDatas', chainId] : null, () =>
    getLendingPoolDayDatas(chainId),
    assetSWRConfig
  );
}
export function useLendingPairs() {
  const { chainId, account, wrongChain } = useActiveWeb3React();

  const {data:ethPrice = new BigNumber(0),isValidating} = useETHPrice()

  const lendSWR = useSWR(
    chainId && account && ethPrice.gt(0) && !wrongChain
      ? ['allLendingPairsCredit', chainId, account, ethPrice]
      : null,
    () => getLendingPairs(chainId, account as string, {} ,ethPrice),
    assetSWRConfig,
  );

  return {
    ...lendSWR,
    isValidating:lendSWR.isValidating || isValidating
  }
}

export function useStakingEpochData(timestamp: string) {
  const { chainId } = useActiveWeb3React();
  return useSWR<CreditStakingDataQuery>(
    timestamp && chainId ? ['stakingEpochData', timestamp, chainId] : null,
    () => getStakingEpoch(chainId, timestamp),
    assetSWRConfig,
  );
}

export function useBorrowedAmountForPosition(positionIndex: string | number | undefined) {
  const { chainId } = useActiveWeb3React();
  return useSWR<{borrowAmount:BigNumber;debt:BigNumber}>(
    positionIndex!==undefined && chainId ? ['borrowedAmountData', positionIndex, chainId] : null,
    () => getBorrowedAmount(chainId, positionIndex as (string | number)),
    assetSWRConfig,
  );
}

export function useAllStakingEpochData() {
  const { chainId } = useActiveWeb3React();
  return useSWR<CreditStakingDataQuery[]>(
    chainId ? ['allStakingEpochDatas', chainId] : null,
    () => getAllStakingEpochs(chainId),
    assetSWRConfig,
  );
}

export function useAllCreditPositionsForUser() {
  const { account, chainId,wrongChain } = useActiveWeb3React();
  return useSWR(
    account && chainId && !wrongChain ? ['allCreditPositionMetrics', chainId, account] : null,
    async () => {
      try{
        const data = await getAllCreditPositionMetrics(chainId, account as string);
        if (data) {
          return data.map((val)=>({
            id:Number(val.id),
            APR: new BigNumber(val.APR),
            CDP: new BigNumber(val.CDP),
          }));
        }
      }
      catch(error){
        return []
      }
    },
    assetSWRConfig,
  );
}

export function useCreditPositionMetrics(tokenId: string | undefined) {

  const positionsSWR = useAllCreditPositionsForUser();

  const data = useMemo(()=>{
      return (positionsSWR.data??[]).find((data)=>data.id === Number(tokenId))
  },[positionsSWR.data])

  return {
    ...positionsSWR,
    data
  }
}
