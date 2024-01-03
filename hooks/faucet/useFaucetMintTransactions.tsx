import { useCallback, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { useCurrentTransactions } from "hooks/useCurrentTransactions";
import { AddTransaction } from "types/transactions";
import useFaucetMintCallback from "./useFaucetMintCallback";
import { useFaucetDetails } from "@functions/useFaucetDetails";
import { Box, Typography, useTheme } from "@mui/material";
import SubCard from "@components/componentLibrary/Card/SubCard";
import HorizontalInfo from "@components/componentLibrary/Info/HorizontalInfo";
import BigNumber from "bignumber.js";

export const useFaucetMintTransactions = (
  token: string,
  symbol: string,
  amount: BigNumber
) => {
  const theme = useTheme();

  const {
    addTransaction,
    resetState,
    setTransactionStatus,
  } = useCurrentTransactions();

  const { mutate } = useFaucetDetails();
  const mintFn = useFaucetMintCallback(token, mutate);

  const defaultObj = (mintTXID: string, component: any): AddTransaction => ({
    title: `Mint`,
    type: "Minting",
    txType: "borrow",
    verb: `Minted ${symbol} successfully`,
    transactions: [
      {
        uuid: mintTXID,
        actionName: `Confirm`,
        description: `Mint token`,
        status: "WAITING",
        action: () => mintFn(mintTXID),
      },
    ],
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
            <HorizontalInfo header="Token to Mint" value={symbol} />
            <HorizontalInfo
              header="Amount to Mint"
              value={amount ? amount.toFixed() : "0"}
            />
          </SubCard>
        </Box>
      </>
    );
  }, [symbol, amount]);

  const startTransactions = useCallback(async () => {
    try {
      const txID = uuid();
      resetState();
      addTransaction(defaultObj(txID, component));
    } catch (Err) {
      console.log(Err);
    }
  }, [
    addTransaction,
    resetState,
    defaultObj,
    component,
    setTransactionStatus,
    mintFn,
  ]);

  return startTransactions;
};
