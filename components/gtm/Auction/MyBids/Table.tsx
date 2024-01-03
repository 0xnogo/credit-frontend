import * as React from 'react';
import TableComponent, { ColumnData } from '@components/componentLibrary/Table';
import { useMemo } from 'react';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { XCaliButton } from '@components/componentLibrary/Button/XCaliButton';
import { useCancelBidTransactionDispatch } from 'hooks/gtm/auction/cancelBidTransactions/useCancelBidTransactions';
import { useUserBidInfo } from '@functions/gtm/auction/getUserBidInfo';
import { formatCurrency } from '@utils/index';
import { useAuctionInfo } from '@functions/gtm/auction/getAuctionData';
import {
  getWinningAmount,
  useSettledAuctionInfo,
} from '@functions/gtm/auction/orderBook/orderBookUtils';
import { useClaimBidsDispatch } from 'hooks/gtm/auction/claimBids/useClaimBidTransactions';

const columns: ColumnData[] = [
  {
    width: 50,
    label: 'Position',
    dataKey: 'position',
  },
  {
    width: 120,
    label: 'ETH Amount',
    dataKey: 'contributed',
  },
  {
    width: 120,
    label: 'Credit Amount',
    dataKey: 'winningAmount',
  },
  {
    width: 120,
    label: 'Price(ETH/CREDIT)',
    dataKey: 'price',
  },
  {
    width: 120,
    label: 'Date Created',
    dataKey: 'date',
  },
  {
    width: 100,
    label: 'Referral Code',
    dataKey: 'referral',
  },
  {
    width: 120,
    label: '',
    dataKey: 'action',
  },
];

export default function MyBidsTable() {
  const {
    data: { auctionSellOrders },
    mutate,
  } = useUserBidInfo();

  const { data: auctionInfo } = useAuctionInfo();

  const { account } = useActiveWeb3React();

  const cancelBidDispatch = useCancelBidTransactionDispatch((err?) => {
    if (!err) mutate();
  });

  const claimBidDisptach = useClaimBidsDispatch((err?) => {
    if (!err) mutate();
  });

  const { data: settledAuctionInfo } = useSettledAuctionInfo(undefined);

  const isCancelDisabled =
    Date.now() >= auctionInfo.orderCancellationEndData * 1000;

  const isClaimable = auctionInfo.auctionSettled;

  const formattedSellOrders = useMemo(() => {
    return auctionSellOrders.map((order, index) => {
      const winningAmount =
        auctionInfo.auctionSettled &&
        settledAuctionInfo &&
        !settledAuctionInfo.minFundingThresholdNotReached &&
        settledAuctionInfo.clearingPriceOrder
          ? formatCurrency(
              getWinningAmount(
                [order],
                settledAuctionInfo.clearingPriceOrder,
                settledAuctionInfo.minFundingThresholdNotReached,
                settledAuctionInfo.volumeClearingPriceOrder,
                auctionInfo.auctionSettled,
              )
                .div(Math.pow(10, 18))
                .toNumber(),
              6,
            )
          : '-';
      return {
        position: `#${index + 1}`,
        contributed: formatCurrency(
          order.sellAmount.div(Math.pow(10, 18)).toFixed(),
          6,
        ),
        creditQuantity: formatCurrency(
          order.buyAmount.div(Math.pow(10, 18)).toFixed(),
          6,
        ),
        date: new Date(Number(order.timestamp) * 1000).toUTCString(),
        address: account,
        referral: order.referral?.id ?? '-',
        price: formatCurrency(order.price.toFixed(), 6),
        winningAmount: winningAmount,
        action: isClaimable ? (
          <XCaliButton
            disabled={order.orderClaimed}
            onClickFn={() =>
              claimBidDisptach(
                order,
                winningAmount,
                winningAmount !== '-'
                  ? '-'
                  : order.sellAmount.div(Math.pow(10, 18)).toFixed(),
              )
            }
            Component={order.orderClaimed ? 'Settled' : 'Settle'}
          />
        ) : (
          <XCaliButton
            disabled={isCancelDisabled}
            onClickFn={() =>
              cancelBidDispatch(
                order.buyAmount,
                order.sellAmount,
                order.auctionUser.id,
              )
            }
            Component={'Cancel'}
          />
        ),
      };
    });
  }, [
    auctionSellOrders,
    account,
    isClaimable,
    settledAuctionInfo,
    auctionInfo.auctionSettled,
    cancelBidDispatch,
    claimBidDisptach,
    isCancelDisabled,
  ]);

  return (
    <TableComponent
      height={400}
      width={'100%'}
      rows={formattedSellOrders}
      columns={columns}
    />
  );
}

//0.0276900000000003
