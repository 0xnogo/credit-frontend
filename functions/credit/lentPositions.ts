import useSWR, { SWRResponse } from 'swr';
import BigNumber from 'bignumber.js';
import { CreditPair, CreditPool } from 'types/credit';
import { calcMaturationPercentage, isPoolMatured } from './utils';
import { CreditPair as CreditPairMath } from 'functions/credit';
import { assetSWRConfig } from 'constants/swr';
import {
  AllPositions,
  CreditPosition,
  useCreditPositions,
} from './creditPositions';
import { CreditPairQuery, CreditPoolQuery } from '@graph/core/types';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { getCreditPairContract } from '@constants/contracts';
import { useMemo } from 'react';
import { useETHPrice } from 'hooks/useETHPrice';
import { useLendingPairs } from '@graph/core/hooks/credit';

export function formatLendingPoolContractData(
  pool: CreditPoolQuery,
  pair: CreditPairQuery,
): CreditPool {
  const X = new BigNumber(pool.X);
  const Y = new BigNumber(pool.Y);
  const Z = new BigNumber(pool.Z);
  const maxAPR = CreditPairMath.calculateApr(X, Y).times(100);
  const minCDP = CreditPairMath.calculateCdp(X, Z, pair.asset, pair.collateral);
  const assetReserve = new BigNumber(pool.assetReserve).div(
    10 ** pair.asset.decimals,
  );
  const collateralReserve = new BigNumber(pool.collateralReserve).div(
    10 ** pair.collateral.decimals,
  );
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
    creditedPools: [],
    pair: {
      ...pair,
      fee: new BigNumber(pair.fee),
      protocolFee: new BigNumber(pair.protocolFee),
    },
    dateCreated: Number(pool.timestamp),
    utilRate: new BigNumber(pool.totalLent)
      .minus(pool.X)
      .div(pool.totalLent)
      .times(100)
      .toNumber(),
    assetReserveUSD: new BigNumber(pool.assetReserveUSD),
    collateralReserveUSD: new BigNumber(pool.collateralReserveUSD),
    assetReserve,
    collateralReserve,
    totalDebt: new BigNumber(pool.totalDebt),
    totalFee: new BigNumber(pool.totalFee),
    debtRatio: new BigNumber(pool.totalDebt).div(pool.assetReserve),
    totalFeeUSD: new BigNumber(pool.totalFeeUSD),
    totalBorrowedUSD: new BigNumber(pool.totalBorrowedUSD),
    totalRepayedUSD: new BigNumber(pool.totalRepayedUSD),
    totalDebtUSD: new BigNumber(pool.totalDebtUSD),
  };
}

export default function formatLendingPairContractData(
  creditPositions: CreditPosition[],
  pair: CreditPairQuery,
): CreditPair {
  const positionsForPair = creditPositions.filter(
    (value) => value.pair.toLowerCase() === pair.address.toLowerCase(),
  );
  let formattedPools: CreditPool[] = [];
  if (positionsForPair.length > 0) {
    formattedPools = pair.pools.flatMap((pool) => {
      const positionsForPool = creditPositions.filter(
        (value) =>
        //@ts-ignore
          value.maturity === pool.maturity &&
          value.pair.toLowerCase() === pair.address.toLowerCase(),
      );
      const formattedData = formatLendingPoolContractData(pool, pair);
      if (positionsForPool.length > 0) {
        return {
          ...formattedData,
          creditedPools: positionsForPool.map((position) => ({
            loanInterestBalance: new BigNumber(
              position.loanInterest?.totalAmount ?? 0,
            ).div(10 ** 18),
            loanPrincipalBalance: new BigNumber(
              position.loanPrincipal?.totalAmount ?? 0,
            ).div(10 ** 18),
            coverageInterestBalance: new BigNumber(
              position.coverageInterest?.totalAmount ?? 0,
            ).div(10 ** 18),
            coveragePrincipalBalance: new BigNumber(
              position.coveragePrincipal?.totalAmount ?? 0,
            ).div(10 ** 18),
            position,
          })),
        };
      }
      return [];
    });
  }

  return {
    ...pair,
    fee: new BigNumber(pair.fee),
    protocolFee: new BigNumber(pair.protocolFee),
    pools: formattedPools,
    stakingFee: new BigNumber(pair.stakingFee),
  };
}

async function getLentPositionsData(
  pairs: CreditPairQuery[],
  creditPositions: CreditPosition[],
): Promise<CreditPair[]> {
  if (!pairs?.length) return [];

  // destruct multicall result into pairs
  const pairsContractData = pairs
    .map((pair) => {
      const pairContractData = formatLendingPairContractData(
        creditPositions,
        pair,
      );
      return pairContractData;
    })
    .filter((pair) => pair.pools.length > 0);

  return pairsContractData;
}

/////////////////////////////////////// HOOKS /////////////////////////////////////////////////////
export function useLentPositions() {
  const {
    data: allPositions,
    isValidating: allPositionsLoading,
    mutate,
  } = useCreditPositions();

  const lentPositions = useMemo(()=>
  (allPositions)?.creditPositions ?? []
  ,[allPositions])

  const { account, chainId, web3 } = useActiveWeb3React();

  const { data:ethPrice = new BigNumber(0),isValidating:isValidatingETHPrice } = useETHPrice()

  const { data:pairs=[],isValidating:isValidatingLendingPairs } = useLendingPairs();

  const lentPositionsData = useSWR<CreditPair[]>(
    web3 && account && chainId && lentPositions.length>0 && ethPrice.gt(0) && pairs.length>0
      ? ['lent-positions', chainId, account, lentPositions,pairs]
      : null,
    async () => {
      if (!account) return [];
      const lentPositionsData = await getLentPositionsData(
        pairs,
        lentPositions,
      );
      return lentPositionsData;
    },
    assetSWRConfig,
  );

  return {
    ...lentPositionsData,
    isValidating: lentPositionsData.isValidating || allPositionsLoading || isValidatingETHPrice || isValidatingLendingPairs,
    data: lentPositionsData.data ?? [],
    mutate
  };
}
