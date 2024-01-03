import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { Box, Typography, useTheme } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import SubCard from 'components/componentLibrary/Card/SubCard';
import useCancelBidCallback from './useCancelBidCallback';
import { formatCurrency } from '@utils/index';

export const useCancelBidTransactionDispatch = (
  bidCallback: (err?: any) => void,
) => {
  const { addTransaction, resetState } = useCurrentTransactions();

  const bidFn = useCancelBidCallback(bidCallback);

  const defaultObj = (
    bidTXID: string,
    buyAmount: BigNumber,
    sellAmount: BigNumber,
    userId: string,
  ): AddTransaction => ({
    title: `Cancel`,
    type: 'Bidding',
    verb: `Bid successful`,
    // TODO: add bid transaction type
    txType: 'lend',
    transactions: [
      // {
      //   uuid: allowance0TXID,
      //   description: `Checking your ${asset.symbol} allowance`,
      //   status: 'WAITING',
      //   actionName: `Approve ${asset.symbol}`,
      //   action: () => approvalFn(allowance0TXID),
      // },
      {
        uuid: bidTXID,
        description: `Cancelling your bid`,
        status: 'WAITING',
        actionName: 'Confirm',
        action: () => bidFn(bidTXID, buyAmount, sellAmount, userId),
      },
    ],
    transactionComponent: (
      <>
        <Box display="flex" flexDirection="column" gap="8px">
          <Typography
            variant="body-small-regular"
            color={theme.palette.neutrals[15]}
          >
            Summary
          </Typography>
          <SubCard padding="16px">
            <HorizontalInfo
              header="Buy Amount"
              value={`${formatCurrency(
                buyAmount.div(Math.pow(10, 18).toFixed()),
              )} ETH`}
            />
            <HorizontalInfo
              header="Sell Amount"
              value={`${formatCurrency(
                sellAmount.div(Math.pow(10, 18).toFixed()),
              )} ETH`}
            />
          </SubCard>
        </Box>
      </>
    ),
  });

  const theme = useTheme();

  const startTransactions = useCallback(
    (buyAmount: BigNumber, sellAmount: BigNumber, userId: string) => {
      const bidTXID = uuid();
      resetState();
      addTransaction(defaultObj(bidTXID, buyAmount, sellAmount, userId));
    },
    [addTransaction, resetState],
  );

  return startTransactions;
};
