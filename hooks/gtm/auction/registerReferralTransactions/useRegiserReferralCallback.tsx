import { useMemo } from 'react';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import {
  getAuctionContract,
  getAuctionReferralContract,
} from 'constants/contracts';
import { Contract } from 'types/web3';
import { getGasPrice } from 'functions/transactions/getGasPrice';

export default function useRegisterReferralCallback(
  code: string,
  registerCallback: (err?: any) => void,
) {
  const { web3, account, chainId } = useActiveWeb3React();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (txId: string) => {
      try {
        let func = 'registerCode';
        let params: any[] = [code];

        const sendValue = '0';

        const auctionContract = getAuctionReferralContract(web3, chainId);

        const gasPrice = await getGasPrice(web3);
        callContractWait(
          auctionContract as Contract,
          func,
          params,
          gasPrice,
          txId,
          async (err: any) => {
            if (err) {
              return registerCallback(err);
            }
            registerCallback();
          },
          sendValue,
        );
      } catch (ex) {
        console.log(ex);
        registerCallback(ex);
      }
    };
  }, [code, callContractWait, web3, account, chainId, registerCallback]);
}
