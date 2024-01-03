import { useMemo } from 'react';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { getTokenContract } from 'constants/contracts';
import { CREDIT_STAKING_ADDRESS } from 'constants/contracts/addresses';
import { getGasPrice } from 'functions/transactions/getGasPrice';
import { MAX_UINT256 } from '@constants/index';
import { useCreditToken } from 'hooks/useCreditToken';

const useStakeApprovalCallback = (errorCallback: (err?: any) => void) => {
  const creditToken = useCreditToken();

  const { web3, account, chainId } = useActiveWeb3React();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (allowanceTXID: string) => {
      try {
        const gasPrice = await getGasPrice(web3);
        const tokenContract = getTokenContract(web3, creditToken.address);
        await new Promise((resolve, reject) => {
          callContractWait(
            tokenContract,
            'approve',
            [CREDIT_STAKING_ADDRESS[chainId], MAX_UINT256],
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
      } catch (ex) {
        errorCallback(ex);
      }
    };
  }, [errorCallback, callContractWait, web3, account, chainId, creditToken]);
};

export default useStakeApprovalCallback;
