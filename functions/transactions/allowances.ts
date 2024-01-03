import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { Token } from '../../types/assets';
import {
  getCreditPositionContract,
  getTokenContract,
} from 'constants/contracts';
import {
  CONVENIENCE_ADDRESS,
  CREDIT_POSITION_ADDRESS,
  CREDIT_STAKING_ADDRESS,
  MULTISWAP_ADDRESS,
  ROUTER_ADDRESS,
} from 'constants/contracts/addresses';
import { CreditPair } from 'types/credit';

export const getSwaoDepositAllowance = async (
  web3: Web3,
  token: Token,
  account: string,
  chainId: number,
): Promise<string> => {
  try {
    const tokenContract = getTokenContract(web3, token.address);
    const allowance = await tokenContract.methods
      .allowance(account, ROUTER_ADDRESS[chainId])
      .call();
    return new BigNumber(allowance)
      .div(10 ** Number(token.decimals))
      .toFixed(Number(token.decimals));
  } catch (ex) {
    console.error('error@getDepositAllowance', ex);
    return '0';
  }
};

export const getCreditDepositAllowance = async (
  web3: Web3,
  token: Token,
  account: string,
  chainId: number,
): Promise<string> => {
  try {
    const tokenContract = getTokenContract(web3, token.address);
    const allowance = await tokenContract.methods
      .allowance(account, CONVENIENCE_ADDRESS[chainId])
      .call();
    return new BigNumber(allowance)
      .div(10 ** Number(token.decimals))
      .toFixed(Number(token.decimals));
  } catch (ex) {
    console.error(ex);
    return '0';
  }
};

export const getStakeDepositAllowance = async (
  web3: Web3,
  token: Token,
  account: string,
  chainId: number,
): Promise<string> => {
  try {
    const tokenContract = getTokenContract(web3, token.address);
    const allowance = await tokenContract.methods
      .allowance(account, CREDIT_STAKING_ADDRESS[chainId])
      .call();
    return new BigNumber(allowance)
      .div(10 ** Number(token.decimals))
      .toFixed(Number(token.decimals));
  } catch (ex) {
    console.error(ex);
    return '0';
  }
};

export const getCreditPositionAllowance = async (
  web3: Web3,
  tokenId: string,
  approvalAddress: string,
  chainId: number,
): Promise<boolean> => {
  try {
    const tokenContract = getCreditPositionContract(web3, chainId);
    const allowanceAddress = await tokenContract.methods
      .getApproved(tokenId)
      .call();
    return approvalAddress.toLowerCase() === allowanceAddress?.toLowerCase();
  } catch (ex) {
    console.error(ex);
    return false;
  }
};

export const getAllowance = async (
  web3: Web3,
  token: Token,
  account: string,
  otherAddress: string,
): Promise<string> => {
  try {
    const tokenContract = getTokenContract(web3, token.address);
    const allowance = await tokenContract.methods
      .allowance(account, otherAddress)
      .call();
    return new BigNumber(allowance)
      .div(10 ** token.decimals)
      .toFixed(token.decimals);
  } catch (ex) {
    console.error(ex);
    return '0';
  }
};

export const getSwapAllowance = async (
  web3: Web3,
  token: Token,
  account: string,
  chainId: number,
): Promise<string> => {
  try {
    const tokenContract = getTokenContract(web3, token.address);
    const allowance = await tokenContract.methods
      .allowance(account, ROUTER_ADDRESS[chainId])
      .call();
    return new BigNumber(allowance)
      .div(10 ** token.decimals)
      .toFixed(token.decimals);
  } catch (ex) {
    console.error(ex);
    return '0';
  }
};

export const getMultiSwapAllowance = async (
  web3: Web3,
  token: Token,
  account: string,
  chainId: number,
): Promise<string> => {
  try {
    const tokenContract = getTokenContract(web3, token.address);
    const allowance = await tokenContract.methods
      .allowance(account, MULTISWAP_ADDRESS[chainId])
      .call();
    return new BigNumber(allowance)
      .div(10 ** token.decimals)
      .toFixed(token.decimals);
  } catch (ex) {
    console.error(ex);
    return '0';
  }
};
