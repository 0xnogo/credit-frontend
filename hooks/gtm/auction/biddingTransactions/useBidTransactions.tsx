import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { Box, Typography, useTheme } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import SubCard from 'components/componentLibrary/Card/SubCard';
import useBidCallback from './useBidCallback';

export const useBidTransactionDispatch = (
  asset: Token,
  pricePerToken: BigNumber,
  sellAmount: BigNumber,
  referralId: string | undefined,
  bidCallback: (err?: any) => void,
) => {
  const buyAmount = sellAmount.div(pricePerToken);

  const { addTransaction, setTransactionStatus, resetState } =
    useCurrentTransactions();

  const bidFn = useBidCallback(
    asset,
    buyAmount,
    sellAmount,
    referralId,
    bidCallback,
    setTransactionStatus,
  );

  const defaultObj = (
    allowance0TXID: string,
    bidTXID: string,
    bidComponent: JSX.Element,
  ): AddTransaction => ({
    title: `Confirm Bid`,
    type: 'Bidding',
    verb: `Bid successful`,
    txType: 'lend',
    transactions: [
      {
        uuid: bidTXID,
        description: `Bidding ${buyAmount} ${asset.symbol}. $CREDIT amount: ${sellAmount.div}`,
        status: 'WAITING',
        actionName: 'Confirm Bid',
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
              header="Total ETH"
              value={`${sellAmount.toString()} ETH`}
            />
            <HorizontalInfo
              header="$CREDIT amount"
              value={`${buyAmount.toString()} $CREDIT`}
            />
            {referralId && (
              <HorizontalInfo header="Referral Id" value={referralId} />
            )}
          </SubCard>
        </Box>
      </>
    );
  }, [buyAmount, asset?.symbol, sellAmount, referralId]);

  const startTransactions = useCallback(() => {
    const allowance0TXID = uuid();
    const bidTXID = uuid();
    resetState();
    addTransaction(defaultObj(allowance0TXID, bidTXID, bidComponent));
  }, [addTransaction, resetState, bidComponent]);

  return startTransactions;
};
