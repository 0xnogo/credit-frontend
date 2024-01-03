import { useMemo } from "react";
import { useActiveWeb3React } from "services/web3/useActiveWeb3React";
import { useCallContractWait } from "hooks/useCallContractWait";
import { getGasPrice } from "functions/transactions/getGasPrice";
import { getConvenienceContract } from "constants/contracts";
import { NATIVE_ADDRESS } from "constants/contracts/addresses";
import {
  REMOVE_LIQUIDITY_CREDIT,
  REMOVE_LIQUIDITY_CREDIT_NATIVE_ASSET,
  REMOVE_LIQUIDITY_CREDIT_NATIVE_COLLATERAL,
} from "constants/contracts/functions";
import { getAddress } from "ethers/lib/utils";
import { CreditPair, CreditPool } from "types/credit";
import { ENABLE_WHITELIST } from "@constants/index";

export const useLiquidityRemoveCallbackCredit = (
  pair: CreditPair,
  pool: CreditPool,
  creditPositionId: string,
  depositCallback: (err?: any) => void
) => {
  const context = useActiveWeb3React();

  const { account, chainId, web3 } = context;
  const callContractWait = useCallContractWait(ENABLE_WHITELIST);

  return useMemo(() => {
    return async (withdrawTXID: string) => {
      try {
        const gasPrice = await getGasPrice(web3);
        // SUBMIT WITHDRAW TRANSACTION
        const convenienceContract = getConvenienceContract(web3, chainId);

        let func = REMOVE_LIQUIDITY_CREDIT[chainId];
        let params: any = [
          {
            asset: pair.asset.address,
            collateral: pair.collateral.address,
            maturity: pool.maturity,
            assetTo: account,
            collateralTo: account,
            creditPositionId: creditPositionId,
          },
        ];

        if (getAddress(pair.asset.address) === NATIVE_ADDRESS[chainId]) {
          func = REMOVE_LIQUIDITY_CREDIT_NATIVE_ASSET[chainId];
          params = [
            {
              collateral: pair.collateral.address,
              maturity: pool.maturity,
              assetTo: account,
              collateralTo: account,
              creditPositionId: creditPositionId,
            },
          ];
        } else if (
          getAddress(pair.collateral.address) === NATIVE_ADDRESS[chainId]
        ) {
          func = REMOVE_LIQUIDITY_CREDIT_NATIVE_COLLATERAL[chainId];
          params = [
            {
              asset: pair.asset.address,
              maturity: pool.maturity,
              assetTo: account,
              collateralTo: account,
              creditPositionId: creditPositionId,
            },
          ];
        }

        callContractWait(
          convenienceContract,
          func,
          params,
          gasPrice,
          withdrawTXID,
          (err: any) => {
            depositCallback(err);
          }
        );
      } catch (ex) {
        depositCallback(ex);
      }
    };
  }, [
    pair,
    pool,
    context,
    depositCallback,
    callContractWait,
    creditPositionId,
  ]);
};
