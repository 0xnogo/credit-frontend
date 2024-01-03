import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { Token } from 'types/assets';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { getConvenienceContract } from 'constants/contracts';
import { Contract } from 'types/web3';
import { NATIVE_ADDRESS } from 'constants/contracts/addresses';
import { getGasPrice } from 'functions/transactions/getGasPrice';
import { ENABLE_WHITELIST } from '@constants/index';

const useLendCallback = (
  asset: Token,
  collateral: Token,
  maturity: BigNumber,
  assetIn: BigNumber,
  bond: BigNumber,
  insurance: BigNumber,
  percent: BigNumber,
  deadline: string,
  slippage: string,
  lendCallback: (err?: any) => void,
  setTransactionStatus: any,
) => {
  const { web3, account, chainId } = useActiveWeb3React();
  const callContractWait = useCallContractWait(ENABLE_WHITELIST);

  return useMemo(() => {
    return async (lendTXID: string) => {
      try {
        assetIn = assetIn.times(Math.pow(10, asset.decimals));
        // SUBMIT LEND TRANSACTION
        const sendSlippage = new BigNumber(100).minus(slippage).div(100);
        const minLoan = bond.times(sendSlippage).toFixed(0);
        const minCoverage = insurance.times(sendSlippage).toFixed(0);
        const txDeadline = '' + moment().utc().add(deadline, 'minutes').unix();

        let func = 'lendGivenPercent';
        let params: any = [
          {
            asset: asset.address,
            collateral: collateral.address,
            maturity: maturity.toFixed(),
            to: account,
            assetIn: assetIn.toFixed(0),
            percent: percent.toFixed(0),
            minLoan,
            minCoverage,
            deadline: txDeadline,
          },
        ];
        let sendValue;
        if (asset.address === NATIVE_ADDRESS[chainId]) {
          func = 'lendGivenPercentETHAsset';
          params = [
            {
              collateral: collateral.address,
              maturity: maturity.toFixed(),
              to: account,
              percent: percent.toFixed(0),
              minLoan,
              minCoverage,
              deadline: txDeadline,
            },
          ];
          sendValue = assetIn.toFixed(0);
        }
        if (collateral.address === NATIVE_ADDRESS[chainId]) {
          func = 'lendGivenPercentETHCollateral';
          params = [
            {
              asset: asset.address,
              maturity: maturity.toFixed(),
              to: account,
              assetIn: assetIn.toFixed(0),
              percent: percent.toFixed(0),
              minLoan,
              minCoverage,
              deadline: txDeadline,
            },
          ];
          sendValue = undefined;
        }

        const convenienceContract = getConvenienceContract(web3, chainId);

        const gasPrice = await getGasPrice(web3);
        callContractWait(
          convenienceContract as Contract,
          func,
          params,
          gasPrice,
          lendTXID,
          async (err: any) => {
            if (err) {
              return lendCallback(err);
            }
            lendCallback();
          },
          sendValue,
        );
      } catch (ex) {
        console.log(ex);
        lendCallback(ex);
      }
    };
  }, [
    asset,
    collateral,
    assetIn,
    bond,
    insurance,
    percent,
    maturity,
    lendCallback,
    setTransactionStatus,
    callContractWait,
    web3,
    account,
    chainId,
    setTransactionStatus,
    deadline,
    slippage,
  ]);
};

export default useLendCallback;
