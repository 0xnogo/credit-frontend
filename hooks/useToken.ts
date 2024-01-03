import { assetSWRConfig, midSWRConfig } from 'constants/swr';
import useSWR from 'swr';
import BigNumber from 'bignumber.js';
import { useMultiCall } from './useMulticall';
import { getTokenContract } from 'constants/contracts';
import Multicall from '@/lib/multicall';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import {
  NATIVE_ADDRESS,
  WRAPPED_NATIVE_ADDRESS,
} from 'constants/contracts/addresses';
import { NATIVE_NAME } from 'constants/';
import { NATIVE_SYMBOL } from 'constants/';
import { Token } from 'types/assets';

export function useToken(tokenAddress: string) {
  const { chainId, account, web3 } = useActiveWeb3React();

  const multicall = useMultiCall();

  const isETH =
    tokenAddress?.toLowerCase() ===
    (NATIVE_ADDRESS?.[chainId] ?? '').toLowerCase();

  tokenAddress = isETH ? WRAPPED_NATIVE_ADDRESS?.[chainId] : tokenAddress;

  const { data: token, isValidating } = useSWR<Token | undefined>(
    chainId && account && web3 && multicall && tokenAddress
      ? ['tokenToFetch', chainId, account, tokenAddress, isETH]
      : null,
    async () => {
      try {
        let bal: BigNumber = new BigNumber(0);
        const tokenContract = getTokenContract(web3, tokenAddress);
        const calls = [
          tokenContract.methods.name(),
          tokenContract.methods.decimals(),
          tokenContract.methods.symbol(),
          tokenContract.methods.totalSupply(),
          tokenContract.methods.balanceOf(account as string),
        ];
        const multicallReturn = await (multicall as Multicall).aggregate(calls);
        const [name, decimals, symbol, totalSupply, balance] = multicallReturn;

        if (isETH) {
          bal = new BigNumber(await web3.eth.getBalance(account as string));
        } else {
          bal = balance;
        }
        return {
          name: isETH ? NATIVE_NAME[chainId] : name,
          decimals: Number(decimals),
          symbol: isETH ? NATIVE_SYMBOL[chainId] : symbol,
          totalSupply: Number(totalSupply),
          chainId,
          address: isETH ? NATIVE_ADDRESS[chainId] : symbol,
          balance: new BigNumber(bal)
            .div(Math.pow(10, Number(decimals)))
            .toFixed(),
          derivedETH: new BigNumber(0),
          price: new BigNumber(0),
        };
      } catch (error) {
        console.error('error@fetchToken', error);
        return undefined;
      }
    },
    assetSWRConfig,
  );

  return token;
}
