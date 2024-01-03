import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useCallContractWait } from 'hooks/useCallContractWait';

import { getSpinPurchaserContract } from '@constants/gtm';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { getGasPrice } from 'functions/transactions/getGasPrice';

export const useBuySpinsCallback = (
  amountPerSpin: BigNumber,
  depositCallback: any,
  spinAmount: BigNumber,
  ethAmount: BigNumber,
) => {
  const { account, chainId, web3 } = useActiveWeb3React();
  const { addTransaction, setTransactionStatus } = useCurrentTransactions();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (depositTXID: string) => {
      try {
        const gasPrice = await getGasPrice(web3);

        let func = 'purchaseSpins';
        let params = [
          spinAmount.toFixed(),
          ethAmount.times(Math.pow(10, 18)).toFixed(),
        ];
        let sendValue = '0';

        const spinPurchaser = getSpinPurchaserContract(web3);

        callContractWait(
          spinPurchaser,
          func,
          params,
          gasPrice,
          depositTXID,
          (err: any) => {
            depositCallback(err);
          },
          sendValue,
        );
      } catch (ex) {
        console.log(ex);
        depositCallback(ex);
      }
    };
  }, [
    account,
    chainId,
    spinAmount,
    depositCallback,
    addTransaction,
    setTransactionStatus,
    callContractWait,
    amountPerSpin,
    web3,
    ethAmount,
  ]);
};
