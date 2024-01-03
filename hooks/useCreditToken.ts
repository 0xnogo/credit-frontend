import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { Token } from 'types/assets';
import { useMemo } from 'react';
import { CREDIT_TOKEN_ADDRESS } from '@constants/contracts/addresses';
import BigNumber from 'bignumber.js';
import { BIG_NUMBER_ZERO } from '@constants/index';

export const useCreditToken = (): Token => {
  const { chainId } = useActiveWeb3React();

  return useMemo(() => {
    return {
      address: CREDIT_TOKEN_ADDRESS[chainId],
      decimals: 18,
      symbol: 'CREDIT',
      name: 'CREDIT',
      price: BIG_NUMBER_ZERO,
      derivedETH: BIG_NUMBER_ZERO,
    };
  }, [chainId]);
};
