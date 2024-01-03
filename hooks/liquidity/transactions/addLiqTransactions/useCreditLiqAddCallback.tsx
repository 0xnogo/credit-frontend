import BigNumber from "bignumber.js";
import moment from "moment";
import { useMemo } from "react";
import { Token } from "types/assets";
import { useActiveWeb3React } from "services/web3/useActiveWeb3React";
import { useCurrentTransactions } from "hooks/useCurrentTransactions";
import { useCallContractWait } from "hooks/useCallContractWait";
import { NATIVE_ADDRESS } from "constants/contracts/addresses";
import { getGasPrice } from "functions/transactions/getGasPrice";
import {
  getConvenienceContract,
  getCreditPositionContract,
} from "constants/contracts";
import {
  EXISTING_LIQUIDITY_CREDIT,
  EXISTING_LIQUIDITY_CREDIT_ASSET,
  EXISTING_LIQUIDITY_CREDIT_ASSET_NATIVE_ASSET,
  EXISTING_LIQUIDITY_CREDIT_ASSET_NATIVE_COLLATERAL,
  EXISTING_LIQUIDITY_CREDIT_NATIVE_ASSET,
  EXISTING_LIQUIDITY_CREDIT_NATIVE_COLLATERAL,
} from "constants/contracts/functions";
import { ENABLE_WHITELIST } from "@constants/index";

