import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { getGasPrice } from 'functions/transactions/getGasPrice';
import { NATIVE_ADDRESS } from 'constants/contracts/addresses';
import { getConvenienceContract } from 'constants/contracts';
import { CreditPosition } from 'functions/credit/creditPositions';
import { ENABLE_WHITELIST } from '@constants/index';

export const useClaimCallback = (
  asset: Token,
  collateral: Token,
  maturity: BigNumber,
  position: CreditPosition,
  claimCallback: (err?: any) => void,
) => {
  const { web3, account, chainId } = useActiveWeb3React();
  const callContractWait = useCallContractWait(ENABLE_WHITELIST);

  return useMemo(() => {
    return async (claimTXID: string) => {
      try {
        const gasPrice = await getGasPrice(web3);

        let func = 'collect';
        let params: any = [
          {
            asset: asset.address,
            collateral: collateral.address,
            maturity: maturity.toFixed(),
            assetTo: account,
            collateralTo: account,
            creditPositionId: position.positionIndex,
          },
        ];
        let sendValue = '0';
        if (asset.address === NATIVE_ADDRESS[chainId]) {
          func = 'collectETHAsset';
          params = [
            {
              collateral: collateral.address,
              maturity: maturity.toFixed(),
              assetTo: account,
              collateralTo: account,
              creditPositionId: position.positionIndex,
            },
          ];
          sendValue = '0';
        }
        if (collateral.address === NATIVE_ADDRESS[chainId]) {
          func = 'collectETHCollateral';
          params = [
            {
              asset: asset.address,
              maturity: maturity.toFixed(),
              assetTo: account,
              collateralTo: account,
              creditPositionId: position.positionIndex,
            },
          ];
          sendValue = '0';
        }

        const convenienceContract = getConvenienceContract(web3, chainId);
        callContractWait(
          convenienceContract,
          func,
          params,
          gasPrice,
          claimTXID,
          async (err: any) => {
            if (err) {
              return claimCallback(err);
            }
            claimCallback();
          },
          sendValue,
        );
      } catch (ex) {
        claimCallback(ex);
      }
    };
  }, [
    asset,
    collateral,
    position,
    claimCallback,
    callContractWait,
    web3,
    account,
    chainId,
    callContractWait,
  ]);
};
