import { getAddress } from 'ethers/lib/utils';
import { DEFI_LLAMA_API } from 'constants/';
import { Token } from 'types/assets';

const getDefiLLamaQuery = (priceKeys: string[]) => {
  let query = '';
  for (let index = 0; index < priceKeys.length; index++) {
    if (index !== 0) {
      query += ',';
    }
    query += `arbitrum:${getAddress(priceKeys[index])}`;
  }
  return query;
};

export const getUSDCPriceForTokens = async (tokens: Token[]) => {
  try {
    const tokenMapping: {
      [tokenAddress: string]: string;
    } = {};

    tokens.forEach((token) => {
      tokenMapping[token.address] = '0';
    });

    let priceKeys = Object.keys(tokenMapping);

    const query = getDefiLLamaQuery(priceKeys);

    try {
      const response = await fetch(`${DEFI_LLAMA_API}/prices/current/${query}`);
      const result = await response.json();
      const coins = result?.coins ?? {};
      for (let index = 0; index < priceKeys.length; index++) {
        const coinData = coins[`arbitrum:${getAddress(priceKeys[index])}`];
        //only pick price if confidence is above 75%
        if (coinData && coinData.confidence > 0.75) {
          tokenMapping[priceKeys[index]] = coinData.price.toString();
        }
      }
    } catch (error) {
      console.error(error);
    }

    return tokenMapping;
  } catch (error) {
    console.error('error@getUSDCPriceForTokens', error);
    return {};
  }
};
