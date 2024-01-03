import { Token } from 'types/assets';
import { getAddress } from 'ethers/lib/utils';
import useSWR from 'swr';
import { assetSWRConfig } from '@constants/swr';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { getETHPrice } from '@graph/core/fetchers/pricing';
import BigNumber from 'bignumber.js';

export function useETHPrice() {
  const { chainId } = useActiveWeb3React();

  return useSWR<BigNumber>(
    chainId ? ['ethPrice', chainId] : null,
    async (key:string) => {
      try {
        const ethPrice = await getETHPrice(chainId);
        return ethPrice;
      } catch (error) {
        return new BigNumber(0);
      }
    },
    assetSWRConfig,
  );
}
