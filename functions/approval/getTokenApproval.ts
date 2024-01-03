import BigNumber from 'bignumber.js';
import { MAX_UINT256 } from 'constants/';
import { NATIVE_ADDRESS } from 'constants/contracts/addresses';
import { getAllowance } from 'functions/transactions/allowances';
import { Token } from 'types/assets';
import Web3 from 'web3';

export const getTokenApproval = async (
  asset: Token,
  chainId: number,
  web3: Web3,
  account: string,
  assetIn: BigNumber,
  otherAddress: string,
  setTransactionStatus: any,
  allowance0TXID: string,
  callback?: () => void,
) => {
  let assetAllowance = null;
  let status = 'WAITING';
  // CHECK ALLOWANCES AND SET TX DISPLAY

  await setTransactionStatus({
    uuid: allowance0TXID,
    description: `Checking your allowance on ${asset.symbol}`,
    status: 'PENDING',
  });
  if (asset.address !== NATIVE_ADDRESS[chainId]) {
    assetAllowance = await getAllowance(web3, asset, account, otherAddress);

    if (new BigNumber(assetAllowance).lt(assetIn)) {
      await setTransactionStatus({
        uuid: allowance0TXID,
        description: `Allow the contract to spend your ${asset.symbol}`,
        status: 'WAITING',
      });
      status = 'WAITING';
    } else {
      await setTransactionStatus({
        uuid: allowance0TXID,
        description: `Allowance on ${asset.symbol} sufficient`,
        status: 'DONE',
      });
      status = 'DONE';
    }
  } else {
    assetAllowance = new BigNumber(MAX_UINT256);
    await setTransactionStatus({
      uuid: allowance0TXID,
      description: `Allowance on ${asset.symbol} sufficient`,
      status: 'DONE',
    });
    status = 'DONE';
  }

  callback && (await callback());

  return { assetAllowance, status };
};
