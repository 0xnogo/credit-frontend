import { ChainIds } from '@constants/chains';
import { XCAL_EXCHANGE_URI } from '@graph/config';
import request from 'graphql-request';
import {
  allBidsQuery,
  auctionInfoQuery,
  latestBidQuery,
  userBidsQuery,
  userReferralQuery,
} from '../queries/auction';
import {
  BidsQuery,
  LatestBidQuery,
  UserBidsQuery,
  UserReferralsQuery,
} from '../types';
import { MinimalAuctionOrder } from 'types/auction';
import { decodeOrder } from '@functions/gtm/auction/utils';
import BigNumber from 'bignumber.js';

const fetcher = async (
  chainId: number,
  query: any,
  variables: Record<string, any>,
): Promise<any> => request(XCAL_EXCHANGE_URI[chainId], query, variables);

export const fetchUserReferralInfo = async (
  chainId = ChainIds.ARBITRUM,
  variables = {},
): Promise<UserReferralsQuery> => {
  const { userReferral } = await fetcher(
    chainId,
    userReferralQuery,
    variables ?? {},
  );
  return userReferral;
};

export const fetchUserBidsInfo = async (
  chainId = ChainIds.ARBITRUM,
  variables = {},
): Promise<UserBidsQuery | undefined> => {
  const { auctionUsers } = await fetcher(
    chainId,
    userBidsQuery,
    variables ?? {},
  );
  if (auctionUsers && auctionUsers.length > 0) return auctionUsers[0];
};

export const fetchAllBids = async (
  chainId = ChainIds.ARBITRUM,
  variables = {},
): Promise<BidsQuery[]> => {
  const { sellOrders } = await fetcher(chainId, allBidsQuery, variables ?? {});
  return sellOrders;
};

export const getLatestBid = async (
  chainId = ChainIds.ARBITRUM,
  variables = {},
): Promise<LatestBidQuery> => {
  const { sellOrders } = await fetcher(
    chainId,
    latestBidQuery,
    variables ?? {},
  );
  return sellOrders[0];
};

export const getAuctionInfo = async (
  chainId = ChainIds.ARBITRUM,
  variables = {},
) => {
  const { auction } = await fetcher(chainId, auctionInfoQuery, variables ?? {});
  const decodedParams = decodeOrder(auction.initialAuctionOrder);
  return {
    auctionSettled: auction.auctionSettled as boolean,
    auctionStartDate: auction.auctionStartDate as string,
    initialAuctionOrder: {
      auctionUser: { id: decodedParams.userId },
      buyAmount: new BigNumber(decodedParams.buyAmount),
      sellAmount: new BigNumber(decodedParams.sellAmount),
      price: new BigNumber(decodedParams.buyAmount).div(
        decodedParams.sellAmount,
      ),
    },
  };
};
