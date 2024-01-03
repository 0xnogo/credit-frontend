import { ChainIds } from '@constants/chains';
import { ChainMapping } from 'types/web3';
import gql from 'graphql-tag';

const creditPairGraph = `
  address: id
  name
  fee
  protocolFee
  stakingFee
  asset {
    address: id
    symbol
    name
    decimals
    derivedETH
  }
  collateral {
    address: id
    symbol
    name
    decimals
    derivedETH
  }
  pools(orderBy: maturity, orderDirection: desc) {
    id
    maturity
    X
    Y
    Z
    assetReserve
    collateralReserve
    timestamp
    totalLent
    assetReserveUSD
    collateralReserveUSD
    totalDebt
    totalFee
    totalFeeUSD
    totalBorrowedUSD
    totalRepayedUSD
    totalDebtUSD
  }
  `;

export const userPositionQuery = gql`
  query marketsQuery($id: ID!) {
    user(id: $id) {
      farmPositions {
        pool {
          id
        }
        creditPositionId
        rewardDebtUSD
        tokensHarvestedUSD
      }
    }
  }
`;

export const activeLendingPairsQuery: ChainMapping = {
  [ChainIds.ARBITRUM_GOERLI]: gql`
    query marketsQuery($minMaturity: Int!, $userAddress: ID!) {
      creditPairs {
        address: id
        name
        fee
        protocolFee
        stakingFee
        asset {
          address: id
          symbol
          name
          decimals
          derivedETH
        }
        collateral {
          address: id
          symbol
          name
          decimals
          derivedETH
        }
        pools(
          orderBy: maturity
          orderDirection: desc
          where: {
            or: [
              { maturity_gt: $minMaturity }
              {
                and: [
                  { maturity_lte: $minMaturity }
                  {
                    creditPositions_: {
                      owner: $userAddress
                      positionType_not: "2.0"
                    }
                  }
                ]
              }
            ]
          }
        ) {
          id
          maturity
          X
          Y
          Z
          assetReserve
          collateralReserve
          timestamp
          totalLent
          assetReserveUSD
          collateralReserveUSD
          totalDebt
          totalFee
          totalFeeUSD
          totalBorrowedUSD
          totalRepayedUSD
          totalDebtUSD
        }
      }
    }
  `,
  [ChainIds.LOCALHOST]: gql`
    query marketsQuery($minMaturity: Int!) {
      creditPairs {
        address: id
        name
        fee
        protocolFee
        stakingFee
        asset {
          address: id
          symbol
          name
          decimals
          derivedETH
        }
        collateral {
          address: id
          symbol
          name
          decimals
          derivedETH
        }
        pools(
          orderBy: maturity
          orderDirection: desc
          where: { maturity_gt: $minMaturity }
        ) {
          id
          maturity
          X
          Y
          Z
          assetReserve
          collateralReserve
          timestamp
          totalLent
          assetReserveUSD
          collateralReserveUSD
          farm {
            accTokenPerShare
            allocPoint
            balance
            block
            hasExpired
            id
            maturity
            lastRewardTime
            positionCount
            timestamp
            owner {
              emissionRate
              totalAllocPoint
            }
          }
          totalDebt
          totalFee
          totalFeeUSD
          totalBorrowedUSD
          totalRepayedUSD
          totalDebtUSD
        }
      }
    }
  `,
  [ChainIds.MELIORA_TEST]: gql`
  query marketsQuery($minMaturity: Int!, $userAddress: ID!) {
    creditPairs {
      address: id
      name
      fee
      protocolFee
      stakingFee
      asset {
        address: id
        symbol
        name
        decimals
        derivedETH
      }
      collateral {
        address: id
        symbol
        name
        decimals
        derivedETH
      }
      pools(
        orderBy: maturity
        orderDirection: desc
        where: {
          or: [
            { maturity_gt: $minMaturity }
            {
              and: [
                { maturity_lte: $minMaturity }
                {
                  creditPositions_: {
                    owner: $userAddress
                    positionType_not: "2.0"
                  }
                }
              ]
            }
          ]
        }
      ) {
        id
        maturity
        X
        Y
        Z
        assetReserve
        collateralReserve
        timestamp
        totalLent
        assetReserveUSD
        collateralReserveUSD
        totalDebt
        totalFee
        totalFeeUSD
        totalBorrowedUSD
        totalRepayedUSD
        totalDebtUSD
      }
    }
  }
`
};


export const borrowedAmountQuery = gql`
  query creditPositionsQuery($id: ID!) {
    creditPosition(id: $id) {
            id
            borrowAmount
            debt
    }
  }
`;

