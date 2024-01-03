import { ChainIds } from 'constants/chains';
import { ChainMapping } from 'types/web3';

export const NEW_LIQUIDITY_CREDIT_NATIVE_ASSET: ChainMapping = {
  250: 'newLiquidityETHAsset',
  5: 'newLiquidityETHAsset',
  [ChainIds.ARBITRUM]: 'newLiquidityETHAsset',
  [ChainIds.ARBITRUM_GOERLI]: 'newLiquidityETHAsset',
  [ChainIds.LOCALHOST]: 'newLiquidityETHAsset',
  [ChainIds.MELIORA_TEST]: 'newLiquidityETHAsset',
};

export const NEW_LIQUIDITY_CREDIT_NATIVE_COLLATERAL: ChainMapping = {
  250: 'newLiquidityETHCollateral',
  5: 'newLiquidityETHCollateral',
  [ChainIds.ARBITRUM]: 'newLiquidityETHCollateral',
  [ChainIds.ARBITRUM_GOERLI]: 'newLiquidityETHCollateral',
  [ChainIds.LOCALHOST]: 'newLiquidityETHCollateral',
  [ChainIds.MELIORA_TEST]: 'newLiquidityETHCollateral',
};

export const NEW_LIQUIDITY_CREDIT: ChainMapping = {
  250: 'newLiquidity',
  5: 'newLiquidity',
  [ChainIds.ARBITRUM]: 'newLiquidity',
  [ChainIds.ARBITRUM_GOERLI]: 'newLiquidity',
  [ChainIds.LOCALHOST]: 'newLiquidity',
  [ChainIds.MELIORA_TEST]: 'newLiquidity',
};

export const EXISTING_LIQUIDITY_CREDIT_ASSET: ChainMapping = {
  250: 'liquidityGivenAsset',
  5: 'liquidityGivenAsset',
  [ChainIds.ARBITRUM]: 'liquidityGivenAsset',
  [ChainIds.ARBITRUM_GOERLI]: 'liquidityGivenAsset',
  [ChainIds.LOCALHOST]: 'liquidityGivenAsset',
  [ChainIds.MELIORA_TEST]: 'liquidityGivenAsset',
};

export const EXISTING_LIQUIDITY_CREDIT_ASSET_NATIVE_ASSET: ChainMapping = {
  250: 'liquidityGivenAssetETHAsset',
  5: 'liquidityGivenAssetETHAsset',
  [ChainIds.ARBITRUM]: 'liquidityGivenAssetETHAsset',
  [ChainIds.ARBITRUM_GOERLI]: 'liquidityGivenAssetETHAsset',
  [ChainIds.LOCALHOST]: 'liquidityGivenAssetETHAsset',
  [ChainIds.MELIORA_TEST]: 'liquidityGivenAssetETHAsset',
};

export const EXISTING_LIQUIDITY_CREDIT_ASSET_NATIVE_COLLATERAL: ChainMapping = {
  250: 'liquidityGivenAssetETHCollateral',
  5: 'liquidityGivenAssetETHCollateral',
  [ChainIds.ARBITRUM]: 'liquidityGivenAssetETHCollateral',
  [ChainIds.ARBITRUM_GOERLI]: 'liquidityGivenAssetETHCollateral',
  [ChainIds.LOCALHOST]: 'liquidityGivenAssetETHCollateral',
  [ChainIds.MELIORA_TEST]: 'liquidityGivenAssetETHCollateral',
};

export const EXISTING_LIQUIDITY_CREDIT: ChainMapping = {
  250: 'liquidityGivenCollateral',
  5: 'liquidityGivenCollateral',
  [ChainIds.ARBITRUM]: 'liquidityGivenCollateral',
  [ChainIds.ARBITRUM_GOERLI]: 'liquidityGivenCollateral',
  [ChainIds.LOCALHOST]: 'liquidityGivenCollateral',
  [ChainIds.MELIORA_TEST]: 'liquidityGivenCollateral',
};

export const EXISTING_LIQUIDITY_CREDIT_NATIVE_ASSET: ChainMapping = {
  250: 'liquidityGivenCollateralETHAsset',
  5: 'liquidityGivenCollateralETHAsset',
  [ChainIds.ARBITRUM]: 'liquidityGivenCollateralETHAsset',
  [ChainIds.ARBITRUM_GOERLI]: 'liquidityGivenCollateralETHAsset',
  [ChainIds.LOCALHOST]: 'liquidityGivenCollateralETHAsset',
  [ChainIds.MELIORA_TEST]: 'liquidityGivenCollateralETHAsset',
};

export const EXISTING_LIQUIDITY_CREDIT_NATIVE_COLLATERAL: ChainMapping = {
  250: 'liquidityGivenCollateralETHCollateral',
  5: 'liquidityGivenCollateralETHCollateral',
  [ChainIds.ARBITRUM]: 'liquidityGivenCollateralETHCollateral',
  [ChainIds.ARBITRUM_GOERLI]: 'liquidityGivenCollateralETHCollateral',
  [ChainIds.LOCALHOST]: 'liquidityGivenCollateralETHCollateral',
  [ChainIds.MELIORA_TEST]: 'liquidityGivenCollateralETHCollateral',
};

export const REMOVE_LIQUIDITY_CREDIT: ChainMapping = {
  250: 'removeLiquidity',
  5: 'removeLiquidity',
  [ChainIds.ARBITRUM]: 'removeLiquidity',
  [ChainIds.ARBITRUM_GOERLI]: 'removeLiquidity',
  [ChainIds.LOCALHOST]: 'removeLiquidity',
  [ChainIds.MELIORA_TEST]: 'removeLiquidity',
};

export const REMOVE_LIQUIDITY_CREDIT_NATIVE_ASSET: ChainMapping = {
  250: 'removeLiquidityETHAsset',
  5: 'removeLiquidityETHAsset',
  [ChainIds.ARBITRUM]: 'removeLiquidityETHAsset',
  [ChainIds.ARBITRUM_GOERLI]: 'removeLiquidityETHAsset',
  [ChainIds.LOCALHOST]: 'removeLiquidityETHAsset',
  [ChainIds.MELIORA_TEST]: 'removeLiquidityETHAsset',
};

export const REMOVE_LIQUIDITY_CREDIT_NATIVE_COLLATERAL: ChainMapping = {
  250: 'removeLiquidityETHCollateral',
  5: 'removeLiquidityETHCollateral',
  [ChainIds.ARBITRUM]: 'removeLiquidityETHCollateral',
  [ChainIds.ARBITRUM_GOERLI]: 'removeLiquidityETHCollateral',
  [ChainIds.LOCALHOST]: 'removeLiquidityETHCollateral',
  [ChainIds.MELIORA_TEST]: 'removeLiquidityETHCollateral',
};
