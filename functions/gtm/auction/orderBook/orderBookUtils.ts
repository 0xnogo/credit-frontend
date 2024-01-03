import { useMemo } from 'react';
import { useAllBids } from '../getAllBids';
import BigNumber from 'bignumber.js';
import { MinimalAuctionOrder } from 'types/auction';
import useSWR from 'swr';
import { useAuctionInfo } from '../getAuctionData';

export type AuctionChartInfo = {
  volume: number;
  numBids: number;
};

//preRequisite - orders have to be sorted
export function getWinningAmount(
  orders: MinimalAuctionOrder[],
  clearingPriceOrder: MinimalAuctionOrder,
  minFundingThresholdNotReached: boolean,
  volumeClearingPriceOrder: BigNumber,
  auctionEnded?: boolean,
) {
  const { buyAmount: priceNumerator, sellAmount: priceDenominator } =
    clearingPriceOrder;

  let sumAuctioningTokenAmount = new BigNumber(0);

  for (var i = 0; i < orders.length; i++) {
    const { sellAmount } = orders[i];
    if (minFundingThresholdNotReached && auctionEnded) {
      return new BigNumber(0);
    } else {
      if (equalTo(orders[i], clearingPriceOrder)) {
        sumAuctioningTokenAmount = sumAuctioningTokenAmount.plus(
          volumeClearingPriceOrder.times(priceNumerator).div(priceDenominator),
        );
      } else {
        if (smallerThan(orders[i], clearingPriceOrder)) {
          sumAuctioningTokenAmount = sumAuctioningTokenAmount.plus(
            sellAmount.times(priceNumerator).div(priceDenominator),
          );
        } else {
        }
      }
    }
  }

  if (sumAuctioningTokenAmount.gt(0)) {
    return sumAuctioningTokenAmount;
  }

  return new BigNumber(0);
}

export function findClearingPrice(
  sellOrders: MinimalAuctionOrder[],
  userOrder: MinimalAuctionOrder | undefined,
  initialAuctionOrder: MinimalAuctionOrder,
): BigNumber {
  if (userOrder) {
    if (
      userOrder?.price.gt(initialAuctionOrder?.price) &&
      userOrder.sellAmount.gt(0)
    ) {
      sellOrders = sellOrders.concat(userOrder);
    }
  }
  sellOrders = Object.values(sellOrders);

  sellOrders.sort((lhs, rhs) => (smallerThan(lhs, rhs) ? -1 : 1));
  let totalSellVolume = new BigNumber(0);

  for (const order of sellOrders) {
    totalSellVolume = totalSellVolume.plus(order.sellAmount);
    if (
      totalSellVolume.gte(initialAuctionOrder.sellAmount.times(order.price))
    ) {
      const coveredBuyAmount = initialAuctionOrder.sellAmount
        .times(order.price)
        .minus(totalSellVolume.minus(order.sellAmount));
      if (coveredBuyAmount.gte(0) && coveredBuyAmount.lte(order.sellAmount)) {
        return order.price;
      } else {
        return totalSellVolume
          .minus(order.sellAmount)
          .div(initialAuctionOrder.sellAmount);
      }
    }
  }
  if (
    totalSellVolume.gte(
      initialAuctionOrder?.sellAmount.times(initialAuctionOrder?.price),
    )
  ) {
    return totalSellVolume.div(initialAuctionOrder.sellAmount);
  } else {
    return initialAuctionOrder?.price;
  }
}

