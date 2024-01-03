import { NATIVE_DECIMALS, NATIVE_NAME, NATIVE_SYMBOL } from 'constants/';
import { ChainIds } from 'constants/chains';
import {
  NATIVE_ADDRESS,
  WRAPPED_NATIVE_ADDRESS,
} from 'constants/contracts/addresses';
import request from 'graphql-request';
import { XCAL_EXCHANGE_URI } from 'services/graph/config';
import { Token } from 'types/assets';
import { GenericObject } from 'types/web3';
import {
  activeLendingPairsQuery,
  allStakingEpochsQuery,
  creditPairData,
  hourChartingData,
  creditPairQuery,
  creditPairUsingTokens,
  creditPairWithPoolsQuery,
  poolDayDatas,
  stakingEpochQuery,
  userPositionQuery,
  creditPositionsQuery,
  creditTransactionsQuery,
  creditTransactionsLatestBlockNumberQuery,
  allCreditPositionsQuery,
  upperCreditTransactionsQuery,
  borrowedAmountQuery,
} from '../queries/credit';
import {
  CreditStakingDataQuery,
  CreditPairQuery,
  creditPoolHourDatasQuery,
  CDTQuery,
  CreditPositionQuery,
  CreditTransactionsQuery,
} from '../types';
import { BigNumber } from 'bignumber.js';
import { getETHPrice } from './pricing';
import tokenLogoURIs from 'constants/tokens/logoURIs.json';
import { CreditPair } from '@functions/credit';
import { useETHPrice } from 'hooks/useETHPrice';

const fetcher = async (
  chainId: number,
  query: any,
  variables: Record<string, any>,
): Promise<any> => request(XCAL_EXCHANGE_URI[chainId], query, variables);

