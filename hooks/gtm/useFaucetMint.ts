import { useMemo } from 'react';
import { useCallContractWait } from 'hooks/useCallContractWait';

import { getFaucetContract } from '@constants/gtm';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { getGasPrice } from 'functions/transactions/getGasPrice';

export const useFaucetMint = (depositCallback: any) => {
  const { account, chainId, web3 } = useActiveWeb3React();
  const { addTransaction, setTransactionStatus } = useCurrentTransactions();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (depositTXID: string) => {
      try {
        const gasPrice = await getGasPrice(web3);

        const faucet = getFaucetContract(web3);

        let func = 'mint';
        let params = [account];
        let sendValue = '0';

        callContractWait(
          faucet,
          func,
          params,
          gasPrice,
          depositTXID,
          (err: any) => depositCallback(),
          sendValue,
        );
      } catch (ex) {
        depositCallback();
      }
    };
  }, [
    account,
    chainId,
    addTransaction,
    setTransactionStatus,
    callContractWait,
    web3,
    depositCallback,
  ]);
};
