import { Token } from 'types/assets';
import { getAddress } from 'ethers/lib/utils';
import useSWR from 'swr';
import { assetSWRConfig } from '@constants/swr';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { getAllTokens } from '@graph/core/fetchers/pricing';
import BigNumber from 'bignumber.js';
import { useETHPrice } from './useETHPrice';
import tokenLogoURIs from 'constants/tokens/logoURIs.json';
import { CreditPair } from 'types/credit';

export type TokenMapping = {
  [address: string]: Token;
};

export function getTokenMappingFromPair(pair:CreditPair){
  const asset = pair.asset;
  const collateral = pair.collateral;

  return {
    [getAddress(asset.address)]:{
      decimals:asset.decimals
    },
    [getAddress(collateral.address)]:{
      decimals:collateral.decimals
    },
  }
}

export function useTokenMapping() {
  const { chainId } = useActiveWeb3React();

  const { data: ethPrice = new BigNumber(0) } = useETHPrice();

  return useSWR<TokenMapping>(
    chainId && ethPrice.gt(0) ? ['tokenMapping', chainId, ethPrice] : null,
    async () => {
      try {
        let allTokens = (await getAllTokens(chainId)).map((token: Token) => ({
          ...token,
          price: ethPrice.times(token.derivedETH),
        }));
        let tokens: TokenMapping = {};
        let tokenLogoURIsTyped: Record<string, string> = tokenLogoURIs;
        allTokens.forEach((token: Token) => {
          tokens[getAddress(token.address)] = {
            ...token,
            logoURI: tokenLogoURIsTyped[token.address.toLowerCase()],
          };
        });
        return tokens;
      } catch (error) {
        return {};
      }
    },
    assetSWRConfig,
  );
}
