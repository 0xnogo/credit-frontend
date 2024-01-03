import { Token } from 'types/assets';
import { useMemo } from 'react';
import { CreditPair } from 'types/credit';
import { WRAPPED_NATIVE_ADDRESS } from '@constants/contracts/addresses';
import { ZERO_ADDRESS } from '@constants/index';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';

export function useTokenFilteredPairs(
  asset: Token | null,
  collateral: Token | null,
  pairs: CreditPair[],
) {
  const { chainId } = useActiveWeb3React();

  return useMemo(() => {
    let assetToUse: Token;
    if (asset) {
      if (
        asset?.address.toLowerCase() ===
        WRAPPED_NATIVE_ADDRESS[chainId].toLowerCase()
      ) {
        assetToUse = { ...asset, address: ZERO_ADDRESS };
      } else {
        assetToUse = asset;
      }
    }
    let collateralToUse: Token;
    if (collateral) {
      if (
        collateral?.address.toLowerCase() ===
        WRAPPED_NATIVE_ADDRESS[chainId].toLowerCase()
      ) {
        collateralToUse = { ...collateral, address: ZERO_ADDRESS };
      } else {
        collateralToUse = collateral;
      }
    }
    return pairs.filter((pair) => {
      let filterState = true;
      if (collateral) {
        filterState =
          filterState &&
          collateralToUse.address.toLowerCase() ===
            pair.collateral.address.toLowerCase();
      }
      if (asset) {
        filterState =
          filterState &&
          assetToUse.address.toLowerCase() === pair.asset.address.toLowerCase();
      }
      return filterState;
    });
  }, [asset, collateral, pairs, chainId]);
}
