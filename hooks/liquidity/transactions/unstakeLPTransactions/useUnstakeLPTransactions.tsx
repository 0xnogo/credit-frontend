import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { Box, Typography } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import SubCard from 'components/componentLibrary/Card/SubCard';
import { getConvenienceApproval } from 'functions/approval/getConvenienceApproval';
import { useUnstakeLPCallback } from './useUnstakeLPCallback';
import { formatCurrency } from '@utils/index';
import VerticalInfo from '@components/componentLibrary/Info/VerticalInfo';
import MultiCoinBalance from '@components/componentLibrary/MultiCoinBalances';
import { CreditPair } from 'types/credit';
import { Token } from 'types/assets';

export const useUnstakeLPTransactionDispatch = (
  liquidity: string,
  cpId: string,
  maturity: string,
  depositCallback: (err?: any) => void,
  assetAmount: BigNumber,
  collateralAmount: BigNumber,
  pair: CreditPair,
  poolHash?: string,
) => {
  const { account, web3, chainId } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState } =
    useCurrentTransactions();

  const farmFn = useUnstakeLPCallback(
    poolHash as string,
    cpId,
    depositCallback,
  );

  const defaultObj = (
    withdrawTXID: string,
    depositComponent: JSX.Element,
  ): AddTransaction => {
    const tx: AddTransaction = {
      title: `Unstake`,
      type: 'liquidity',
      verb: `Farmed successfully`,
      txType: 'liquidity',
      transactions: [
        {
          uuid: withdrawTXID,
          description: `Withdraw CP`,
          status: 'WAITING',
          actionName: 'Unstake',
          action: () => farmFn(withdrawTXID),
        },
      ],
      transactionComponent: depositComponent,
    };
    return tx;
  };

  const lendComponent = useMemo(() => {
    return (
      <>
        <Box gap="5px">
          <Typography variant="body-moderate-regular" color="#8D8D8D">
            Withdrawal Summary
          </Typography>
          <SubCard>
            <HorizontalInfo
              header="LP Withdrawn"
              value={`${formatCurrency(new BigNumber(liquidity).toFixed())}`}
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
  }, [liquidity, pair, assetAmount, collateralAmount]);

  const startTransactions = useCallback(async () => {
    const farmTXID = uuid();
    resetState();
    addTransaction(defaultObj(farmTXID, lendComponent));
  }, [
    addTransaction,
    resetState,
    defaultObj,
    lendComponent,
    chainId,
    web3,
    account,
    setTransactionStatus,
    getConvenienceApproval,
    cpId,
  ]);

  return startTransactions;
};
