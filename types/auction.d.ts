import BigNumber from 'bignumber.js';

export type UserReferralInfo = {
  referralCode: string | null;
  ordersReferredCount: BigNumber;
  ordersWonCount: BigNumber;
  totalWinningSellAmount: BigNumber;
  rewardBalance: BigNumber;
  totalRewards: BigNumber;
  totalSellAmount: BigNumber;
  totalCreditWinningsForReferredOrders: BigNumber;
};

export type AuctionSellOrder = {
  buyAmount: BigNumber;
  sellAmount: BigNumber;
  timestamp: string;
  referral: {
    id: string;
  };
  auctionUser: {
    id: string;
  };
  price: BigNumber;
  cancelled: boolean;
  orderClaimed: boolean;
  winningAmount: BigNumber;
};

export type UserBidInfo = {
  auctionSellOrders: AuctionSellOrder[];
  id: string;
  sumAuctioningTokenAmount: BigNumber;
};

export type AuctionInfo = {
  orderCancellationEndData: number;
  auctionEndDate: number;
  minFundingThreshold: BigNumber;
  minFundingThresholdNotReached: boolean;
  initialAuctionOrder: AuctionSellOrder | null;
  minimumBiddingAmountPerOrder: BigNumber;
  myUserId: string;
  auctionSettled: boolean;
  auctionStartDate: number;
};

export type MinimalAuctionOrder = {
  buyAmount: BigNumber;
  sellAmount: BigNumber;
  auctionUser: { id: string };
  price: BigNumber;
};
