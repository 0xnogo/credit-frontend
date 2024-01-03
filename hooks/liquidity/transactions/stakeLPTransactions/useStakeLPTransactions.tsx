import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import InfoCard from 'components/componentLibrary/Card/InfoCard';
import { Box, Typography } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import formatTimestamp, { formatCurrency } from '@utils/index';
import SubCard from 'components/componentLibrary/Card/SubCard';
import { getConvenienceApproval } from 'functions/approval/getConvenienceApproval';
import useCreditPositionAllowanceCallback from 'hooks/approval/useCreditPositionApproval';
import { useFarmLPCallback } from '../addLiqTransactions/useFarmLPCallback';
import { getCreditPositionApproval } from '@functions/approval/getCreditPositionApproval';
import { LP_FARMING_ADDRESS } from '@constants/contracts/addresses';

export const useStakeLPTransactionDispatch = (
  apr: BigNumber,
  liquidity: string,
  cpId: string,
  maturity: string,
  depositCallback: (err?: any) => void,
  poolHash?: string,
) => {
  const { account, web3, chainId } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState } =
    useCurrentTransactions();

  const creditPositionApproval = useCreditPositionAllowanceCallback(
    cpId,
    async (err: any) => {
      if (err) {
        depositCallback(err);
      }
    },
    undefined,
    LP_FARMING_ADDRESS[chainId],
  );

  const farmFn = useFarmLPCallback(poolHash as string, depositCallback, cpId);

  const defaultObj = (
    allowance0TXID: string,
    depositTXID: string,
    depositComponent: JSX.Element,
  ): AddTransaction => {
    const tx: AddTransaction = {
      title: `Confirm Deposit`,
      type: 'liquidity',
      verb: `Farmed successfully`,
      txType: 'liquidity',
      transactions: [
        {
          uuid: allowance0TXID,
          description: `Checking your cp allowance`,
          status: 'WAITING',
          actionName: `Approve CP`,
          action: () => creditPositionApproval(allowance0TXID),
        },
        {
          uuid: depositTXID,
          description: `Farm CP`,
          status: 'WAITING',
          actionName: 'Confirm Deposit',
          action: () => farmFn(depositTXID),
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
            Deposit Summary
          </Typography>
          <SubCard>
            <HorizontalInfo
              header="LP Farmed"
              value={`${formatCurrency(
                new BigNumber(liquidity).times(Math.pow(10, 18).toFixed()),
              )}`}
            />
          </SubCard>
        </Box>
        <Box gap="5px">
          <Typography variant="body-small-regular" color="#8D8D8D">
            Position Summary
          </Typography>
          <InfoCard display="flex" flexDirection="column">
            <HorizontalInfo
              header="Farm APR"
              value={`${formatCurrency(apr.toFixed())}%`}
            />
            <HorizontalInfo
              header="Expiry date"
              value={`${formatTimestamp(maturity)}`}
            />
          </InfoCard>
        </Box>
      </>
    );
  }, [liquidity, apr]);

  const startTransactions = useCallback(async () => {
    const allowance0TXID = uuid();
    const farmTXID = uuid();
    resetState();
    addTransaction(defaultObj(allowance0TXID, farmTXID, lendComponent));
    setTimeout(async () => {
      await getCreditPositionApproval(
        chainId,
        web3,
        setTransactionStatus,
        cpId,
        allowance0TXID,
        undefined,
        LP_FARMING_ADDRESS[chainId],
      );
    });
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