export const getLendingPairs = async (
  chainId: number,
  account: string,
  opts: any = {},
  ethPrice:BigNumber = new BigNumber(0)
): Promise<CreditPairQuery[]> => {
  try {
    const active = opts?.active ?? false;
    const now = new Date();
    const beginning = new Date('2022-05-01'); // all pairs
   
    // TODO(optimization): fetch the timestamp from the blockchain instead for localhost (running on a past block)
    const minMaturity = (Date.now() / 1000).toFixed(0);
    const { creditPairs }: { creditPairs: CreditPairQuery[] } = await fetcher(
      chainId,
      activeLendingPairsQuery[chainId],
      {
        minMaturity: Number(minMaturity),
        userAddress: account.toLowerCase(),
      },
    );
    const filteredLendingPairs = creditPairs.filter((pair: CreditPairQuery) =>
      Boolean(pair.pools.length),
    );
    return await Promise.all(
      filteredLendingPairs.map(async (pair: CreditPairQuery) => ({
        ...pair,
        asset: await _getTokenOrNative(pair.asset, chainId,ethPrice),
        collateral: await _getTokenOrNative(pair.collateral, chainId,ethPrice),
        pools:pair.pools.filter(
          //@ts-ignore
          (pool) => pool.maturity !== '1699887594',
        )
      })),
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getLendingPair = async (
  pairAddress: string,
  opts: GenericObject,
  ethPrice:BigNumber = new BigNumber(0)
): Promise<CreditPairQuery> => {
  const chainId: number = opts.chainId;
  const withPools = opts.withPools === undefined ? true : opts.withPools;

  const { creditPair: pair }: { creditPair: CreditPairQuery } = await fetcher(
    chainId,
    withPools ? creditPairWithPoolsQuery : creditPairQuery,
    {
      id: pairAddress.toLowerCase(),
    },
  );
  return {
    ...pair,
    asset: await _getTokenOrNative(pair.asset, chainId,ethPrice),
    collateral: await _getTokenOrNative(pair.collateral, chainId,ethPrice),
  };
};

export const getMaturitiesForLendingPair = async (
  asset: Token,
  collateral: Token,
  chainId: number,
): Promise<number[]> => {
  const { creditPairs: pair }: { creditPairs: CreditPairQuery[] } =
    await fetcher(chainId, creditPairUsingTokens, {
      asset: asset.address.toLowerCase(),
      collateral: collateral.address.toLowerCase(),
    });

  return pair[0].pools.map((pool) => pool.maturity);
};

const _getTokenOrNative = async (
  token: Token,
  chainId: number,
  ethPrice: BigNumber
): Promise<Token> => {
  return token.address === WRAPPED_NATIVE_ADDRESS[chainId].toLowerCase()
    ? {
        decimals: NATIVE_DECIMALS[chainId],
        name: NATIVE_NAME[chainId],
        symbol: NATIVE_SYMBOL[chainId],
        address: NATIVE_ADDRESS[chainId],
        derivedETH: new BigNumber(1),
        price: ethPrice,
        logoURI: (tokenLogoURIs as Record<string, string>)[
          WRAPPED_NATIVE_ADDRESS[chainId].toLowerCase()
        ],
      }
    : {
        ...token,
        price: ethPrice.times(token.derivedETH),
        derivedETH: new BigNumber(token.derivedETH),
        logoURI: (tokenLogoURIs as Record<string, string>)[
          token.address.toLowerCase()
        ],
      };
};

export const allPairsCredit = async (chainId: number) => {
  const { pairs: data } = await fetcher(chainId, creditPairData, {
    maturity: '0',
  });
  return data;
};

export const getLendingPoolDayDatas = async (chainId: number) => {
  const { creditPoolDayDatas: data } = await fetcher(chainId, poolDayDatas, {});
  return data;
};

export const getUserFarmPositions = async (
  chainId: number,
  account: string,
) => {
  const { user } = await fetcher(chainId, userPositionQuery, {
    id: account.toLowerCase(),
  });
  const {
    farmPositions,
  }: {
    farmPositions: {
      creditPositionId: number;
      pool: {
        id: string;
      };
    }[];
  } = user;
  return farmPositions;
};

export const getStakingEpoch = async (chainId: number, timestamp: string) => {
  const { stakingData } = await fetcher(chainId, stakingEpochQuery, {
    id: timestamp,
  });
  return stakingData;
};

export const getBorrowedAmount = async (chainId: number, positionId:string | number):Promise<{borrowAmount:BigNumber;debt:BigNumber}> => {
  const { creditPosition } = await fetcher(chainId, borrowedAmountQuery, {
    id: positionId,
  });
  return creditPosition ?? {borrowAmount:new BigNumber('1'),debt: new BigNumber(0)};
};

export const getAllStakingEpochs = async (
  chainId: number,
): Promise<CreditStakingDataQuery[]> => {
  const { stakingDatas } = await fetcher(chainId, allStakingEpochsQuery, {});
  return stakingDatas;
};

export const getCreditPositionMetrics = async (
  chainId: number,
  tokenId: string,
): Promise<CreditPositionQuery> => {
  const { creditPosition } = await fetcher(chainId, creditPositionsQuery, {
    id: tokenId,
  });
  return creditPosition;
};

export const getAllCreditPositionMetrics = async (
  chainId: number,
  address: string,
): Promise<CreditPositionQuery[]> => {
  const { creditPositions } = await fetcher(chainId, allCreditPositionsQuery, {
    id: address.toLowerCase(),
  });
  return creditPositions;
};

export const getLendHourDatas = async (
  chainId: number,
  pairAddress: string,
  maturity: string | number,
) => {
  const { creditPoolHourDatas } = await fetcher(chainId, hourChartingData, {
    id: `${pairAddress}-${maturity}`,
  });
  return creditPoolHourDatas.map((val: creditPoolHourDatasQuery) => {
    const bnY = new BigNumber(val.Y);
    const bnX = new BigNumber(val.X);
    const interestRateMax = CreditPair.calculateApr(bnX, bnY).times(100);
    const interestRateMin = interestRateMax.div(16);
    const interestRateAvg = interestRateMax.plus(interestRateMin).div(2);
    const values = {
      id: Number(val.id),
      X: Number(val.X),
      Y: Number(val.Y),
      Z: Number(val.Z),
      K: Number(val.X) * Number(val.Y) * Number(val.Z),
      assetReserveUSD: Number(val.assetReserveUSD),
      collateralReserveUSD: Number(val.collateralReserveUSD),
      date: val.hourStartUnix,
      totalBorrowedUSD: Number(val.totalBorrowedUSD),
      totalLentUSD: Number(val.totalLentUSD),
      totalRepayedUSD: Number(val.totalRepayedUSD),
      totalRepayed: Number(val.totalRepayed),
      totalBorrowed: Number(val.totalBorrowed),
      collateralReserve: Number(val.collateralReserve),
      assetReserve: Number(val.assetReserve),
      outStandingLoan:
        Number(val.totalBorrowedUSD) - Number(val.totalRepayedUSD),
      totalLent: Number(val.totalLent),
      interestRateMax: interestRateMax.toNumber(),
      interestRateMin: interestRateMin.toNumber(),
      interestRateAvg: interestRateAvg.toNumber(),
    };
    return values;
  });
};

export const getLatestTxBlockNum = async (
  chainId: number,
): Promise<number> => {
  const { creditTransactions } = await fetcher(chainId, creditTransactionsLatestBlockNumberQuery, {});
  return Number(creditTransactions?.[0]?.blockNumber ?? 0);
};

export const getCreditTransactions = async (
  chainId: number,
  first: number,
  skip:number,
  index:string,
  pairAddress:string,
  maturity:number
): Promise<CreditTransactionsQuery[]> => {
  const { creditTransactions } = await fetcher(chainId, creditTransactionsQuery, {
    first,
    skip,
    index:index.toString(),
    poolid:pairAddress.toLowerCase()+"-"+maturity.toString()
  });
  return creditTransactions;
};

export const getCreditTransactionsUpper = async (
  chainId: number,
  first: number,
  fromindex:string,
  toindex:string,
  pairAddress:string,
  maturity:number
): Promise<CreditTransactionsQuery[]> => {
  const { creditTransactions } = await fetcher(chainId, upperCreditTransactionsQuery, {
    first,
    fromindex,
    toindex,
    poolid:pairAddress.toLowerCase()+"-"+maturity.toString()
  });
  return creditTransactions;
};

export const getCreditTransactionsLower = async (
  chainId: number,
  first: number,
  blocknum:number,
  pairAddress:string,
  maturity:number
): Promise<CreditTransactionsQuery[]> => {
  const { creditTransactions } = await fetcher(chainId, upperCreditTransactionsQuery, {
    first,
    blocknum,
    poolid:pairAddress.toLowerCase()+"-"+maturity.toString()
  });
  return creditTransactions;
};
