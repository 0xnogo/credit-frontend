import BigNumber from 'bignumber.js';
import { Natives } from './credit';
import { RewardType } from './rewards';

export type BaseAssets = {
  [chainId: number]: {
    [tokenAddress: string]: Token;
  };
};

export type Token = {
  symbol: string;
  address: string;
  price: BigNumber;
  derivedETH: BigNumber;
  balance?: string;
  totalSupply?: number;
  isWhitelisted?: boolean;
  logoURI?: string;
  decimals: number;
  chainId?: number;
  name: string;
  local?: boolean;
  price?: string;
  feePercent?: string;
};

export type PriorityAsset = 0 | 1;
