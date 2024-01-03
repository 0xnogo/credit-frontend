import useSWR, { SWRResponse } from 'swr';
import BigNumber from 'bignumber.js';
import { calcMaturationPercentage, isPoolMatured } from './utils';
import { CreditPair, CreditPool } from 'types/credit';
import { CreditPair as CreditPairMath } from 'functions/credit';
import { CreditPairQuery, CreditPoolQuery } from '@graph/core/types';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { useMemo } from 'react';
import { getCreditPairContract } from 'constants/contracts';
import Web3 from 'web3';
import { multicallSplitOnOverflow } from '@/lib/multicall/helpers';
import Multicall from '@/lib/multicall';
import { useMultiCall } from 'hooks/useMulticall';
import { getFarmRewards } from './formatAPRData';
import { assetSWRConfig } from '@constants/swr';
import { useETHPrice } from 'hooks/useETHPrice';
import { useLendingPairs } from '@graph/core/hooks/credit';

function formatLendingPool(
  pool: CreditPoolQuery,
  pair: CreditPairQuery,
  totalSupply: string,
  feeStored: string,
): CreditPool & {
  maxAPR: BigNumber;
  minCDP: BigNumber;
  assetReserve: BigNumber;
} {
  const { asset, collateral } = pair;
  const X = new BigNumber(pool.X);
  const Y = new BigNumber(pool.Y);
  const Z = new BigNumber(pool.Z);
  const assetReserve = new BigNumber(pool.assetReserve).div(
    10 ** asset.decimals,
  );
  const collateralReserve = new BigNumber(pool.collateralReserve).div(
    10 ** collateral.decimals,
  );
  const maxAPR = CreditPairMath.calculateApr(X, Y).times(100);
  const minCDP = CreditPairMath.calculateCdp(X, Z, asset, collateral);

  return {
    ...pool,
    X,
    Y,
    Z,
    maturationPercentage: calcMaturationPercentage(
      pool.timestamp,
      pool.maturity,
    ),
    matured: isPoolMatured(pool.maturity),
    assetReserve,
    collateralReserve,
    minCDP,
    maxAPR,
    collateralFactor: assetReserve.div(collateralReserve),
    pair: {
      ...pair,
      fee: new BigNumber(pair.fee),
      protocolFee: new BigNumber(pair.protocolFee),
    },
    totalSupply: new BigNumber(totalSupply),
    feeStored: new BigNumber(feeStored),
    farm: undefined,
    dateCreated: Number(pool.timestamp),
    utilRate: new BigNumber(pool.totalLent)
      .minus(pool.X)
      .div(pool.totalLent)
      .times(100)
      .toNumber(),
    assetReserveUSD: new BigNumber(pool.assetReserveUSD),
    collateralReserveUSD: new BigNumber(pool.collateralReserveUSD),
    totalFee: new BigNumber(pool.totalFee),
    totalDebt: new BigNumber(pool.totalDebt),
    debtRatio: new BigNumber(pool.totalDebt).div(pool.assetReserve),
    totalFeeUSD: new BigNumber(pool.totalFeeUSD),
    totalBorrowedUSD: new BigNumber(pool.totalBorrowedUSD),
    totalRepayedUSD: new BigNumber(pool.totalRepayedUSD),
    totalDebtUSD: new BigNumber(pool.totalDebtUSD),
  };
}

async function formatLendingPair(
  pair: CreditPairQuery,
  web3: Web3,
  multicall: Multicall,
  chainId: number,
): Promise<CreditPair> {
  let totalLiquidity = new BigNumber(0),
    bestAPR = new BigNumber(0);

  const calls = pair.pools.flatMap((pool) => {
    const creditPair = getCreditPairContract(web3, pair.address);
    return [
      creditPair.methods.totalLiquidity(pool.maturity),
      creditPair.methods.lpFeeStored(pool.maturity),
    ];
  });

  const multicallResults = await multicallSplitOnOverflow(calls, multicall);

  let index = 0;

  const formattedPools: CreditPool[] = pair.pools.map((pool) => {
    const [totalSupply, feeStored] = multicallResults.slice(index, index + 2);
    index += 2;
    const creditPoolContractData = formatLendingPool(
      pool,
      pair,
      totalSupply,
      feeStored,
    );
    let farmData = undefined;
    if (pool.farm) {
      farmData = getFarmRewards(
        pair,
        creditPoolContractData,
        pool.farm,
        new BigNumber('1'),
        new BigNumber('1'),
        new BigNumber('1'),
        chainId,
      );
    }
    bestAPR = BigNumber.max(bestAPR, creditPoolContractData.maxAPR);
    totalLiquidity = totalLiquidity.plus(creditPoolContractData.assetReserve);
    return { ...creditPoolContractData, farm: farmData };
  });

  return {
    ...pair,
    fee: new BigNumber(pair.fee),
    protocolFee: new BigNumber(pair.protocolFee),
    stakingFee: new BigNumber(pair.stakingFee),
    bestAPR,
    totalLiquidity,
    pools: formattedPools,
  };
}

/////////////////////////////////////// HOOKS /////////////////////////////////////////////////////
export function useLendingPairsInfo(): SWRResponse<CreditPair[]> {
  const { chainId, web3, account, wrongChain } = useActiveWeb3React();

  const multicall = useMultiCall();
  
  const { data:ethPrice=new BigNumber(0),isValidating } = useETHPrice()

  const { data:pairs=[],isValidating:isValidatingLendingPairs } = useLendingPairs();

  const lendSWR =  useSWR(
    account && chainId && web3 && multicall && !wrongChain && ethPrice.gt(0) && pairs.length>0
      ? ['credit-pairs', account, chainId,pairs]
      : null,
    async () => {
      try {
        return await Promise.all(
          pairs.map(
            async (pair) =>
              await formatLendingPair(
                pair,
                web3,
                multicall as Multicall,
                chainId,
              ),
          ),
        );
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    assetSWRConfig,
  );

  return {
    ...lendSWR,
    isValidating:lendSWR.isValidating || isValidating || isValidatingLendingPairs,
  }
}

export function useLendingPair(asset: string, collateral: string) {
  const creditPairs = useLendingPairsInfo();

  const data = useMemo(() => {
    return creditPairs.data?.find((val) => {
      return (
        val.asset.address.toLowerCase() === asset?.toLowerCase() &&
        val.collateral.address.toLowerCase() === collateral?.toLowerCase()
      );
    });
  }, [creditPairs, asset, collateral]);

  return { ...creditPairs, data };
}
