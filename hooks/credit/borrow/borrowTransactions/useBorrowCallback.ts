import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { Token } from 'types/assets';
import { NATIVE_ADDRESS } from 'constants/contracts/addresses';

import { getConvenienceContract } from 'constants/contracts';
import { getGasPrice } from 'functions/transactions/getGasPrice';
import { ENABLE_WHITELIST } from '@constants/index';

export const useBorrowCallback = (
  asset: Token,
  collateral: Token,
  maturity: BigNumber,
  assetOut: BigNumber,
  dueOut: { debt: BigNumber; collateral: BigNumber },
  percent: BigNumber,
  deadline: string,
  slippage: string,
  borrowCallback: (err?: any) => void,
) => {
  const { web3, account, chainId } = useActiveWeb3React();
  const { addTransaction, setTransactionStatus } = useCurrentTransactions();
  const callContractWait = useCallContractWait(ENABLE_WHITELIST);

  return useMemo(() => {
    return async (borrowTXID: string) => {
      try {
        assetOut = assetOut.times(Math.pow(10, asset.decimals));
        const sendSlippageInc = new BigNumber(100).plus(slippage).div(100);
        const maxDebt = dueOut.debt.times(sendSlippageInc);
        const maxCollateral = dueOut.collateral.times(sendSlippageInc);
        const txDeadline = '' + moment().utc().add(deadline, 'minutes').unix();

        // SUBMIT LEND TRANSACTION
        let func = 'borrowGivenPercent';
        let params: any = [
          {
            asset: asset.address,
            collateral: collateral.address,
            maturity: maturity.toFixed(),
            assetTo: account,
            dueTo: account,
            assetOut: assetOut.toFixed(0),
            percent: percent.toFixed(0),
            maxDebt: maxDebt.toFixed(0),
            maxCollateral: maxCollateral.toFixed(0),
            deadline: txDeadline,
          },
        ];
        let sendValue;
        if (asset.address === NATIVE_ADDRESS[chainId]) {
          func = 'borrowGivenPercentETHAsset';
          params = [
            {
              collateral: collateral.address,
              maturity: maturity.toFixed(),
              assetTo: account,
              dueTo: account,
              assetOut: assetOut.toFixed(0),
              percent: percent.toFixed(0),
              maxDebt: maxDebt.toFixed(0),
              maxCollateral: maxCollateral.toFixed(0),
              deadline: txDeadline,
            },
          ];
          sendValue = undefined;
        }
        if (collateral.address === NATIVE_ADDRESS[chainId]) {
          func = 'borrowGivenPercentETHCollateral';
          params = [
            {
              asset: asset.address,
              maturity: maturity.toFixed(),
              assetTo: account,
              dueTo: account,
              assetOut: assetOut.toFixed(0),
              percent: percent.toFixed(0),
              maxDebt: maxDebt.toFixed(0),
              deadline: txDeadline,
            },
          ];
          sendValue = maxCollateral.toFixed(0);
        }

        const gasPrice = await getGasPrice(web3);
        const convenienceContract = getConvenienceContract(web3, chainId);
        callContractWait(
          convenienceContract,
          func,
          params,
          gasPrice,
          borrowTXID,
          async (err: any) => {
            if (err) {
              return borrowCallback(err);
            }
            borrowCallback();
          },
          sendValue,
        );
      } catch (ex) {
        borrowCallback(ex);
      }
    };
  }, [
    asset,
    collateral,
    assetOut,
    dueOut,
    percent,
    borrowCallback,
    addTransaction,
    setTransactionStatus,
    callContractWait,
    web3,
    account,
    chainId,
  ]);
};
