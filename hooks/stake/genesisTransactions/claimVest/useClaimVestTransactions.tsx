import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import InfoCard from '@components/componentLibrary/Card/InfoCard';
import BigNumber from 'bignumber.js';
import { Box } from '@mui/material';
import { formatCurrency } from '@utils/index';
import HorizontalInfo from '@components/componentLibrary/Info/HorizontalInfo';
import { useClaimVestCallback } from './useClaimVestCallback';

export const useClaimVestTransactionDispatch = (
  assetIn: BigNumber,
  depositCallback: (err?: any) => void,
  proof: string[],
) => {
  const { web3, chainId, account } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState } =
    useCurrentTransactions();

  const withdrawFn = useClaimVestCallback(assetIn, proof, depositCallback);

  const defaultObj = (
    stakeTXID: string,
    component: JSX.Element,
  ): AddTransaction => {
    const tx: AddTransaction = {
      title: `Claim Rewards`,
      type: 'Claim',
      verb: 'Claim',
      transactions: [
        {
          uuid: stakeTXID,
          description: `Claim Rewards`,
          status: 'WAITING',
          actionName: `Confirm`,
          action: () => withdrawFn(stakeTXID),
        },
      ],
      txType: 'liquidity',
      transactionComponent: component,
    };
    return tx;
  };

  const withdrawComponent = useMemo(() => {
    return (
      <>
        <InfoCard>
          <Box display="flex" flexDirection="column" width="100%" gap="12px">
            <HorizontalInfo
              header="Amount to receive"
              value={`${formatCurrency(assetIn)} CREDIT`}
            />
          </Box>
          <Box></Box>
        </InfoCard>
      </>
    );
  }, [assetIn]);

  const startTransactions = useCallback(async () => {
    const withdrawTXID = uuid();
    resetState();
    addTransaction(defaultObj(withdrawTXID, withdrawComponent));
  }, [
    addTransaction,
    resetState,
    defaultObj,
    chainId,
    web3,
    setTransactionStatus,
    withdrawComponent,
    account,
  ]);

  return startTransactions;
};
