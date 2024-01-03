import BigNumber from 'bignumber.js';
import { ChainMapping } from 'types/web3';
import { ChainIds } from './chains';
import { Token } from 'types/assets';
import {
  CREDIT_TOKEN_ADDRESS,
  WRAPPED_NATIVE_ADDRESS,
} from './contracts/addresses';

export const WRAPPED_NATIVE_NAME: ChainMapping = {
  [ChainIds.ARBITRUM]: 'Wrapped Ether',
  [ChainIds.ARBITRUM_GOERLI]: 'Wrapped Ether',
  [ChainIds.LOCALHOST]: 'Wrapped Ether',
  [ChainIds.MELIORA_TEST]: 'Wrapped Ether',
};
export const WRAPPED_NATIVE_SYMBOL: ChainMapping = {
  [ChainIds.ARBITRUM]: 'WETH',
  [ChainIds.ARBITRUM_GOERLI]: 'WETH',
  [ChainIds.LOCALHOST]: 'WETH',
  [ChainIds.MELIORA_TEST]: 'WETH',
};
export const WRAPPED_NATIVE_DECIMALS: ChainMapping = {
  [ChainIds.ARBITRUM]: 18,
  [ChainIds.ARBITRUM_GOERLI]: 18,
  [ChainIds.LOCALHOST]: 18,
  [ChainIds.MELIORA_TEST]: 18,
};

export const ZERO_ADDRESS: string =
  '0x0000000000000000000000000000000000000000';

export const getWrappedNativeToken = (chainId: number): Token => ({
  name: WRAPPED_NATIVE_NAME[chainId],
  symbol: WRAPPED_NATIVE_SYMBOL[chainId],
  decimals: WRAPPED_NATIVE_DECIMALS[chainId],
  address: WRAPPED_NATIVE_ADDRESS[chainId],
  price: new BigNumber(0),
  derivedETH: new BigNumber(0),
});

export const getNativeToken = (chainId: number): Token => ({
  name: NATIVE_NAME[chainId],
  symbol: NATIVE_SYMBOL[chainId],
  decimals: NATIVE_DECIMALS[chainId],
  address: '0x0000000000000000000000000000000000000000',
  price: new BigNumber(0),
  derivedETH: new BigNumber(0),
});

export const getCreditToken = (chainId: number): Token => ({
  name: 'CREDIT',
  symbol: 'CREDIT',
  decimals: 18,
  address: CREDIT_TOKEN_ADDRESS[chainId],
  price: new BigNumber(0),
  derivedETH: new BigNumber(0),
});

export const NATIVE_NAME: ChainMapping = {
  [ChainIds.ARBITRUM]: 'Ether',
  [ChainIds.ARBITRUM_GOERLI]: 'Ether',
  [ChainIds.LOCALHOST]: 'Ether',
  [ChainIds.MELIORA_TEST]: 'Ether',
};
export const NATIVE_SYMBOL: ChainMapping = {
  [ChainIds.ARBITRUM]: 'ETH',
  [ChainIds.ARBITRUM_GOERLI]: 'ETH',
  [ChainIds.LOCALHOST]: 'ETH',
  [ChainIds.MELIORA_TEST]: 'ETH',
};
export const NATIVE_DECIMALS: ChainMapping = {
  [ChainIds.ARBITRUM]: 18,
  [ChainIds.ARBITRUM_GOERLI]: 18,
  [ChainIds.LOCALHOST]: 18,
  [ChainIds.MELIORA_TEST]: 18,
};

export const ETHERSCAN_URL: ChainMapping = {
  [ChainIds.ARBITRUM]: 'https://arbiscan.io',
  [ChainIds.ARBITRUM_GOERLI]: 'https://testnet.arbiscan.io',
  [ChainIds.LOCALHOST]: '',
  [ChainIds.MELIORA_TEST]: 'https://volatilis-testnet.calderaexplorer.xyz',
};

export const OPENSEA_URL: ChainMapping = {
  [ChainIds.ARBITRUM]: 'https://opensea.io/assets/arbitrum/',
  [ChainIds.ARBITRUM_GOERLI]:
    'https://testnets.opensea.io/assets/arbitrum-goerli/',
  [ChainIds.LOCALHOST]: '',
  [ChainIds.MELIORA_TEST]: ''
};

export const ETHERSCAN_NAME: ChainMapping = {
  [ChainIds.ARBITRUM]: 'Arbiscan',
  [ChainIds.ARBITRUM_GOERLI]: 'Explorer',
  [ChainIds.MELIORA_TEST]: 'Meliorascan'
};

export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1).toFixed(0);

export const DEFI_LLAMA_API = 'https://coins.llama.fi';

export const BIG_NUMBER_ZERO = new BigNumber(0);

export const ENABLE_WHITELIST = true;