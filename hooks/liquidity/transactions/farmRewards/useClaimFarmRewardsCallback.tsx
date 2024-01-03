import { useMemo } from 'react';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { getGasPrice } from 'functions/transactions/getGasPrice';
import { getLPFarmingContract } from 'constants/contracts';

export const useClaimFarmRewardsCallback = (
  poolHash: string,
  cpId: string,
  depositCallback: (err?: any) => void,
) => {
  const { account, chainId, web3 } = useActiveWeb3React();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (depositTXID: string) => {
      try {
        const gasPrice = await getGasPrice(web3);

        const func = 'harvest';
        const params = [poolHash, cpId];

        const lpFarmingContract = getLPFarmingContract(web3, chainId);
        callContractWait(
          lpFarmingContract,
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
  }, [
    depositCallback,
    callContractWait,
    account,
    chainId,
    web3,
    poolHash,
    cpId,
  ]);
};
