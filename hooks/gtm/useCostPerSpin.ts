import {
  NFT_CONTRACT_ADDRESS,
  getNFTContract,
  getSpinPurchaserContract,
} from '@constants/gtm';
import { assetSWRConfig, fastSWRConfig } from '@constants/swr';
import BigNumber from 'bignumber.js';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import useSWR from 'swr';

export const useCostPerSpin = () => {
  const { account, wrongChain, web3 } = useActiveWeb3React();

  const {
    data,
    isValidating: isValidatingCost,
    mutate: mutateCost,
  } = useSWR<BigNumber | undefined>(
    account && !wrongChain && web3 ? ['costPerSpin', account] : null,
    async () => {
      const spinPay = getSpinPurchaserContract(web3);
      try {
        const nftContract = getNFTContract(web3, NFT_CONTRACT_ADDRESS);
        await nftContract.methods
          .tokenOfOwnerByIndex(account as string, 0)
          .call();

        return new BigNumber(
          await spinPay.methods.passHolderCostPerSpin().call(),
        );
      } catch (error) {
        return new BigNumber(
          await spinPay.methods.standardCostPerSpin().call(),
        );
      }
    },
    assetSWRConfig,
  );

  return {
    costPerSpin: data,
    isValidatingCost,
    mutateCost,
  };
};
