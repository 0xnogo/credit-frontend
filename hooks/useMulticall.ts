import { useMemo } from 'react';
import Multicall from 'lib/multicall';
import { MULTICALL_ADDRESS } from 'constants/contracts/addresses';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';

export const useMultiCall = (blocknumber?: number) => {
  const { web3, chainId } = useActiveWeb3React();

  return useMemo(() => {
    try {
      return new Multicall({
        multicallAddress: MULTICALL_ADDRESS[chainId],
        provider: web3,
        defaultBlock: blocknumber ?? 'latest',
      });
    } catch (error) {
      return undefined;
    }
  }, [web3, chainId]);
};
