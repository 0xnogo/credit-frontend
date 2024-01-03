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
import { useClaimFarmRewardsCallback } from './useClaimFarmRewardsCallback';
import CoinBalance from '@components/componentLibrary/CoinBalance';
import { useTokenMapping } from 'hooks/useTokenMapping';
import { CREDIT_TOKEN_ADDRESS } from '@constants/contracts/addresses';

export const useClaimFarmRewardsTransactions = (
  liquidity: string,
  cpId: string,
  claimAmount: BigNumber,
  poolHash: string,
  depositCallback: (err?: any) => void,
) => {
  const { data: tokenMapping = {} } = useTokenMapping();

  const { account, web3, chainId } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState } =
    useCurrentTransactions();

  const farmFn = useClaimFarmRewardsCallback(
    poolHash as string,
    cpId,
    depositCallback,
  );

  const defaultObj = (
    claimTXID: string,
    depositComponent: JSX.Element,
  ): AddTransaction => {
    const tx: AddTransaction = {
      title: `Claim Rewards`,
      type: 'liquidity',
      verb: `Farmed successfully`,
      txType: 'liquidity',
      transactions: [
        {
          uuid: claimTXID,
          description: `Claim Rewards`,
          status: 'WAITING',
          actionName: 'Claim',
          action: () => farmFn(claimTXID),
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
          <Typography variant="body-small-regular" color="#8D8D8D">
            Claim Summary
          </Typography>
          <SubCard>
            <HorizontalInfo
              header="Amount"
              value={
                <CoinBalance
                  token={tokenMapping[CREDIT_TOKEN_ADDRESS[chainId]]}
                  value={claimAmount}
                  showUSD={true}
                />
              }
            />
          </SubCard>
        </Box>
      </>
    );
  }, [liquidity]);

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
    liquidity,
    claimAmount,
    poolHash,
  ]);

  return startTransactions;
};
