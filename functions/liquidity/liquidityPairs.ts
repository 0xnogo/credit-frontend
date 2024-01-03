import BigNumber from 'bignumber.js';
import useSWR from 'swr';
import { assetSWRConfig } from 'constants/swr';
import { CreditPair as CreditPairMath } from 'functions/credit';
import {
  CreditPosition,
  PositionType,
  useCreditPositions,
} from 'functions/credit/creditPositions';
import { useMultiCall } from 'hooks/useMulticall';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { CreditPairQuery, CreditPoolQuery } from '@graph/core/types';
import { CreditPair, CreditPool, Lp } from 'types/credit';
import {
  calcMaturationPercentage,
  isPoolMatured,
} from 'functions/credit/utils';
import { getFarmRewards } from '@functions/credit/formatAPRData';
import { useLendingPairs } from '@graph/core/hooks/credit';
import { FarmPositions, useFarmPositions } from './farming/positions';
import { getCreditPairContract } from '@constants/contracts';
import { multicallSplitOnOverflow } from '@/lib/multicall/helpers';
import Multicall from '@/lib/multicall';
import Web3 from 'web3';
import { useETHPrice } from 'hooks/useETHPrice';

function formatLendingPoolContractDataForLiq(
  pool: CreditPoolQuery,
  pair: CreditPairQuery,
  totalSupply: string,
  feeStored: string,
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
      protocolFee: new BigNumber(pair.protocolFee),
    },
    totalSupply: new BigNumber(totalSupply),
    feeStored: new BigNumber(feeStored),
    assetReserve: new BigNumber(pool.assetReserve).div(
      Math.pow(10, Number(pair.asset.decimals)),
    ),
    collateralReserve: new BigNumber(pool.collateralReserve).div(
      Math.pow(10, Number(pair.collateral.decimals)),
    ),
    dateCreated: Number(pool.timestamp),
    assetReserveUSD: new BigNumber(pool.assetReserveUSD),
    collateralReserveUSD: new BigNumber(pool.collateralReserveUSD),
    totalDebt: new BigNumber(pool.totalDebt),
    totalFee: new BigNumber(pool.totalFee),
    debtRatio: new BigNumber(pool.totalDebt).div(pool.assetReserve),
    utilRate: new BigNumber(pool.totalLent)
      .minus(pool.X)
      .div(pool.totalLent)
      .times(100)
      .toNumber(),
    totalFeeUSD: new BigNumber(pool.totalFeeUSD),
    totalBorrowedUSD: new BigNumber(pool.totalBorrowedUSD),
    totalRepayedUSD: new BigNumber(pool.totalRepayedUSD),
    totalDebtUSD: new BigNumber(pool.totalDebtUSD),
  };
}