export function getSettlementInfo(
  sellOrders: MinimalAuctionOrder[],
  userOrder: MinimalAuctionOrder | undefined,
  initialAuctionOrder: MinimalAuctionOrder,
  minFundingThreshold: BigNumber | undefined,
): {
  clearingPriceOrder: MinimalAuctionOrder;
  volumeClearingPriceOrder: BigNumber;
  minFundingThresholdNotReached: boolean;
} {
  if (userOrder) {
    if (
      userOrder?.price > initialAuctionOrder?.price &&
      userOrder.sellAmount.gt(0)
    ) {
      sellOrders = sellOrders.concat(userOrder);
    }
  }
  sellOrders = Object.values(sellOrders);

  sellOrders.sort((lhs, rhs) => (smallerThan(lhs, rhs) ? -1 : 1));
  let nextOrder: MinimalAuctionOrder;
  let currentOrder: MinimalAuctionOrder = {
    auctionUser: { id: '0' },
    buyAmount: new BigNumber(0),
    sellAmount: new BigNumber(0),
    price: new BigNumber(0),
  };
  let clearingOrder: MinimalAuctionOrder;
  let index = 0;
  let currentBidSum = new BigNumber(0);
  let sellAmountOfIter = new BigNumber(0);
  let buyAmountOfIter = new BigNumber(0);
  let volumeClearingPriceOrder = new BigNumber(0);
  let minFundingThresholdNotReached = false;

  const { buyAmount: minAuctionedBuyAmount, sellAmount: fullAuctionedAmount } =
    initialAuctionOrder;
  do {
    nextOrder = sellOrders[index++];
    if (!nextOrder) {
      break;
    }
    currentOrder = nextOrder;
    const { buyAmount, sellAmount } = currentOrder;
    sellAmountOfIter = sellAmount;
    buyAmountOfIter = buyAmount;
    currentBidSum = currentBidSum.plus(sellAmountOfIter);
  } while (
    currentBidSum
      .times(buyAmountOfIter)
      .lt(fullAuctionedAmount.times(sellAmountOfIter))
  );

  if (
    currentBidSum.gt(0) &&
    currentBidSum
      .times(buyAmountOfIter)
      .gte(fullAuctionedAmount.times(sellAmountOfIter))
  ) {
    const uncoveredBids = currentBidSum.minus(
      fullAuctionedAmount.times(sellAmountOfIter).div(buyAmountOfIter),
    );

    if (sellAmountOfIter >= uncoveredBids) {
      let sellAmountClearingOrder = sellAmountOfIter.minus(uncoveredBids);
      volumeClearingPriceOrder = sellAmountClearingOrder;

      currentBidSum = currentBidSum.minus(uncoveredBids);
      clearingOrder = currentOrder as MinimalAuctionOrder;
    } else {
      currentBidSum = currentBidSum.minus(sellAmountOfIter);
      clearingOrder = {
        auctionUser: { id: '0' },
        buyAmount: fullAuctionedAmount,
        sellAmount: currentBidSum,
        price: currentBidSum.div(fullAuctionedAmount),
      };
    }
  } else {
    if (currentBidSum > minAuctionedBuyAmount) {
      clearingOrder = {
        auctionUser: { id: '0' },
        buyAmount: fullAuctionedAmount,
        sellAmount: currentBidSum,
        price: currentBidSum.div(fullAuctionedAmount),
      };
    } else {
      clearingOrder = {
        auctionUser: { id: '0' },
        buyAmount: fullAuctionedAmount,
        sellAmount: minAuctionedBuyAmount,
        price: minAuctionedBuyAmount.div(fullAuctionedAmount),
      };
    }
  }

  if (minFundingThreshold && minFundingThreshold.gt(currentBidSum)) {
    minFundingThresholdNotReached = true;
  }

  if (clearingOrder.buyAmount.eq(0))
    return {
      clearingPriceOrder: initialAuctionOrder,
      volumeClearingPriceOrder,
      minFundingThresholdNotReached,
    };
  return {
    clearingPriceOrder: clearingOrder,
    volumeClearingPriceOrder,
    minFundingThresholdNotReached,
  };
}

export function equalTo(
  orderLeft: MinimalAuctionOrder,
  orderRight: MinimalAuctionOrder,
) {
  const {
    auctionUser: { id: userIdLeft },
    buyAmount: priceNumeratorLeft,
    sellAmount: priceDenominatorLeft,
  } = orderLeft;
  const {
    auctionUser: { id: userIdRight },
    buyAmount: priceNumeratorRight,
    sellAmount: priceDenominatorRight,
  } = orderRight;

  return (
    userIdLeft === userIdRight &&
    priceNumeratorLeft.eq(priceNumeratorRight) &&
    priceDenominatorLeft.eq(priceDenominatorRight)
  );
}

