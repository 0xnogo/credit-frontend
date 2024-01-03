import { useMemo } from 'react';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { getGasPrice } from 'functions/transactions/getGasPrice';
import {
  getCreditPositionContract,
  getLPFarmingContract,
} from 'constants/contracts';

export const useFarmLPCallback = (
  poolHash: string,
  depositCallback: (err?: any) => void,
  cpId?: string,
) => {
  const { account, chainId, web3 } = useActiveWeb3React();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (depositTXID: string) => {
      try {
        const gasPrice = await getGasPrice(web3);

        let latestCpId: string = cpId ?? '-1';
        if (latestCpId === '-1') {
          const creditPositionsContract = getCreditPositionContract(
            web3,
            chainId,
          );
          const totalPositions = Number(
            await creditPositionsContract.methods
              .balanceOf(account as string)
              .call(),
          );
          latestCpId = await creditPositionsContract.methods
            .tokenOfOwnerByIndex(account as string, totalPositions - 1)
            .call();
        }

        const func = 'deposit';
        const params = [poolHash, latestCpId];

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
