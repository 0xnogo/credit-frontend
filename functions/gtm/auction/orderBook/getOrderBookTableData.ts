import round from 'lodash.round';
import { useMemo } from 'react';
import { MinimalAuctionOrder } from 'types/auction';
import BigNumber from 'bignumber.js';
import { useAllBids } from '../getAllBids';
import { useUserBidInfo } from '../getUserBidInfo';

export const countDecimals = function (num: number) {
  const text = num.toString();
  if (text.indexOf('e-') > -1) {
    const [base, trail] = text.split('e-');
    const elen = parseInt(trail, 10);
    const idx = base.indexOf('.');
    return idx == -1 ? 0 + elen : base.length - idx - 1 + elen;
  }
  const index = text.indexOf('.');
  return index == -1 ? 0 : text.length - index - 1;
};

export interface OrderBookTableData {
  amount: number;
  sum: number;
  mySize: number;
}

export const buildTableData = (
  bids: MinimalAuctionOrder[],
  myBids: MinimalAuctionOrder[],
) => {
  const rangeVolume = new Map<number, OrderBookTableData>();
  const myBidsPriceRange = new Map<number, number>();
  let cumulativeSum = 0;

  const sortedBids = [...bids].sort((a, b) =>
    b.price.minus(a.price).toNumber(),
  );
  for (const myBid of myBids) {
    const priceRange = getPriceRangeKey(myBid.price, 0.0000001);
    myBidsPriceRange.set(myBid.price.toNumber(), priceRange);
  }

  for (const bid of sortedBids) {
    const bidVolume = bid.sellAmount.div(Math.pow(10, 18)).toNumber();
    const key = getPriceRangeKey(bid.price, 0.0000001);
    const currentValue = rangeVolume.get(key) || {
      amount: 0,
      sum: cumulativeSum,
      mySize: 0,
    };
    currentValue.amount = currentValue.amount + bidVolume;
    currentValue.sum = currentValue.sum + bidVolume;
    cumulativeSum += bidVolume;

    let mySize = 0;
    for (const myBid of myBids) {
      const priceRange = myBidsPriceRange.get(myBid.price.toNumber());
      if (priceRange === key) {
        const mybidVolume = bid.sellAmount.div(Math.pow(10, 18)).toNumber();
        mySize += (mybidVolume / currentValue.amount) * 100;
      }
    }
    currentValue.mySize = Math.min(round(mySize, 2), 100);

    rangeVolume.set(key, currentValue);
  }

  return Array.from(rangeVolume, ([price, value]) => ({ price, ...value }));
};

const getPriceRangeKey = (price: BigNumber, granularity: number): number => {
  return granularity > 1
    ? Math.floor(price.toNumber() / granularity) * granularity
    : round(price.toNumber(), countDecimals(granularity));
};

export function useOrderbookTableData() {
  const { data: bids } = useAllBids();

  const {
    data: { auctionSellOrders: myBids },
  } = useUserBidInfo();

  return useMemo(() => {
    return buildTableData(bids, myBids);
  }, [bids, myBids]);
}
