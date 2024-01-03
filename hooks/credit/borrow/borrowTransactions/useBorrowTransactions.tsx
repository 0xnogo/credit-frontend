import BigNumber from "bignumber.js";
import { Token } from "types/assets";
import { useCallback, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { useCurrentTransactions } from "hooks/useCurrentTransactions";
import { AddTransaction } from "types/transactions";
import { useActiveWeb3React } from "services/web3/useActiveWeb3React";
import InfoCard from "components/componentLibrary/Card/InfoCard";
import { Box, Typography, useTheme } from "@mui/material";
import HorizontalInfo from "components/componentLibrary/Info/HorizontalInfo";
import formatTimestamp, { formatCurrency } from "@utils/index";
import SubCard from "components/componentLibrary/Card/SubCard";
import useConvenienceAllowanceCallback from "hooks/approval/useConvenienceApproval";
import { getConvenienceApproval } from "functions/approval/getConvenienceApproval";
import { useBorrowCallback } from "./useBorrowCallback";
import CoinBalance from "@components/componentLibrary/CoinBalance";

export const useBorrowTransactionsDispatch = (
  apr: BigNumber,
  cdp: BigNumber,
  handleCloseParent: any,
  asset: Token,
  collateral: Token,
  maturity: BigNumber,
  assetOut: BigNumber,
  dueOut: { debt: BigNumber; collateral: BigNumber },
  percent: BigNumber,
  borrowFees: BigNumber,
  deadline: string,
  slippage: string,
  dateCreated: number,
  borrowCallback: (err?: any) => void
) => {
  const theme = useTheme();
  const { account, web3, chainId } = useActiveWeb3React();

  const {
    addTransaction,
    setTransactionStatus,
    resetState,
    transactionInfo,
  } = useCurrentTransactions();

  const sendSlippageInc = new BigNumber(100).plus(slippage).div(100);
  const maxCollateral = dueOut.collateral
    .times(sendSlippageInc)
    .div(Math.pow(10, collateral.decimals));

  const approvalFn = useConvenienceAllowanceCallback(
    collateral,
    maxCollateral,
    borrowCallback,
    addTransaction,
    setTransactionStatus,
    transactionInfo
  );

  const borrowFn = useBorrowCallback(
    asset,
    collateral,
    maturity,
    assetOut,
    dueOut,
    percent,
    deadline,
    slippage,
    borrowCallback
  );

  const defaultObj = (
    allowance0TXID: string,
    borrowTXID: string,
    component: JSX.Element
  ): AddTransaction => ({
    title: `Confirm Borrow`,
    type: "Borrowing",
    txType: "borrow",
    verb: `${asset.symbol} borrowed successfully`,
    transactions: [
      {
        uuid: allowance0TXID,
        actionName: `Approve ${collateral.symbol}`,
        description: `Checking your ${asset.symbol} allowance`,
        status: "WAITING",
        action: () => approvalFn(allowance0TXID),
      },
      {
        uuid: borrowTXID,
        actionName: `Confirm`,
        description: `Borrow ${asset.symbol}`,
        status: "WAITING",
        action: () => borrowFn(borrowTXID),
      },
    ],
    transactionComponent: component,
  });

  const dailyYield = Math.pow(
    new BigNumber(apr ?? 0).div(100).plus(1).toNumber(),
    1 / 365
  );

  const loanTerm = new BigNumber(maturity).minus(dateCreated).toNumber();

  // Calculated using metrics.APR, taking into account the full loan term
  const positionYield = new BigNumber(
    Math.pow(dailyYield, new BigNumber(loanTerm).div(86400).toNumber())
  ).minus(1);

  const component = useMemo(() => {
    return (
      <>
        <Box display="flex" flexDirection="column" gap="8px" marginTop="24px">
          <Typography
            variant="body-small-regular"
            color={theme.palette.neutrals[15]}
          >
            Collateral & Borrow Amount
          </Typography>
          <SubCard padding="16px">
            <HorizontalInfo
              header="Max Collateral Deposit"
              value={
                <CoinBalance
                  token={collateral}
                  value={dueOut.collateral.div(
                    Math.pow(10, collateral.decimals)
                  )}
                  showUSD={true}
                />
              }
            />
            <HorizontalInfo
              header="Borrow Amount"
              value={
                <CoinBalance token={asset} value={assetOut} showUSD={true} />
              }
            />
            <HorizontalInfo
              header="CDP"
              value={`${formatCurrency(cdp.times(100).toFixed(), 2)}%`}
            />
          </SubCard>
        </Box>
        <Box display="flex" flexDirection="column" gap="8px">
          <Typography
            variant="body-small-regular"
            color={theme.palette.neutrals[15]}
          >
            Position Summary
          </Typography>
          <InfoCard display="flex" flexDirection="column">
            <HorizontalInfo
              header="Interest rate"
              value={`${formatCurrency(
                (positionYield ?? "0").times(100).toString()
              )}%`}
            />
            <HorizontalInfo
              header="Fees"
              value={
                <CoinBalance
                  token={asset}
                  value={borrowFees.div(Math.pow(10, asset?.decimals))}
                  showLogo={true}
                  showUSD={true}
                />
              }
            />
            <HorizontalInfo
              header="Expiry date"
              value={`${formatTimestamp(maturity.toString())}`}
            />
            <HorizontalInfo
              header="Loan term"
              value={`${formatCurrency(
                (maturity.toNumber() - Date.now() / 1000) / 86400
              )} days`}
            />
            <HorizontalInfo
              header="Debt to repay"
              value={
                <CoinBalance
                  token={asset}
                  value={dueOut.debt.div(Math.pow(10, asset.decimals))}
                  showUSD={true}
                />
              }
            />
          </InfoCard>
        </Box>
      </>
    );
  }, [assetOut, collateral, maturity, asset, apr, dueOut, cdp, borrowFees]);

  const startTransactions = useCallback(() => {
    const allowanceTXID = uuid();
    const txID = uuid();
    resetState();
    addTransaction(defaultObj(allowanceTXID, txID, component));
    handleCloseParent();
    setTimeout(() => {
      getConvenienceApproval(
        collateral,
        chainId,
        web3,
        account as string,
        maxCollateral,
        setTransactionStatus,
        allowanceTXID
      );
    });
  }, [
    addTransaction,
    resetState,
    defaultObj,
    component,
    handleCloseParent,
    assetOut,
    asset,
    chainId,
    web3,
    account,
    setTransactionStatus,
    collateral,
    maxCollateral,
  ]);

  return startTransactions;
};
