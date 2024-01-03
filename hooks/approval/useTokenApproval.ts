import { useMemo } from 'react';
import { Token } from 'types/assets';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { getTokenContract } from 'constants/contracts';
import { MAX_UINT256 } from 'constants/';
import { getGasPrice } from 'functions/transactions/getGasPrice';

const useTokenApprovalCallback = (
  asset: Token,
  spender: string,
  errorCallback: (err?: any) => void,
  completeCallback?: (allowanceId?: any) => void,
) => {
  const { web3, account, chainId } = useActiveWeb3React();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (allowanceTXID: string, allowance1TXID?: string) => {
      try {
        const gasPrice = await getGasPrice(web3);
        const tokenContract = getTokenContract(web3, asset.address);
        await new Promise((resolve, reject) => {
          callContractWait(
            tokenContract,
            'approve',
            [spender, MAX_UINT256],
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
        completeCallback &&
          allowance1TXID &&
          (await completeCallback(allowance1TXID));
      } catch (ex) {
        errorCallback(ex);
      }
    };
  }, [
    asset,
    errorCallback,
    callContractWait,
    web3,
    account,
    chainId,
    completeCallback,
    spender,
  ]);
};

export default useTokenApprovalCallback;
