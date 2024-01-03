import { useMemo } from 'react';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { getGasPrice } from 'functions/transactions/getGasPrice';
import { getCreditStakingContract } from 'constants/contracts';
import BigNumber from 'bignumber.js';

export const useStakeCreditCallback = (
  amount: BigNumber,
  depositCallback: (err?: any) => void,
) => {
  const { account, chainId, web3 } = useActiveWeb3React();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (depositTXID: string) => {
      try {
        const gasPrice = await getGasPrice(web3);

        const func = 'stake';
        const params = [amount];

        const stakeContract = getCreditStakingContract(web3, chainId);
        callContractWait(
          stakeContract,
          func,
          params,
          gasPrice,
          depositTXID,
          async (err: any) => {
            if (err) {
              depositCallback(err);
              return;
            }
            depositCallback();
          },
          undefined,
        );
      } catch (ex) {
        depositCallback(ex);
      }
    };
  }, [depositCallback, callContractWait, account, chainId, web3, amount]);
};
