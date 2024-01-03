import gql from 'graphql-tag';

export const auctionInfoQuery = gql`
  query auctionInfoQuery {
    auction(id: "creditAuction") {
      initialAuctionOrder
      auctionSettled
      auctionStartDate
    }
  }
`;

export const userReferralQuery = gql`
  query userReferralQuery($id: ID!) {
    userReferral(id: $id) {
      ordersReferredCount
      ordersWonCount
      totalWinningSellAmount
      rewardBalance
      totalRewards
      totalSellAmount
      totalCreditWinningsForReferredOrders
    }
  }
`;

export const userBidsQuery = gql`
  query userBidsQuery($address: String!, $auctionId: ID!) {
    auctionUsers(where: {address: $address}) {
      auctionSellOrders(where: {cancelled: false, auction: $auctionId}) {
        buyAmount
        sellAmount
        timestamp
        price
        referral {
          id
        }
        auctionUser {
          id
        }
        cancelled
        orderClaimed
        winningAmount
      }
      id
    }
  }
`;

export const allBidsQuery = gql`
  query allBidsQuery {
    sellOrders(
      orderBy: timestamp
      orderDirection: desc
      where: { cancelled: false }
    ) {
      buyAmount
      sellAmount
      timestamp
      referral {
        id
      }
      auctionUser {
        id
      }
      cancelled
      orderClaimed
      winningAmount
    }
  }
`;

export const latestBidQuery = gql`
  query allBidsQuery {
    sellOrders(orderBy: timestamp, orderDirection: desc, first: 1) {
      buyAmount
      sellAmount
      auctionUser {
        id
      }
    }
  }
`;