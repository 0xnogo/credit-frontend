import { getSpinPurchaserContract } from '@constants/gtm';
import { fastSWRConfig } from '@constants/swr';
import BigNumber from 'bignumber.js';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import useSWR from 'swr';

export const usePricingFromOracle = () => {
  const { account, wrongChain, web3 } = useActiveWeb3React();

  const {
    data,
    isValidating: isValidatingPrice,
    mutate: mutateTokenPrice,
  } = useSWR<BigNumber | undefined>(
    account && !wrongChain && web3 ? ['pricingFromOracle', account] : null,
    async () => {
      const spinPay = getSpinPurchaserContract(web3);
      try {
        const price = await spinPay.methods.getLatestPrice().call();
        return new BigNumber(price);
      } catch (error) {
        return undefined;
      }
    },
    fastSWRConfig,
  );

  return {
    pricing: data,
    isValidatingPrice,
    mutateTokenPrice,
  };
};
