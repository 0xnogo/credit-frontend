import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { Box, Typography, useTheme } from '@mui/material';
import SubCard from 'components/componentLibrary/Card/SubCard';
import { useClaimCallback } from './useClaimCallback';
import { CreditPosition } from 'functions/credit/creditPositions';
import useCreditPositionAllowanceCallback from 'hooks/approval/useCreditPositionApproval';
import { getCreditPositionApproval } from 'functions/approval/getCreditPositionApproval';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import MultiCoinBalance from '@components/componentLibrary/MultiCoinBalances';
import VerticalInfo from '@components/componentLibrary/Info/VerticalInfo';

export const useClaimTransactionsDispatch = (
  asset: Token,
  collateral: Token,
  maturity: BigNumber,
  position: CreditPosition,
  claimCallback: (err?: any) => void,
  withdrawAssetAmount: BigNumber,
  withdrawCollateralAmount: BigNumber,
) => {
  const { web3, chainId } = useActiveWeb3React();
  const { addTransaction, resetState, setTransactionStatus } =
    useCurrentTransactions();

  const assetApprovalFn = useCreditPositionAllowanceCallback(
    position.positionIndex,
    addTransaction,
    () => {},
  );

  const claimFn = useClaimCallback(
    asset,
    collateral,
    maturity,
    position,
    claimCallback,
  );

  const defaultObj = (
    allowanceTXID: string,
    claimTXID: string,
    component: JSX.Element,
  ): AddTransaction => ({
    title: `Claim Rewards`,
    type: 'Repaying',
    verb: `Rewards Claimed Successfully`,
    transactions: [
      {
        uuid: allowanceTXID,
        description: `Checking your position allowance`,
        status: 'WAITING',
        actionName: `Approve Position`,
        action: () => assetApprovalFn(allowanceTXID),
      },
      {
        uuid: claimTXID,
        description: `Claim ${asset.symbol} / ${collateral.symbol}`,
        status: 'WAITING',
        actionName: 'Confirm',
        action: () => claimFn(claimTXID),
      },
    ],
    transactionComponent: component,
    txType: 'lend',
  });

  const theme = useTheme();

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
            <VerticalInfo
              header="Redeemable Amounts"
              value={
                <MultiCoinBalance
                  tokens={[asset as Token, collateral as Token]}
                  values={[withdrawAssetAmount, withdrawCollateralAmount]}
                  showUSD={true}
                  andOr={'AND'}
                />
              }
            />
          </SubCard>
        </Box>
      </>
    );
  }, [
    position,
    asset,
    collateral,
    withdrawAssetAmount,
    withdrawCollateralAmount,
  ]);

  const startTransactions = useCallback(() => {
    const allowanceTXID = uuid();
    const txID = uuid();
    resetState();
    addTransaction(defaultObj(allowanceTXID, txID, component));
    setTimeout(() => {
      getCreditPositionApproval(
        chainId,
        web3,
        setTransactionStatus,
        position.positionIndex,
        allowanceTXID,
        undefined,
      );
    });
  }, [
    addTransaction,
    resetState,
    defaultObj,
    component,
    web3,
    chainId,
    position,
    setTransactionStatus,
  ]);

  return startTransactions;
};
