import { midSWRConfig } from 'constants/swr';
import useSWR from 'swr';
import BigNumber from 'bignumber.js';
import { useMultiCall } from './useMulticall';
import { getTokenContract } from 'constants/contracts';
import Multicall from '@/lib/multicall';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { NATIVE_ADDRESS } from 'constants/contracts/addresses';

export function useTokenBalance(tokenAddress: string) {
  const { chainId, account, web3 } = useActiveWeb3React();

  const multicall = useMultiCall();

  const isETH =
    tokenAddress?.toLowerCase() === NATIVE_ADDRESS?.[chainId]?.toLowerCase();

  const balanceSWR = useSWR<BigNumber>(
    chainId && account && web3 && multicall && tokenAddress
      ? ['tokenBalanceToFetch', chainId, account, tokenAddress, isETH]
      : null,
    async () => {
      try {
        if (isETH) {
          const balance = await web3.eth.getBalance(account as string);
          return new BigNumber(balance).div(Math.pow(10, 18));
        } else {
          const tokenContract = getTokenContract(web3, tokenAddress);

          const calls = [
            tokenContract.methods.decimals(),
            tokenContract.methods.balanceOf(account as string),
          ];
          const multicallReturn = await (multicall as Multicall).aggregate(
            calls,
          );
          const [decimals, balance] = multicallReturn;

          return new BigNumber(balance).div(Math.pow(10, Number(decimals)));
        }
      } catch (error) {
        console.error('error@fetchToken', error);
        return new BigNumber('0');
      }
    },
    midSWRConfig,
  );

  return balanceSWR;
}
