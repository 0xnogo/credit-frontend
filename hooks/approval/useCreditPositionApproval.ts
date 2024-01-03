import { useMemo } from 'react';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { getCreditPositionContract } from 'constants/contracts';
import { CONVENIENCE_ADDRESS } from 'constants/contracts/addresses';
import { getGasPrice } from 'functions/transactions/getGasPrice';

const useCreditPositionApprovalCallback = (
  positionId: string,
  errorCallback: (err?: any) => void,
  completeCallback?: (allowanceId?: any) => void,
  overrideAddress?: string,
) => {
  const { web3, account, chainId } = useActiveWeb3React();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (allowanceTXID: string) => {
      let currentPositionId = positionId;
      if (positionId === 'latest') {
        const creditPositionsContract = getCreditPositionContract(
          web3,
          chainId,
        );
        const totalPositions = Number(
          await creditPositionsContract.methods
            .balanceOf(account as string)
            .call(undefined, 'pending'),
        );
        const newCPId = await creditPositionsContract.methods
          .tokenOfOwnerByIndex(account as string, totalPositions - 1)
          .call(undefined, 'pending');

        currentPositionId = newCPId;
      }
      try {
        const gasPrice = await getGasPrice(web3);
        const creditPositionContract = getCreditPositionContract(web3, chainId);
        await new Promise((resolve, reject) => {
          callContractWait(
            creditPositionContract,
            'approve',
            [
              overrideAddress ?? CONVENIENCE_ADDRESS[chainId],
              currentPositionId,
            ],
            gasPrice,
            allowanceTXID,
            (err: any) => {
              if (err) {
                errorCallback(err);
                return reject(err);
              }
              resolve(0);
            },
          );
        });
        completeCallback && (await completeCallback());
      } catch (ex) {
        errorCallback(ex);
      }
    };
  }, [
    positionId,
    errorCallback,
    callContractWait,
    web3,
    account,
    chainId,
    completeCallback,
    overrideAddress,
  ]);
};

export default useCreditPositionApprovalCallback;
