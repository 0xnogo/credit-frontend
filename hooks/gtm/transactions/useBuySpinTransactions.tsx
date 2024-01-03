import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { Box, Typography, useTheme } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import SubCard from 'components/componentLibrary/Card/SubCard';
import { SPIN_PURCHASER_ADDRESS, passHolderSpinCost } from '@constants/gtm';
import { getTokenApproval } from 'functions/approval/getTokenApproval';
import useTokenApprovalCallback from 'hooks/approval/useTokenApproval';
import { useBuySpinsCallback } from './useBuySpinsCallback';

export const useBuySpinTransactions = (
  token: Token,
  depositCallback: any,
  spinAmount: BigNumber,
  ethAmount: BigNumber,
) => {
  const theme = useTheme();
  const { account, web3, chainId } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState } =
    useCurrentTransactions();

  const approvalFn = useTokenApprovalCallback(
    token,
    SPIN_PURCHASER_ADDRESS,
    depositCallback,
  );

  const purchaseFn = useBuySpinsCallback(
    new BigNumber(passHolderSpinCost).times(Math.pow(10, 18)),
    depositCallback,
    spinAmount,
    ethAmount,
  );

  const defaultObj = (
    allowance0TXID: string,
    purchaseTXID: string,
    component: JSX.Element,
  ): AddTransaction => ({
    title: `Purchasing ${spinAmount} spins`,
    verb: 'Spins Purchase',
    type: 'Spins',
    transactions: [
      {
        uuid: allowance0TXID,
        description: `Checking allowance`,
        status: 'WAITING',
        actionName: 'Approve',
        action: () => approvalFn(allowance0TXID),
      },
      {
        uuid: purchaseTXID,
        description: `Deposit tokens in the pool`,
        status: 'WAITING',
        actionName: 'Purchase Spins',
        action: () => purchaseFn(purchaseTXID),
      },
    ],
    txType: 'lend',
    transactionComponent: component,
  });

  const component = useMemo(() => {
    return (
      <>
        <Box gap="5px">
          <Typography
            variant="body-small-regular"
            color={theme.palette.neutrals[15]}
          >
            Summary
          </Typography>
          <SubCard>
            <HorizontalInfo
              header="No. of Spins"
              value={`${spinAmount.toFixed()}`}
            />
            <HorizontalInfo
              header="ETH amount"
              value={`${ethAmount.toFixed()}`}
            />
          </SubCard>
        </Box>
      </>
    );
  }, [spinAmount]);

  const startTransactions = useCallback(() => {
    const allowanceTXID = uuid();
    const txID = uuid();
    resetState();
    addTransaction(defaultObj(allowanceTXID, txID, component));
    setTimeout(() => {
      getTokenApproval(
        token,
        chainId,
        web3,
        account as string,
        ethAmount,
        SPIN_PURCHASER_ADDRESS,
        setTransactionStatus,
        allowanceTXID,
        depositCallback,
      );
    });
  }, [
    addTransaction,
    resetState,
    defaultObj,
    component,
    chainId,
    web3,
    account,
    setTransactionStatus,
  ]);

  return startTransactions;
};
