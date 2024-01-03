import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import useClaimBidsCallback from './useClaimBidsCallback';
import { MinimalAuctionOrder } from 'types/auction';
import { Box, Typography, useTheme } from '@mui/material';
import SubCard from '@components/componentLibrary/Card/SubCard';
import HorizontalInfo from '@components/componentLibrary/Info/HorizontalInfo';
import { formatCurrency } from '@utils/index';

export const useClaimBidsDispatch = (bidCallback: (err?: any) => void) => {
  const theme = useTheme();

  const { addTransaction, resetState } = useCurrentTransactions();

  const bidFn = useClaimBidsCallback(bidCallback);

  const defaultObj = (
    bidTXID: string,
    order: MinimalAuctionOrder,
    winningAmount: string,
    ethRefunded: string,
  ): AddTransaction => ({
    title: `Settle Bid`,
    type: 'Bidding',
    verb: `Bid successful`,
    // TODO: add bid transaction type
    txType: 'lend',
    transactions: [
      {
        uuid: bidTXID,
        description: `Claim Bid`,
        status: 'WAITING',
        actionName: 'Confirm',
        action: () => bidFn(bidTXID, order),
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
              header="Winning Amount"
              value={`${formatCurrency(winningAmount, 6)} CREDIT`}
            />
            <HorizontalInfo
              header="ETH refunded"
              value={`${formatCurrency(ethRefunded, 3)} ETH`}
            />
          </SubCard>
        </Box>
      </>
    ),
  });

  const startTransactions = useCallback(
    (
      order: MinimalAuctionOrder,
      winningAmount: string,
      ethRefunded: string,
    ) => {
      const bidTXID = uuid();
      resetState();
      addTransaction(defaultObj(bidTXID, order, winningAmount, ethRefunded));
    },
    [addTransaction, resetState],
  );

  return startTransactions;
};
