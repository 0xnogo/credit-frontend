import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { getAuctionContract } from 'constants/contracts';
import { Contract } from 'types/web3';
import { getGasPrice } from 'functions/transactions/getGasPrice';
import { MinimalAuctionOrder } from 'types/auction';
import { encodeOrder } from '@functions/gtm/auction/utils';

export default function useClaimBidsCallback(
  registerCallback: (err?: any) => void,
) {
  const { web3, account, chainId } = useActiveWeb3React();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (txId: string, order: MinimalAuctionOrder) => {
      try {
        let func = 'claimFromParticipantOrder';
        let params: any[] = [
          [encodeOrder({ ...order, userId: order.auctionUser.id })],
        ];

        const sendValue = '0';

        const auctionContract = getAuctionContract(web3, chainId);

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
  }, [callContractWait, web3, account, chainId, registerCallback]);
}
