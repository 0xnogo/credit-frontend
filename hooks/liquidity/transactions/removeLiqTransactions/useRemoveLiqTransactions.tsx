import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { Box, Typography, useTheme } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import { formatCurrency } from '@utils/index';
import SubCard from 'components/componentLibrary/Card/SubCard';
import { useLiquidityRemoveCallbackCredit } from './useLiquidityRemoveCallbackCredit';
import useCreditPositionAllowanceCallback from 'hooks/approval/useCreditPositionApproval';
import { getCreditPositionApproval } from 'functions/approval/getCreditPositionApproval';
import { CreditPair, CreditPool } from 'types/credit';
import { useUnstakeLPCallback } from '../unstakeLPTransactions/useUnstakeLPCallback';
import BigNumber from 'bignumber.js';
import VerticalInfo from '@components/componentLibrary/Info/VerticalInfo';
import MultiCoinBalance from '@components/componentLibrary/MultiCoinBalances';
import { Token } from 'types/assets';

export const useLiquidityRemoveTransactionDispatch = (
  pair: CreditPair,
  pool: CreditPool,
  liquidityOut: string,
  positionId: string,
  depositCallback: (err?: any) => void,
  assetAmount: BigNumber,
  collateralAmount: BigNumber,
  poolHash?: string,
) => {
  const theme = useTheme();
  const { web3, chainId } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState } =
    useCurrentTransactions();

  const cpApprovalFn = useCreditPositionAllowanceCallback(
    positionId,
    (err) => {},
  );

  const withdrawFn = useLiquidityRemoveCallbackCredit(
    pair,
    pool,
    positionId,
    depositCallback,
  );

  const withdrawFarmFn = useUnstakeLPCallback(
    poolHash as string,
    positionId,
    depositCallback,
    (allowanceTXID: string) => {
      getCreditPositionApproval(
        chainId,
        web3,
        setTransactionStatus,
        positionId,
        allowanceTXID,
        undefined,
      );
    },
  );

  const defaultObj = (
    allowanceTXID: string,
    withdrawFarmTXID: string,
    withdrawTXID: string,
    component: JSX.Element,
  ): AddTransaction => {
    const tx: AddTransaction = {
      title: `Remove Liquidity`,
      type: 'liquidity',
      verb: 'Liquidity Removed',
      txType: 'liquidity',
      transactions: [
        {
          uuid: allowanceTXID,
          description: `Checking your CLP allowance`,
          status: 'WAITING',
          actionName: `Approve Position`,
          action: () => cpApprovalFn(allowanceTXID),
        },
        {
          uuid: withdrawTXID,
          description: `Withdraw tokens from the pool`,
          status: 'WAITING',
          actionName: `Confirm`,
          action: () => withdrawFn(withdrawTXID),
        },
      ],
      transactionComponent: component,
    };
    if (poolHash) {
      tx.transactions.unshift({
        uuid: withdrawFarmTXID,
        description: `Withdraw from Farm`,
        status: 'WAITING',
        actionName: 'Unstake LP',
        action: () => withdrawFarmFn(withdrawFarmTXID, allowanceTXID),
      });
    }
    return tx;
  };

  const withdrawComponent = useMemo(() => {
    return (
      <>
        <Box gap="5px">
          <Typography
            variant="body-small-regular"
            color={theme.palette.neutrals[15]}
          >
            Withdraw Summary
          </Typography>
          <SubCard>
            <HorizontalInfo
              header={`Withdraw Amount`}
              value={`${formatCurrency(
                new BigNumber(liquidityOut).div(Math.pow(10, 18)),
              )} CLP`}
            />
            <Box border="1px solid #3D3D3D" />
            <VerticalInfo
              header="Amount to Redeem"
              value={
                <MultiCoinBalance
                  tokens={[pair.asset as Token, pair.collateral as Token]}
                  values={[assetAmount, collateralAmount]}
                  showUSD={true}
                  andOr={'AND'}
                />
              }
            />
          </SubCard>
        </Box>
      </>
    );
  }, [liquidityOut, pair, assetAmount, collateralAmount]);

  const startTransactions = useCallback(async () => {
    const allowance0TXID = uuid();
    const withdrawFarmTXID = uuid();
    const withdrawTXID = uuid();
    resetState();
    addTransaction(
      defaultObj(
        allowance0TXID,
        withdrawFarmTXID,
        withdrawTXID,
        withdrawComponent,
      ),
    );
    if (!poolHash) {
      setTimeout(() => {
        getCreditPositionApproval(
          chainId,
          web3,
          setTransactionStatus,
          positionId,
          allowance0TXID,
          undefined,
        );
      });
    }
  }, [
    addTransaction,
    resetState,
    defaultObj,
    chainId,
    web3,
    setTransactionStatus,
    withdrawComponent,
    positionId,
    poolHash,
  ]);

  return startTransactions;
};
