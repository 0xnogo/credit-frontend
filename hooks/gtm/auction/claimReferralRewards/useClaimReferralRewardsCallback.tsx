import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import {
  getAuctionContract,
  getAuctionReferralContract,
} from 'constants/contracts';
import { Contract } from 'types/web3';
import { getGasPrice } from 'functions/transactions/getGasPrice';

export default function useClaimReferralRewardsCallback(
  amount: BigNumber,
  registerCallback: (err?: any) => void,
) {
  const { web3, account, chainId } = useActiveWeb3React();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (txId: string) => {
      try {
        let func = 'withdraw';
        let params: any[] = [amount];

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
  }, [amount, callContractWait, web3, account, chainId, registerCallback]);
}
