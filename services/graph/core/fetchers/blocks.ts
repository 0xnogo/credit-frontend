import { ChainIds } from '@constants/chains';
import { blocksQuery } from '../queries/blocks';
import { XCAL_EXCHANGE_URI } from '@graph/config';
import request from 'graphql-request';

const fetcher = async (
  chainId: number,
  query: any,
  variables: Record<string, any>,
): Promise<any> => request(XCAL_EXCHANGE_URI[chainId], query, variables);

export const getBlocks = async (
  chainId = ChainIds.ARBITRUM,
  variables = {},
) => {
  const { blocks } = await fetcher(chainId, blocksQuery, variables ?? {});
  return blocks;
};