export const useDepositCallbackCredit = (
  asset: Token,
  collateral: Token,
  assetInAmount: string,
  collateralInAmount: string,
  maturity: string,
  debt: string,
  deadline: string,
  slippage: string,
  priorityAsset: 0 | 1,
  depositCallback: (err?: any) => void,
  afterDepositCallback: (id: string, allowanceCPTXID: string) => void
) => {
  const { account, chainId, web3 } = useActiveWeb3React();
  const { addTransaction, setTransactionStatus } = useCurrentTransactions();
  const callContractWait = useCallContractWait(ENABLE_WHITELIST);

  return useMemo(() => {
    return async (depositTXID: string, allowanceCPTXID?: string) => {
      try {
        if (!web3) {
          console.warn("web3 not found");
          depositCallback("web3 not found");
          return;
        }

        const gasPrice = await getGasPrice(web3);

        // SUBMIT DEPOSIT TRANSACTION
        const sendSlippage = new BigNumber(100).minus(slippage).div(100);
        const sendSlippageInc = new BigNumber(100).plus(slippage).div(100);
        const assetAmount = new BigNumber(assetInAmount).times(
          10 ** asset?.decimals
        );
        const collateralAmount = new BigNumber(collateralInAmount).times(
          10 ** collateral?.decimals
        );
        const debtIn = new BigNumber(debt).times(10 ** asset?.decimals);
        const minLiq = new BigNumber(0);
        const txDeadline = "" + moment().utc().add(deadline, "minutes").unix();
        let func = ";";
        let params: any = [];

        let sendValue = new BigNumber(0);
        if (priorityAsset === 1) {
          func = EXISTING_LIQUIDITY_CREDIT[chainId];
          params = [
            {
              asset: asset.address,
              maxAsset: assetAmount.times(sendSlippageInc).toFixed(0),
              collateral: collateral.address,
              collateralIn: collateralAmount.toFixed(0),
              deadline: txDeadline,
              maxDebt: debtIn.times(sendSlippageInc).toFixed(0),
              dueTo: account,
              liquidityTo: account,
              maturity: maturity,
              minLiquidity: minLiq.times(sendSlippage).toFixed(0),
            },
          ];

          if (asset.address === NATIVE_ADDRESS[chainId]) {
            func = EXISTING_LIQUIDITY_CREDIT_NATIVE_ASSET[chainId];
            params = [
              {
                collateral: collateral.address,
                collateralIn: collateralAmount.toFixed(0),
                deadline: txDeadline,
                maxDebt: debtIn.times(sendSlippageInc).toFixed(0),
                dueTo: account,
                liquidityTo: account,
                maturity: maturity,
                minLiquidity: minLiq.times(sendSlippage).toFixed(0),
              },
            ];
            sendValue = assetAmount.times(sendSlippageInc);
          }
          if (collateral.address === NATIVE_ADDRESS[chainId]) {
            func = EXISTING_LIQUIDITY_CREDIT_NATIVE_COLLATERAL[chainId];
            params = [
              {
                asset: asset.address,
                maxAsset: assetAmount.times(sendSlippageInc).toFixed(0),
                deadline: txDeadline,
                maxDebt: debtIn.times(sendSlippageInc).toFixed(0),
                dueTo: account,
                liquidityTo: account,
                maturity: maturity,
                minLiquidity: minLiq.toFixed(0),
              },
            ];
            sendValue = collateralAmount;
          }
        } else {
          func = EXISTING_LIQUIDITY_CREDIT_ASSET[chainId];
          params = [
            {
              asset: asset.address,
              maxCollateral: collateralAmount.times(sendSlippageInc).toFixed(0),
              collateral: collateral.address,
              assetIn: assetAmount.toFixed(0),
              deadline: txDeadline,
              maxDebt: debtIn.times(sendSlippageInc).toFixed(0),
              dueTo: account,
              liquidityTo: account,
              maturity: maturity,
              minLiquidity: minLiq.times(sendSlippage).toFixed(0),
            },
          ];
          if (asset.address === NATIVE_ADDRESS[chainId]) {
            func = EXISTING_LIQUIDITY_CREDIT_ASSET_NATIVE_ASSET[chainId];
            params = [
              {
                collateral: collateral.address,
                maxCollateral: collateralAmount
                  .times(sendSlippageInc)
                  .toFixed(0),
                deadline: txDeadline,
                maxDebt: debtIn.times(sendSlippageInc).toFixed(0),
                dueTo: account,
                liquidityTo: account,
                maturity: maturity,
                minLiquidity: minLiq.times(sendSlippage).toFixed(0),
              },
            ];
            sendValue = assetAmount;
          }
          if (collateral.address === NATIVE_ADDRESS[chainId]) {
            func = EXISTING_LIQUIDITY_CREDIT_ASSET_NATIVE_COLLATERAL[chainId];
            params = [
              {
                asset: asset.address,
                assetIn: assetAmount.toFixed(0),
                deadline: txDeadline,
                maxDebt: debtIn.times(sendSlippageInc).toFixed(0),
                dueTo: account,
                liquidityTo: account,
                maturity: maturity,
                minLiquidity: minLiq.times(sendSlippage).toFixed(0),
              },
            ];
            sendValue = collateralAmount.times(sendSlippageInc);
          }
        }

        const convenienceContract = getConvenienceContract(web3, chainId);
        callContractWait(
          convenienceContract,
          func,
          params,
          gasPrice,
          depositTXID,
          async (err: any) => {
            if (err) {
              depositCallback(err);
              return;
            }
            depositCallback();
            if (allowanceCPTXID) {
              const creditPositionsContract = getCreditPositionContract(
                web3,
                chainId
              );
              const totalPositions = Number(
                await creditPositionsContract.methods
                  .balanceOf(account as string)
                  .call()
              );
              const newCPId = await creditPositionsContract.methods
                .tokenOfOwnerByIndex(account as string, totalPositions - 1)
                .call();
              afterDepositCallback(newCPId, allowanceCPTXID);
            }
          },
          sendValue.toFixed(0)
        );
      } catch (ex) {
        depositCallback(ex);
      }
    };
  }, [
    asset,
    collateral,
    assetInAmount,
    collateralInAmount,
    depositCallback,
    addTransaction,
    setTransactionStatus,
    callContractWait,
    account,
    chainId,
    web3,
    priorityAsset,
  ]);
};
