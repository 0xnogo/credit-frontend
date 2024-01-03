import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import { useCallback, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import InfoCard from 'components/componentLibrary/Card/InfoCard';
import { Box, Typography, useTheme } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import formatTimestamp from '@utils/index';
import { useRepayCallback } from './useRepayCallback';
import useConvenienceAllowanceCallback from 'hooks/approval/useConvenienceApproval';
import CoinBalance from '@components/componentLibrary/CoinBalance';
import { getConvenienceApproval } from '@functions/approval/getConvenienceApproval';
import { getCreditPositionApproval } from '@functions/approval/getCreditPositionApproval';
import useCreditPositionApprovalCallback from 'hooks/approval/useCreditPositionApproval';

export const useRepayTransactionsDispatch = (
  asset: Token,
  collateral: Token,
  maturity: BigNumber,
  assetIn: BigNumber,
  collateralOut: BigNumber,
  positionId: string,
  repayCallback: (err?: any) => void,
  handleCloseParent: any,
) => {

  const { account, web3, chainId } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState } =
    useCurrentTransactions();

  const afterAssetApprovalCallback = async (id: string) => {
    await getCreditPositionApproval(
      chainId,
      web3,
      setTransactionStatus,
      positionId,
      id,
      undefined,
    );
  };

  const approvalFn = useConvenienceAllowanceCallback(
    asset,
    assetIn,
    repayCallback,
    addTransaction,
    setTransactionStatus,
    afterAssetApprovalCallback,
  );

  const positionApprovalFn = useCreditPositionApprovalCallback(
    positionId,
    (err) => repayCallback(err),
  );

  const repayFn = useRepayCallback(
    asset,
    collateral,
    maturity,
    assetIn,
    positionId,
    '10',
    '1',
    repayCallback,
  );

  const defaultObj = (
    allowance0TXID: string,
    allowance1TXID: string,
    repayTXID: string,
    component: JSX.Element,
    amount:BigNumber
  ): AddTransaction => ({
    title: `Repay`,
    type: 'Repaying',
    verb: `${asset.symbol} repaid successfully`,
    transactions: [
      {
        uuid: allowance0TXID,
        description: `Checking your ${asset.symbol} allowance`,
        status: 'WAITING',
        actionName: `Approve ${asset.symbol}`,
        action: () => approvalFn(allowance0TXID, allowance1TXID),
      },
      {
        uuid: allowance1TXID,
        description: `Checking your nft allowance`,
        status: 'WAITING',
        actionName: `Approve NFT #${positionId}`,
        action: () => positionApprovalFn(allowance1TXID),
      },
      {
        uuid: repayTXID,
        description: `Repay ${asset.symbol}`,
        status: 'WAITING',
        actionName: `Confirm`,
        action: () => repayFn(amount, repayTXID),
      },
    ],
    transactionComponent: component,
    txType: 'borrow',
  });

  const theme = useTheme();

  const component = useMemo(() => {
    return (
      <>
        <Box display="flex" flexDirection="column" gap="8px" marginTop="24px">
          <Typography
            variant="body-small-regular"
            color={theme.palette.neutrals[15]}
          >
            Summary
          </Typography>
          <InfoCard display="flex" flexDirection="column">
            <HorizontalInfo
              header="Total debt to repay"
              value={
                <CoinBalance value={assetIn} token={asset} showUSD={true} />
              }
            />
            <HorizontalInfo
              header="Collateral to unlock"
              value={
                <CoinBalance
                  value={collateralOut}
                  token={collateral}
                  showUSD={true}
                />
              }
            />
            <HorizontalInfo
              header="Expiry date"
              value={`${formatTimestamp(maturity.toString())}`}
            />
          </InfoCard>
        </Box>
      </>
    );
  }, [assetIn, asset, maturity, collateralOut, collateral]);

  const startTransactions = useCallback((amount:BigNumber) => {
    const allowanceTXID = uuid();
    const allowance1TXID = uuid();
    const txID = uuid();
    resetState();
    addTransaction(defaultObj(allowanceTXID, allowance1TXID, txID, component, amount));
    handleCloseParent();
    setTimeout(() => {
      getConvenienceApproval(
        asset,
        chainId,
        web3,
        account as string,
        amount,
        setTransactionStatus,
        allowanceTXID,
        () => afterAssetApprovalCallback(allowance1TXID),
      );
    });
  }, [
    addTransaction,
    resetState,
    defaultObj,
    component,
    handleCloseParent,
    assetIn,
    asset,
    chainId,
    web3,
    account,
    setTransactionStatus,
    collateral,
    maturity,
    positionId,
    repayCallback,
    afterAssetApprovalCallback,
  ]);

  return startTransactions;
};
