import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import RewardTokens from 'components/credit/Stake/ActionCard/Common/RewardTokens';
import InfoCard from '@components/componentLibrary/Card/InfoCard';
import VerticalInfo from '@components/componentLibrary/Info/VerticalInfo';
import { useRemoveStakeCallback } from './useRemoveStakeCallback';
import BigNumber from 'bignumber.js';
import { Box } from '@mui/material';
import { formatCurrency } from '@utils/index';
import HorizontalInfo from '@components/componentLibrary/Info/HorizontalInfo';

export const useRemoveStakeTransactionDispatch = (
  assetIn: BigNumber,
  assetReceived: BigNumber,
  unstakingPenalty: BigNumber,
  depositCallback: (err?: any) => void,
  handleCloseModal: any,
) => {
  const { web3, chainId, account } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState } =
    useCurrentTransactions();

  const withdrawFn = useRemoveStakeCallback(assetIn, depositCallback);

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
              header="Unstaking Penalty"
              value={formatCurrency((unstakingPenalty ?? 0)?.toString() + 'X')}
            />
            <HorizontalInfo
              header="Amount to receive"
              value={`${formatCurrency(assetReceived)} CREDIT`}
            />
          </Box>
          <Box></Box>
        </InfoCard>
      </>
    );
  }, [unstakingPenalty, assetReceived]);

  const startTransactions = useCallback(async () => {
    const withdrawTXID = uuid();
    resetState();
    addTransaction(defaultObj(withdrawTXID, withdrawComponent));
    handleCloseModal();
  }, [
    addTransaction,
    resetState,
    defaultObj,
    chainId,
    web3,
    setTransactionStatus,
    withdrawComponent,
    account,
    handleCloseModal,
  ]);

  return startTransactions;
};
