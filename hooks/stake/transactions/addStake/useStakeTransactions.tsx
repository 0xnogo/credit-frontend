import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { Box } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import { formatCurrency } from '@utils/index';
import { getStakeApproval } from '@functions/approval/getStakeApproval';
import { useCreditToken } from 'hooks/useCreditToken';
import BigNumber from 'bignumber.js';
import useStakeApprovalCallback from 'hooks/approval/useStakeApproval';
import { useStakeCreditCallback } from './useStakeCreditCallback';
import InfoCard from '@components/componentLibrary/Card/InfoCard';
import { useStakingRewards } from '@functions/stake/stakingRewards';
import { useEpochData } from '@functions/stake/currentEpochData';

export const useStakeTransactionsDispatch = (
  assetIn: BigNumber,
  depositCallback: (err?: any) => void,
  handleCloseModal: any,
) => {
  const {
    data: currentEpochData = {
      totalAllocation: new BigNumber(0),
    },
  } = useEpochData('global');

  const rewards = useStakingRewards();

  const creditToken = useCreditToken();

  const { web3, chainId, account } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState } =
    useCurrentTransactions();

  const cpApprovalFn = useStakeApprovalCallback(() => {});

  const withdrawFn = useStakeCreditCallback(assetIn, depositCallback);

  const defaultObj = (
    allowanceTXID: string,
    stakeTXID: string,
    component: JSX.Element,
  ): AddTransaction => {
    const tx: AddTransaction = {
      title: `Stake`,
      type: 'Stake',
      verb: 'Credit Stake',
      transactions: [
        {
          uuid: allowanceTXID,
          description: `Checking your CREDIT allowance`,
          status: 'WAITING',
          actionName: `Approve CREDIT`,
          action: () => cpApprovalFn(allowanceTXID),
        },
        {
          uuid: stakeTXID,
          description: `Stake Tokens`,
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
              header="Total allocation amount"
              value={formatCurrency(assetIn.div(Math.pow(10, 18)))}
            />
            <HorizontalInfo
              header="Your share"
              value={`${formatCurrency(
                assetIn
                  .div(currentEpochData.totalAllocation.plus(assetIn))
                  .times(100),
              )}%`}
            />
            <HorizontalInfo
              header="Staking APR"
              value={formatCurrency(rewards.xCreditAPR)}
            />
          </Box>
          <Box></Box>
        </InfoCard>
      </>
    );
  }, [rewards, assetIn]);

  const startTransactions = useCallback(async () => {
    const allowance0TXID = uuid();
    const withdrawTXID = uuid();
    resetState();
    handleCloseModal();
    addTransaction(defaultObj(allowance0TXID, withdrawTXID, withdrawComponent));
    setTimeout(() => {
      getStakeApproval(
        creditToken,
        chainId,
        web3,
        account as string,
        assetIn.div(Math.pow(10, 18)),
        setTransactionStatus,
        allowance0TXID,
      );
    });
  }, [
    addTransaction,
    resetState,
    defaultObj,
    chainId,
    web3,
    setTransactionStatus,
    withdrawComponent,
    assetIn,
    account,
    creditToken,
    handleCloseModal,
  ]);

  return startTransactions;
};
