import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';

export type creditPoolHourDatasQuery = {
  id: string;
  X: string;
  Y: string;
  Z: string;
  assetReserveUSD: string;
  collateralReserveUSD: string;
  hourStartUnix: number;
  totalBorrowedUSD: string;
  totalLentUSD: string;
  totalRepayedUSD: string;
  totalRepayed: string;
  totalBorrowed: string;
  collateralReserve: string;
  assetReserve: string;
  totalLent: string;
  pool: {
    pair: {
      asset: {
        decimals: number;
      };
      collateral: {
        decimals: number;
      };
    };
  };
};

export type LatestBidQuery = {
  buyAmount: string;
  sellAmount: string;
  auctionUser: {
    id: string;
  };
};

export type BidsQuery = {
  buyAmount: string;
  sellAmount: string;
  timestamp: string;
  referral: {
    id: string;
  };
  auctionUser: {
    id: string;
  };
  cancelled: boolean;
  orderClaimed: boolean;
  winningAmount: string;
  price: string;
};

export type UserBidsQuery = {
  auctionSellOrders: BidsQuery[];
  id: string;
  sumAuctioningTokenAmount: string;
};

export type UserReferralsQuery = {
  ordersReferredCount: string;
  ordersWonCount: string;
  totalWinningSellAmount: string;
  rewardBalance: string;
  totalRewards: string;
  totalSellAmount: string;
  totalCreditWinningsForReferredOrders: string;
};

export type CreditStakingDataQuery = {
  id: string;
  creditToken: string;
  currentCycleStartTime: string;
  cycleDurationSeconds: string;
  cycleStartBlocks: string;
  distributedTokens: string[];
  epochNumber: string;
  totalAllocation: string;
  unstakingPenalties: string;
  dividendsInfo: {
    id: string;
    token: string;
    currentCycleDistributedAmount: string;
    currentDistributionAmount: string;
    currentCycleDistributedAmountUSD: string;
  }[];
};

export type FarmQuery = {
  id: string;
  accTokenPerShare: string;
  allocPoint: string;
  balance: string;
  block: string;
  hasExpired: boolean;
  lastRewardTime: string;
  maturity: string;
  timestamp: string;
  positionCount: string;
  owner: {
    emissionRate: string;
    totalAllocPoint: string;
  };
};

export type CreditPoolQuery = {
  id: string;
  maturity: number;
  X: string;
  Y: string;
  Z: string;
  assetReserve: string;
  collateralReserve: string;
  timestamp: number;
  farm: FarmQuery;
  totalLent: string;
  assetReserveUSD: string;
  collateralReserveUSD: string;
  totalDebt: string;
  totalFee: string;
  totalFeeUSD: string;
  totalBorrowedUSD: string;
  totalRepayedUSD: string;
  totalDebtUSD: string;
  creditPositions: [];
};

export type CreditPairQuery = {
  address: string;
  name: string;
  fee: string;
  protocolFee: string;
  stakingFee: string;
  asset: Token;
  collateral: Token;
  pools: CreditPoolQuery[];
};

export type CDTQuery = {
  tokenId: string;
  APR: string;
  CDP: string;
};

export type CreditPositionQuery = {
  id: string;
  APR: string;
  CDP: string;
};

export type CreditTransactionsQuery = {
  type:string;
  assetValue:string;
  collateralValue:string;
  maxAPR: string;
  id:string;
  collateralAmount:string;
  blockNumber:string;
  previousBlockNumber:string;
  assetAmount:string;
  txHash:string;
  timestamp:string;
  user : {
    id: string
  };
  index:string
}