export function smallerThan(
  orderLeft: MinimalAuctionOrder,
  orderRight: MinimalAuctionOrder,
) {
  const {
    auctionUser: { id: userIdLeft },
    buyAmount: priceNumeratorLeft,
    sellAmount: priceDenominatorLeft,
  } = orderLeft;
  const {
    auctionUser: { id: userIdRight },
    buyAmount: priceNumeratorRight,
    sellAmount: priceDenominatorRight,
  } = orderRight;

  if (
    priceNumeratorLeft
      .times(priceDenominatorRight)
      .lt(priceNumeratorRight.times(priceDenominatorLeft))
  )
    return true;
  if (
    priceNumeratorLeft
      .times(priceDenominatorRight)
      .gt(priceNumeratorRight.times(priceDenominatorLeft))
  )
    return false;

  if (priceNumeratorLeft.lt(priceNumeratorRight)) return true;
  if (priceNumeratorLeft.gt(priceNumeratorRight)) return false;
  if (userIdLeft < userIdRight) {
    return true;
  }
  return false;
}

export function useSettledAuctionInfo(
  userOrder: MinimalAuctionOrder | undefined,
) {
  const {
    data: { initialAuctionOrder, minFundingThreshold },
  } = useAuctionInfo();

  const { data: bids } = useAllBids();
  return useSWR(
    bids && initialAuctionOrder
      ? ['auction-settle-price-info', bids, userOrder, initialAuctionOrder]
      : null,
    async () => {
      return getSettlementInfo(
        bids,
        userOrder,
        initialAuctionOrder as MinimalAuctionOrder,
        minFundingThreshold,
      );
    },
  );
}

export function useClearingPrice(userOrder: MinimalAuctionOrder | undefined) {
  const {
    data: { initialAuctionOrder },
  } = useAuctionInfo();

  const { data: bids } = useAllBids();
  const data = useSWR(
    bids && initialAuctionOrder
      ? ['auction-clearing-price-info', bids, userOrder, initialAuctionOrder]
      : null,
    async () => {
      return findClearingPrice(
        bids,
        userOrder,
        initialAuctionOrder as MinimalAuctionOrder,
      );
    },
  );

  return { ...data, data: data.data || new BigNumber(0) };
}

export function useAuctionChartingData(userOrder?: MinimalAuctionOrder) {
  const { data: bids } = useAllBids();

  const {
    data: { initialAuctionOrder },
  } = useAuctionInfo();

  const { data: settledAuctionInfo } = useSettledAuctionInfo(userOrder);

  const { data: clearingPrice } = useClearingPrice(userOrder);

  const accumulatedBids = useMemo(() => {
    if (!clearingPrice || !bids || !initialAuctionOrder)
      return [
        {
          volume: 0,
          numBids: 0,
          x: 0,
          y: 10,
          label: `Price < ${0}`,
        },
        {
          volume: 0,
          numBids: 0,
          x: 1,
          y: 10,
          label: `Price >= ${0}`,
        },
      ];

    // const {
    //   clearingPriceOrder: { price: clearingPrice },
    // } = settledAuctionInfo;
    let orders: (MinimalAuctionOrder & { winningAmount?: BigNumber })[] = [
      ...bids,
    ];

    if (userOrder) {
      orders = [...orders, userOrder];
    }

    const greaterThanClearingInfo = orders.reduce<AuctionChartInfo>(
      (acc, curr) => {
        // curr?.winningAmount && curr?.winningAmount.gt(0)
        if (curr.price.gte(clearingPrice)) {
          return {
            volume:
              acc.volume + curr.sellAmount.div(Math.pow(10, 18)).toNumber(),
            numBids: acc.numBids + 1,
          };
        }
        return acc;
      },
      {
        volume: 0,
        numBids: 0,
      },
    );

    const lesserThanClearingInfo = orders.reduce<AuctionChartInfo>(
      (acc, curr) => {
        // !curr?.winningAmount || curr?.winningAmount.lte(0)
        if (curr.price.lt(clearingPrice)) {
          return {
            volume:
              acc.volume + curr.sellAmount.div(Math.pow(10, 18)).toNumber(),
            numBids: acc.numBids + 1,
          };
        }
        return acc;
      },
      {
        volume: 0,
        numBids: 0,
      },
    );

    return [
      {
        ...lesserThanClearingInfo,
        x: 0,
        y: lesserThanClearingInfo.volume + 10,
        label: `Price < ${clearingPrice}`,
      },
      {
        ...greaterThanClearingInfo,
        x: 1,
        y: greaterThanClearingInfo.volume + 10,
        label: `Price >= ${clearingPrice}`,
      },
    ];
  }, [bids, settledAuctionInfo, clearingPrice, userOrder]);

  return {
    clearingPriceX: 0.5,
    clearingPrice,
    accumulatedBids,
  };
}
