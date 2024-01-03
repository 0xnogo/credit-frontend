import { useMemo } from 'react';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { getGasPrice } from 'functions/transactions/getGasPrice';
import {
  getAuctionClaimerContract,
  getCreditStakingContract,
} from 'constants/contracts';
import BigNumber from 'bignumber.js';

export const useClaimVestCallback = (
  assetIn: BigNumber,
  proof: string[],
  depositCallback: (err?: any) => void,
) => {
  const { account, chainId, web3 } = useActiveWeb3React();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (depositTXID: string) => {
      try {
        const gasPrice = await getGasPrice(web3);

        const func = 'claimCredit';
        const params = [assetIn.times(Math.pow(10, 18)), proof];

        const stakeContract = getAuctionClaimerContract(web3, chainId);
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
  }, [depositCallback, callContractWait, account, chainId, web3, assetIn]);
};
