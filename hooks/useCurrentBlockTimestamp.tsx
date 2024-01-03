import { ChainIds } from '@constants/chains';
import { fastSWRConfig } from '@constants/swr';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import useSWR from 'swr';

export function useCurrentBlockTimestamp() {
  const { web3, chainId } = useActiveWeb3React();

  return useSWR(
    chainId && web3 && chainId === ChainIds.LOCALHOST ? ['blockTimestamp', chainId] : null,
    async () => {
      if (chainId !== ChainIds.LOCALHOST) {
        return Date.now() / 1000;
      }
      try {
        const timestamp = Number(
          (await web3.eth.getBlock('pending')).timestamp,
        );
        return timestamp;
      } catch (error) {
        console.log('error');
        return Date.now() / 1000;
      }
    },
    fastSWRConfig,
  );
}
