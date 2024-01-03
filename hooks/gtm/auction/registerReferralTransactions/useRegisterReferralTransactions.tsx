import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { Box, Typography, useTheme } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import SubCard from 'components/componentLibrary/Card/SubCard';
import useRegisterReferralCallback from './useRegiserReferralCallback';

export const useRegisterReferralTransactionsDispatch = (
  code: string,
  registerCallback: (err?: any) => void,
) => {
  const { addTransaction, resetState } = useCurrentTransactions();

  const registerFn = useRegisterReferralCallback(code, registerCallback);

  const defaultObj = (
    registerTXID: string,
    bidComponent: JSX.Element,
  ): AddTransaction => ({
    title: `Register Referral`,
    type: 'Registering',
    verb: `Registered Successfully`,
    txType: 'lend',
    transactions: [
      {
        uuid: registerTXID,
        description: `Registering code : ${code}`,
        status: 'WAITING',
        actionName: 'Confirm Bid',
        action: () => registerFn(registerTXID),
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
            <HorizontalInfo header="Referral Code" value={code} />
          </SubCard>
        </Box>
      </>
    );
  }, [code]);

  const startTransactions = useCallback(() => {
    const bidTXID = uuid();
    resetState();
    addTransaction(defaultObj(bidTXID, bidComponent));
  }, [addTransaction, resetState, bidComponent]);

  return startTransactions;
};