async function formatLendingPairContractData(
  creditPositions: CreditPosition[],
  farmPositions: FarmPositions,
  pair: CreditPairQuery,
  multicall: Multicall,
  web3: Web3,
  chainId: number,
  ethPrice: BigNumber,
): Promise<CreditPair> {
  const positionsForPair = creditPositions.filter(
    (value) => value.pair.toLowerCase() === pair.address.toLowerCase(),
  );
  const positions: any[] = [];

  pair.pools.forEach((pool) => {
    positions.push(
      positionsForPair.filter(
        //@ts-ignore
        (position) => pool.maturity === position.maturity,
      ),
    );
  });

  const creditPair = getCreditPairContract(web3, pair.address);

  const multicalls = pair.pools.flatMap((pool) => {
    return [
      creditPair.methods.totalLiquidity(pool.maturity),
      creditPair.methods.lpFeeStored(pool.maturity),
    ];
  });

  const multicallResults = await multicallSplitOnOverflow(
    multicalls,
    multicall,
  );

  let index = 0;

  const formattedPools = pair.pools.map((pool) => {
    const [totalSupply, feeStored] = multicallResults.slice(index, index + 2);
    index += 2;
    const poolInfo = formatLendingPoolContractDataForLiq(
      pool,
      pair,
      totalSupply,
      feeStored,
    );
    const poolPositions = positionsForPair.filter(
      (value) =>
        value.pair.toLowerCase() === pair.address.toLowerCase() &&
        //@ts-ignore
        value.maturity === pool.maturity,
    );
    let farmData = undefined;
    let farmsPositionsForPool: FarmPositions = {};
    if (pool?.farm) {
      farmData = getFarmRewards(
        pair,
        poolInfo,
        pool.farm,
        new BigNumber('1'),
        new BigNumber('1'),
        new BigNumber('1'),
        chainId,
      );
      farmsPositionsForPool = Object.keys(farmPositions).reduce(
        (prev, positionKey) => {
          if (farmPositions[Number(positionKey)].pool.id === pool.farm.id) {
            return {
              ...prev,
              [Number(positionKey)]: {
                ...farmPositions[Number(positionKey)],
              },
            };
          }
          return prev;
        },
        {},
      );
    }

    const lps: Lp[] = poolPositions.map((position) => {
      const balance = new BigNumber(position.liquidityToken?.totalAmount ?? 0);
      const positionId = Number(position.positionIndex);

      return {
        balance,
        positionId,
        position,
      };
    });

    const myFarmPositions: Lp[] = Object.keys(farmsPositionsForPool).map(
      (key) => {
        const positionData = farmsPositionsForPool[Number(key)];
        const balance = new BigNumber(positionData.positionInfo.amount);
        const positionId = Number(positionData.creditPositionId);
        let farmPosition = positionData;
        const cp: CreditPosition = {
          positionType: PositionType.FARM,
          pair: pair.address,
          //@ts-ignore
          maturity: pool.maturity,
          positionIndex: positionData.creditPositionId.toString(),
        };
        return {
          balance,
          positionId,
          position: cp,
          farmPosition: farmPosition,
        };
      },
    );

    return { ...poolInfo, lps: [...lps, ...myFarmPositions], farm: farmData };
  });

  return {
    ...pair,
    fee: new BigNumber(pair.fee),
    protocolFee: new BigNumber(pair.protocolFee),
    pools: formattedPools,
    stakingFee: new BigNumber(pair.stakingFee),
  };
}

async function getLiquidityPositionsData(
  pairs: CreditPairQuery[],
  creditPositions: CreditPosition[],
  farmPositions: FarmPositions,
  multicall: Multicall,
  web3: Web3,
  chainId: number,
  ethPrice: BigNumber,
): Promise<CreditPair[]> {
  if (!pairs?.length) return [];

  // destruct multicall result into pairs
  const pairsContractData = await Promise.all(
    pairs.map(async (pair) => {
      const pairContractData = await formatLendingPairContractData(
        creditPositions,
        farmPositions,
        pair,
        multicall,
        web3,
        chainId,
        ethPrice,
      );
      return pairContractData;
    }),
  );

  return pairsContractData.filter((pair) => pair.pools.length > 0);
}

/////////////////////////////////////// HOOKS /////////////////////////////////////////////////////

export function useLiquidityPositions() {
  const multicall = useMultiCall();
  const {
    data: allPositions,
    isValidating: allPositionsLoading,
    mutate: mutateCreditPositions,
  } = useCreditPositions();

  const { account, chainId, web3 } = useActiveWeb3React();

  const creditPairs = useLendingPairs();

  const farmPositions = useFarmPositions();

  const { data: ethPrice = new BigNumber(0) } = useETHPrice();

  const liqPositionsData = useSWR(
    account && chainId && multicall && web3 && creditPairs.data && ethPrice
      ? [
          'liq-positions-data',
          chainId,
          account,
          allPositions,
          creditPairs.data,
          farmPositions.data,
          ethPrice,
        ]
      : null,
    async () => {
      try {
        if (!account || !allPositions) return [];
        const pairs = creditPairs.data as CreditPairQuery[];
        return await getLiquidityPositionsData(
          pairs,
          allPositions.liquidityPositions,
          farmPositions.data ?? {},
          multicall as Multicall,
          web3,
          chainId,
          ethPrice,
        );
      } catch (error) {
        console.log(error);
      }
    },
    assetSWRConfig,
  );

  return {
    ...liqPositionsData,
    isValidating:
      liqPositionsData.isValidating ||
      allPositionsLoading ||
      farmPositions.isValidating,
    data: liqPositionsData.data ?? [],
    mutate: () => {
      mutateCreditPositions();
      farmPositions.mutate();
    },
  };
}