export const hourChartingData = gql`
  query hourChartingDataQuery($id: String!) {
    creditPoolHourDatas(
      first: 1000
      where: { pool_contains: $id }
      orderBy: hourStartUnix
      orderDirection: asc
    ) {
      id
      X
      Y
      Z
      totalLent
      assetReserveUSD
      collateralReserveUSD
      hourStartUnix
      totalBorrowedUSD
      totalLentUSD
      totalRepayedUSD
      totalRepayed
      totalBorrowed
      collateralReserve
      assetReserve
      pool {
        pair {
          asset {
            decimals
          }
          collateral {
            decimals
          }
        }
      }
    }
  }
`;

export const creditPairQuery = gql`
  query CreditPairQuery($id: ID!) {
    creditPair(id: $id) {
      address: id
      name
      asset {
        address: id
        symbol
        totalSupply
        name
        decimals
        derivedETH
      }
      collateral {
        address: id
        symbol
        totalSupply
        name
        decimals
        derivedETH
      }
    }
  }
`;

export const creditPairWithPoolsQuery = gql`
  query CreditPairQuery($id: ID!) {
    creditPair(id: $id) {
      ${creditPairGraph}
    }
  }
`;

export const creditPairUsingTokens = gql`
  query MyQuery($asset: ID!, $collateral: ID!) {
    creditPairs(
      where: { asset_: { id: $asset }, collateral_: { id: $collateral } }
    ) {
      id
      pools {
        maturity
      }
    }
  }
`;

export const creditPositionsQuery = gql`
  query creditPositions($id: ID!) {
    creditPosition(id: $id) {
      APR
      CDP
    }
  }
`;

export const allCreditPositionsQuery = gql`
  query creditPositions($id: ID!) {
    creditPositions(
      where: {owner: $id}
      ) {
      id
      APR
      CDP
    }
  }
`;

export const creditPairData = gql`
  query CreditPairQuery($maturity: String!) {
    pairs: creditPairPools(
      first: 1000
      orderBy: maturity
      orderDirection: asc
      where: { maturity_gt: $maturity }
    ) {
      address: id
      maturity
      timestamp
      pair {
        name
        token0: asset {
          decimals
          address: id
          name
          symbol
          derivedETH
        }
        address: id
        token1: collateral {
          address: id
          name
          decimals
          symbol
          derivedETH
        }
      }
    }
  }
`;

export const poolDayDatas = gql`
  query GetLendingPoolDayData {
    creditPoolDayDatas(orderBy: date, orderDirection: asc, first: 100) {
      pool {
        pair {
          asset {
            symbol
            decimals
            derivedETH
          }
          collateral {
            symbol
            decimals
            derivedETH
          }
        }
      }
      id
      date
      assetReserve
      collateralReserve
      X
      Y
      Z
    }
  }
`;

export const stakingEpochQuery = gql`
  query stakingEpochQuery($id: ID!) {
    stakingData(id: $id) {
      id
      creditToken
      currentCycleStartTime
      cycleDurationSeconds
      cycleStartBlocks
      distributedTokens
      epochNumber
      totalAllocation
      unstakingPenalties
      dividendsInfo(first: 100) {
        id
        currentCycleDistributedAmount
        currentDistributionAmount
        currentCycleDistributedAmountUSD
      }
    }
  }
`;

export const allStakingEpochsQuery = gql`
  query stakingEpochQuery {
    stakingDatas(
      first: 1000
      orderBy: currentCycleStartTime
      orderDirection: desc
    ) {
      id
      creditToken
      currentCycleStartTime
      cycleDurationSeconds
      distributedTokens
      totalAllocation
      unstakingPenalties
      dividendsInfo(first: 100) {
        id
        currentCycleDistributedAmount
        currentDistributionAmount
        currentCycleDistributedAmountUSD
      }
    }
  }
`;


export const creditTransactionsQuery = gql`
  query getAllCreditTransactions($first: Int!,$skip: Int!, $index: String!, $poolid: ID!){
  creditTransactions(
    first: $first
    skip: $skip
    orderDirection: desc
    orderBy: blockNumber
    where: {pool_: {id: $poolid}, index_lt: $index}
  ) {
    id
    collateralValue
    collateralAmount
    assetValue
    blockNumber
    assetAmount
    type
    txHash
    timestamp
    maxAPR
    user {
      id
    }
    index
  }
}
`;

export const upperCreditTransactionsQuery = gql`
  query getAllCreditTransactions($first: Int!, $fromindex: String!, $toindex: String!, $poolid: ID!){
  creditTransactions(
    first: $first
    orderDirection: desc
    orderBy: blockNumber
    where: {pool_: {id: $poolid}, index_lt: $toindex, index_gte: $fromindex}
  ) {
    id
    collateralValue
    collateralAmount
    assetValue
    blockNumber
    assetAmount
    type
    txHash
    timestamp
    maxAPR
    user {
      id
    }
    index
  }
}
`;

export const creditTransactionsLatestBlockNumberQuery = gql`
  query getCreditTransactionsBlockNum{
  creditTransactions(
    first: 1
    orderDirection: desc
    orderBy: blockNumber
  ) {
    blockNumber
  }
}
`;