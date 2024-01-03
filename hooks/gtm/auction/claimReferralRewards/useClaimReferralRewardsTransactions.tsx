import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { Box, Typography, useTheme } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import SubCard from 'components/componentLibrary/Card/SubCard';
import useClaimReferralRewardsCallback from './useClaimReferralRewardsCallback';
import { formatCurrency } from '@utils/index';

export const useClaimReferralRewardsDispatch = (
  amount: BigNumber,
  bidCallback: (err?: any) => void,
) => {
  const { addTransaction, resetState } = useCurrentTransactions();

  const bidFn = useClaimReferralRewardsCallback(amount, bidCallback);

  const formattedETHAmount = formatCurrency(
    amount.div(Math.pow(10, 18).toFixed()),
  );

  const defaultObj = (
    bidTXID: string,
    bidComponent: JSX.Element,
  ): AddTransaction => ({
    title: `Confirm Bid`,
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
        description: `Withdrawing ${formattedETHAmount} ETH`,
        status: 'WAITING',
        actionName: 'Confirm',
        action: () => bidFn(bidTXID),
      },
    ],
    transactionComponent: bidComponent,
  });

  const theme = useTheme();

  const bidComponent = useMemo(() => {
    return (
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
              header="Withdraw Amount"
              value={`${formattedETHAmount} ETH`}
            />
          </SubCard>
        </Box>
      </>
    );
  }, [formattedETHAmount]);

  const startTransactions = useCallback(() => {
    const bidTXID = uuid();
    resetState();
    addTransaction(defaultObj(bidTXID, bidComponent));
  }, [addTransaction, resetState, bidComponent]);

  return startTransactions;
};
