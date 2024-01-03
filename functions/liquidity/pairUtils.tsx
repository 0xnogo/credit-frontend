import BigNumber from 'bignumber.js';

export const calculateTVL = (
  reserve0: string,
  reserve1: string,
  token0USDC: string,
  token1USDC: string,
) => {
  return new BigNumber(reserve0)
    .times(token0USDC)
    .plus(new BigNumber(reserve1).times(token1USDC));
};
