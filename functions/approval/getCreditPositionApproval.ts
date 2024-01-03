import BigNumber from 'bignumber.js';
import {
  CONVENIENCE_ADDRESS,
  CREDIT_POSITION_ADDRESS,
} from 'constants/contracts/addresses';
import { getCreditPositionAllowance } from 'functions/transactions/allowances';
import Web3 from 'web3';

export const getCreditPositionApproval = async (
  chainId: number,
  web3: Web3,
  setTransactionStatus: any,
  positionId: string,
  allowance0TXID: string,
  callback?: () => void,
  overrideAddress?: string,
) => {
  let assetAllowance = null;
  let status = 'WAITING';
  // CHECK ALLOWANCES AND SET TX DISPLAY

  await setTransactionStatus({
    uuid: allowance0TXID,
    description: `Checking your allowance on position`,
    status: 'PENDING',
  });
  assetAllowance = await getCreditPositionAllowance(
    web3,
    positionId,
    overrideAddress ?? CONVENIENCE_ADDRESS[chainId],
    chainId,
  );

  if (!assetAllowance) {
    await setTransactionStatus({
      uuid: allowance0TXID,
      description: `Allow the contract to spend your position`,
      status: 'WAITING',
    });
    status = 'WAITING';
  } else {
    await setTransactionStatus({
      uuid: allowance0TXID,
      description: `Allowance on position sufficient`,
      status: 'DONE',
    });
    status = 'DONE';
  }

  callback && (await callback());

  return { assetAllowance, status };
};
