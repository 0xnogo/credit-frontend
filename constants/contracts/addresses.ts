import { ChainIds } from 'constants/chains';
import { ChainMapping } from 'types/web3';

export const CONVENIENCE_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM]: '0xD4FE5fB6B0d1EDd379C915aBf4567846A043fcDa',
  [ChainIds.ARBITRUM_GOERLI]: '0x635519Eb4d1113305e1c1D5d06ce9e08E8eE9aD0',
  [ChainIds.LOCALHOST]: '0x87411145423fDf9123040799F9Ff894153339a75',
  [ChainIds.MELIORA_TEST]: '0x74a91DEBfc99E8BBbae1DCd893088a06DE379812',
};

export const CREDIT_TOKEN_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM_GOERLI]: '0xa0e9DDE8fa9AeEa39f459F66831b35A0620f3D99',
  [ChainIds.LOCALHOST]: '0x685d694dF37BE88553E72E17AFe4B7A570B93Efb',
  [ChainIds.MELIORA_TEST]: '0x0000000000000000000000000000000000000000',
};

export const WRAPPED_NATIVE_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  [ChainIds.ARBITRUM_GOERLI]: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
  [ChainIds.LOCALHOST]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  [ChainIds.MELIORA_TEST]: '0xF5c6100Fa77971b2B531c752eA82874Df8bAB44A',
};

export const NATIVE_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM]: '0x0000000000000000000000000000000000000000',
  [ChainIds.ARBITRUM_GOERLI]: '0x0000000000000000000000000000000000000000',
  [ChainIds.LOCALHOST]: '0x0000000000000000000000000000000000000000',
  [ChainIds.MELIORA_TEST]: '0x0000000000000000000000000000000000000000',
};

export const MULTICALL_ADDRESS: ChainMapping = {
  [ChainIds.GOERLI]: '0x64f9Bd0Db768157249c3510Fb08C1d619000e00E',
  [ChainIds.ARBITRUM]: '0x99D73e5d83148FA2b41248059061f91703Cf0516',
  [ChainIds.ARBITRUM_GOERLI]: '0xb41F089d845eedfB8AC1f60cf8282fadabb6A174',
  [ChainIds.LOCALHOST]: '0x99D73e5d83148FA2b41248059061f91703Cf0516',
  [ChainIds.MELIORA_TEST]: '0x740Ab74A1E9221f493fD14f423a8878aa0Bd118a',
};

export const CREDIT_POSITION_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM_GOERLI]: '0xC77069F3FF65FADaea556854696562b56ddddB35',
  [ChainIds.LOCALHOST]: '0x10B30440a8FB05B01F3F00E5CB6F3314CC720CE7',
  [ChainIds.MELIORA_TEST]: '0x55fA7fd435bBBe3de9d7EBCF75CBfB242911B294',
};

export const ROUTER_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM]: '0x81C7EBbC66b5f9e1dB29C4C427Fe6339cc32D4eA',
  [ChainIds.ARBITRUM_GOERLI]: '0x1E7bD58bf6196303102e78E2B1F47B67AbCe0EEA',
  [ChainIds.LOCALHOST]: '0x81C7EBbC66b5f9e1dB29C4C427Fe6339cc32D4eA',
};

export const MULTISWAP_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM]: '0x0E7D0D4AE86054D182a2a82590967Bd5ac2c7EeE',
  [ChainIds.ARBITRUM_GOERLI]: '0xa9d1Daeb885e5f1E347E39Fbca3E9d0878a14F32',
  [ChainIds.LOCALHOST]: '0x0E7D0D4AE86054D182a2a82590967Bd5ac2c7EeE',
};

export const LP_FARMING_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM]: 'liquidityGivenCollateral',
  [ChainIds.ARBITRUM_GOERLI]: '0x9c580af6c45901FB0F1C7E9328646A08D21b92c6',
  [ChainIds.LOCALHOST]: '0xbC5eC82C3C8D0e36660557599D33fbF95c9738f1',
  [ChainIds.MELIORA_TEST]: '0x0000000000000000000000000000000000000000',
};

export const CREDIT_STAKING_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM]: 'liquidityGivenCollateral',
  [ChainIds.ARBITRUM_GOERLI]: '0x3F160Ca59818Df6fd08F7b207c87E864a6247468',
  [ChainIds.LOCALHOST]: '0x39A41BAaf5cED9245a22fEA1b349D1E658992216',
  [ChainIds.MELIORA_TEST]: '0x0000000000000000000000000000000000000000',
};

export const AUCTION_CLAIM_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM]: 'liquidityGivenCollateral',
  [ChainIds.ARBITRUM_GOERLI]: 'liquidityGivenCollateral',
  [ChainIds.LOCALHOST]: '0xa714cb28ECc47aCc139C300A8BAdCBe1E86297d3',
  [ChainIds.MELIORA_TEST]: '0x0000000000000000000000000000000000000000',
};

export const AUCTION_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM]: 'liquidityGivenCollateral',
  [ChainIds.ARBITRUM_GOERLI]: 'liquidityGivenCollateral',
  [ChainIds.LOCALHOST]: '0x80fCd683DC69f569cD924Ae8701c73A2c755B7Dc',
  [ChainIds.MELIORA_TEST]: '0x0000000000000000000000000000000000000000',
};

export const FAUCET_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM_GOERLI]: '0x07c0669E7F0B17D31060Ff3B1CF6a1bF241A8C6d',
  [ChainIds.LOCALHOST]: '0x80fCd683DC69f569cD924Ae8701c73A2c755B7Dc',
  [ChainIds.MELIORA_TEST]: '0x63d41A749aA170cB3144519763390E479b2ae9DD',
};

export const USDC_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM_GOERLI]: '0x96244E2ae03B8edA8c1035F75948667777D3ac52',
  [ChainIds.MELIORA_TEST]: '0xf32591AcCB308f691f7D3efc93EF98c48C5F4a62',
};

export const ARB_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM_GOERLI]: '0x2C085310719Bf846A135ff80c059aaBc96320A49',
  [ChainIds.MELIORA_TEST]: '0x713b9dD3e0E934CBb319aa28cB9FE5306fb73Fd3',
};

export const AUCTION_REFERRAL_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM]: 'liquidityGivenCollateral',
  [ChainIds.ARBITRUM_GOERLI]: 'liquidityGivenCollateral',
  [ChainIds.LOCALHOST]: '0xd984639E105d160f3C0f5E7459E2FfeD4Ac463A1',
  [ChainIds.MELIORA_TEST]: '0x0000000000000000000000000000000000000000',
};

export const DEPOSIT_AND_PLACE_ORDER_ADDRESS: ChainMapping = {
  [ChainIds.ARBITRUM_GOERLI]: 'liquidityGivenCollateral',
  [ChainIds.LOCALHOST]: '0x87C590778B35381A631824e835298286dd63f160',
  [ChainIds.MELIORA_TEST]: '0x0000000000000000000000000000000000000000',
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';