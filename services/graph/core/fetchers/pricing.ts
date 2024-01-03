import { ChainIds } from '@constants/chains';
import { XCAL_EXCHANGE_URI } from '@graph/config';
import request from 'graphql-request';
import BigNumber from 'bignumber.js';
import { bundleQuery, tokensQuery } from '../queries/tokens';
import { Token } from 'types/assets';

const fetcher = async (
  chainId: number,
  query: any,
  variables: Record<string, any>,
): Promise<any> => request(XCAL_EXCHANGE_URI[chainId], query, variables);

export const getETHPrice = async (
  chainId = ChainIds.ARBITRUM,
): Promise<BigNumber> => {
  const { bundle } = await fetcher(chainId, bundleQuery, { id: '1' });
  return new BigNumber(bundle.ethPrice);
};

export const getAllTokens = async (
  chainId = ChainIds.ARBITRUM,
): Promise<Token[]> => {
  const { tokens } = await fetcher(chainId, tokensQuery, {});
  return tokens.map((token: any) => ({
    ...token,
    derivedETH: new BigNumber(token.derivedETH),
    decimals: Number(token.decimals),
    price: new BigNumber(0),
  }));
};
