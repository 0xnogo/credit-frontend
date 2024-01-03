import {} from 'ethers/lib/utils';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import useSWR from 'swr';
import { assetSWRConfig } from '@constants/swr';
import { TokenMapping, useTokenMapping } from './useTokenMapping';

export type PriceMapping = {
  [address: string]: { price: BigNumber; decimals: number; symbol: string };
};

const getDefiLLamaQuery = (tokens: string[]) => {
  let query = '';
  for (let index = 0; index < tokens.length; index++) {
    if (index !== 0) {
      query += ',';
    }
    query += `arbitrum:${tokens[index]}`;
  }
  return query;
};

export async function getDefiLLamaPricing(
  tokens: TokenMapping,
): Promise<PriceMapping> {
  const query = getDefiLLamaQuery(Object.keys(tokens));

  const response = await axios.get(
    `https://coins.llama.fi/prices/current/${query}`,
  );
  const result: any = await response.data;
  const coins = result?.coins ?? {};
  let finalData: PriceMapping = {};
  const keys = Object.keys(tokens);
  for (let index = 0; index < keys.length; index++) {
    const tokenKey = tokens[keys[index]].address;
    const coinData = coins[`arbitrum:${tokenKey}`];
    if (coinData && coinData.confidence > 0.75) {
      finalData[tokenKey] = {
        ...tokens[keys[index]],
        price: new BigNumber(coinData.price.toString()),
      };
    }
  }

  return finalData;
}

export function useTokenInfoWithPrice() {
  const tokenMapping = useTokenMapping();

  return useSWR<PriceMapping>(
    ['tokenPrices', tokenMapping.data],
    async () => {
      try {
        return await getDefiLLamaPricing(tokenMapping.data ?? {});
      } catch (error) {
        console.error('error@fetchToken', error);
        return {};
      }
    },
    assetSWRConfig,
  );
}
