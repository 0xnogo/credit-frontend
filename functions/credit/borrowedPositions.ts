import useSWR from 'swr';
import { CreditPair, CreditPool } from 'types/credit';
import { calcMaturationPercentage, isPoolMatured } from './utils';
import { CreditPair as CreditPairMath } from 'functions/credit';
import { assetSWRConfig } from 'constants/swr';
import { useMultiCall } from 'hooks/useMulticall';
import { CreditPairQuery, CreditPoolQuery } from '@graph/core/types';
import Multicall from '@/lib/multicall';
import Web3 from 'web3';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import {
  CreditPosition,
  PositionType,
  useCreditPositions,
} from './creditPositions';
import lockedDebtABI from 'constants/contracts/ABIs/lockedDebt.json';
import { AbiItem } from 'web3-utils';
import BigNumber from 'bignumber.js';
import { useETHPrice } from 'hooks/useETHPrice';
import { useMemo } from 'react';
import { useLendingPairs } from '@graph/core/hooks/credit';
import { getCreditPositionContract } from '@constants/contracts';

export function formatLendingPoolContractDataForBorrows(
  pool: CreditPoolQuery, // Update the type of 'pool' to the actual type
  pair: CreditPairQuery, // Update the type of 'pair' to the actual type
): CreditPool {
  const X = new BigNumber(pool.X);
  const Y = new BigNumber(pool.Y);
  const Z = new BigNumber(pool.Z);
  const maxAPR = CreditPairMath.calculateApr(X, Y).times(100);
  const minCDP = CreditPairMath.calculateCdp(X, Z, pair.asset, pair.collateral);

  return {
    X,
    Y,
    Z,
    maxAPR,
    minCDP,
    maturationPercentage: calcMaturationPercentage(
      pool.timestamp,
      pool.maturity,
    ),
    matured: isPoolMatured(pool.maturity),
    maturity: pool.maturity,
    dues: [],
    pair: {
      ...pair,
      fee: new BigNumber(pair.fee),
      protocolFee: new BigNumber(pair.fee),
    },
    dateCreated: Number(pool.timestamp),
    utilRate: new BigNumber(pool.totalLent)
      .minus(pool.X)
      .div(pool.totalLent)
      .times(100)
      .toNumber(),
    assetReserveUSD: new BigNumber(pool.assetReserveUSD),
    collateralReserveUSD: new BigNumber(pool.collateralReserveUSD),
    debtRatio: new BigNumber(pool.totalDebt).div(pool.assetReserve),
    totalFeeUSD: new BigNumber(pool.totalFeeUSD),
    totalBorrowedUSD: new BigNumber(pool.totalBorrowedUSD),
    totalRepayedUSD: new BigNumber(pool.totalRepayedUSD),
    totalDebtUSD: new BigNumber(pool.totalDebtUSD),
    totalDebt: new BigNumber(pool.totalDebt),
    totalFee: new BigNumber(pool.totalFee),
    creditPositions: pool?.creditPositions,
  };
}

async function formatLendingPairContractData(
  creditPositions: CreditPosition[],
  pair: CreditPairQuery,
  web3: Web3,
  multicall: Multicall | undefined,
  chainId:number
): Promise<CreditPair> {
  const cpContract = getCreditPositionContract(web3,chainId)
  const positionsForPair = creditPositions.filter(
    (value) => value.pair.toLowerCase() === pair.address.toLowerCase(),
  );

  const debtCalls: any[] = [];
  const positions: any[] = [];

  const formattedPools = pair.pools.map((pool, index) => {
    positions.push(
      positionsForPair.filter(
        //@ts-ignore
        (position) => pool.maturity === position.maturity,
      ),
    );
    const formattedPool = formatLendingPoolContractDataForBorrows(pool, pair);
    positions[index].forEach((position: any) => {
      debtCalls.push(
        cpContract.methods.dueOf(position.CDT.tokenId),
      );
    });
    return formattedPool;
  });

  const debtData = await multicall?.aggregate(debtCalls);

  const finalPairs = formattedPools.map((pool, index) => {
    const dues: any[] = [];
    positions[index].forEach((position: any) => {
      const debtStruct = debtData.shift();
      if (new BigNumber(debtStruct.debt).gt(0)) {
        dues.push({
          debt: new BigNumber(debtStruct.debt).div(10 ** pair.asset.decimals),
          collateral: new BigNumber(debtStruct.collateral).div(
            10 ** pair.collateral.decimals,
          ),
          positionId: position.CDT.tokenId,
          position,
        });
      }
    });
    return { ...pool, dues };
  });

  return {
    ...pair,
    fee: new BigNumber(pair.fee),
    protocolFee: new BigNumber(pair.protocolFee),
    pools: finalPairs,
    stakingFee: new BigNumber(pair.stakingFee),
  };
}

async function getBorrowedPositionsData(
  pairs: CreditPairQuery[],
  creditPositions: CreditPosition[],
  web3: Web3,
  multicall: Multicall | undefined,
  chainId:number
): Promise<CreditPair[]> {
  if (!pairs?.length) return [];

  // destruct multicall result into pairs
  const pairsContractData = pairs.map(async (pair) => {
    const pairContractData = await formatLendingPairContractData(
      creditPositions,
      pair,
      web3,
      multicall,
      chainId
    );
    return pairContractData;
  });

  const finalPairs = await Promise.all(pairsContractData);
  return finalPairs.filter((pair) => pair.pools.length > 0);
}

/////////////////////////////////////// HOOKS /////////////////////////////////////////////////////

export function useBorrowedPositions() {
  const multicall = useMultiCall();
  const { data: allPositions, isValidating: allPositionsLoading, mutate } =
    useCreditPositions();

  const debtPositions = useMemo(()=>{
   return (allPositions??{debtPositions:[]}).debtPositions.filter(
      (value) => value.positionType === PositionType.DEBT,
    )
  },[allPositions])

  const { data:pairs=[],isValidating:isValidatingLendingPairs } = useLendingPairs();

  const { data:ethPrice = new BigNumber(0),isValidating:isValidatingETHPrice } = useETHPrice()
  
  const { account, chainId, web3 } = useActiveWeb3React();
  
  const borrowPositionsData = useSWR(
    account && chainId && multicall && web3 && ethPrice.gt(0) && debtPositions.length>0 && pairs.length>0
      ? ['borrowed-positions', chainId, account, allPositions]
      : null,
    async () => {
      if (!account || !allPositions) return [];
      return getBorrowedPositionsData(
        pairs,
        debtPositions,
        web3,
        multicall,
        chainId
      );
    },
    assetSWRConfig,
  );

  return {
    ...borrowPositionsData,
    isValidating: borrowPositionsData.isValidating || allPositionsLoading || isValidatingETHPrice || isValidatingLendingPairs,
    data: borrowPositionsData.data ?? [],
    mutate
  };
}
