import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import RewardTokens from 'components/credit/Stake/ActionCard/Common/RewardTokens';
import InfoCard from '@components/componentLibrary/Card/InfoCard';
import VerticalInfo from '@components/componentLibrary/Info/VerticalInfo';
import { useClaimGenesisStakingRewardsCallback } from './useClaimGenesisStakingRewardsCallback';
import BigNumber from 'bignumber.js';

export const useClaimgGenesisStakingRewardsDispatch = (
  depositCallback: (err?: any) => void,
  proof: string[],
  amount: BigNumber,
) => {
  const { web3, chainId, account } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState } =
    useCurrentTransactions();

  const withdrawFn = useClaimGenesisStakingRewardsCallback(
    depositCallback,
    proof,
    amount,
  );

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
          <VerticalInfo
            header="Claimable Rewards Breakdown"
            value={<RewardTokens type="genesis" />}
          />
        </InfoCard>
      </>
    );
  }, []);

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
