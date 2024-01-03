import {
  AUCTION_CLAIM_ADDRESS,
  CONVENIENCE_ADDRESS,
  CREDIT_POSITION_ADDRESS,
  CREDIT_STAKING_ADDRESS,
  LP_FARMING_ADDRESS,
  AUCTION_ADDRESS,
  AUCTION_REFERRAL_ADDRESS,
  DEPOSIT_AND_PLACE_ORDER_ADDRESS,
  FAUCET_ADDRESS,
} from './addresses';
import CONVENIENCE_ABI from './ABIs/creditRouter.json';
import CONVENIENCE_WL_ABI from './ABIs/creditRouterWL.json';
import ERC_20_ABI from './ABIs/erc20.json';
import COLLATERALIZED_DEBT_ABI from 'constants/contracts/ABIs/lockedDebt.json';
import CREDIT_PAIR_ABI from './ABIs/creditPair.json';
import MULTICALL_ABI from './ABIs/multicall.json';
import CREDIT_POSITION_ABI from './ABIs/creditPosition.json';
import LP_FARMING_ABI from './ABIs/lpFarming.json';
import CREDIT_STAKING_ABI from './ABIs/creditStaking.json';
import AUCTION_CLAIMER_ABI from './ABIs/auctionClaimer.json';
import AUCTION_ABI from './ABIs/auction.json';
import AUCTION_REFERRAL_ABI from './ABIs/referralRewardManager.json';
import DEPOSIT_ORDER_ABI from './ABIs/depositAndPlaceOrder.json';
import FAUCET_ABI from './ABIs/testnetFaucet.json';
import Web3 from 'web3';
import {
  AuctionClaimer,
  LockedDebt,
  CreditRouter,
  CreditPair,
  CreditPosition,
  CreditStaking,
  Erc20,
  LpFarming,
  Multicall,
  Auction,
  ReferralRewardManager,
  DepositAndPlaceOrder,
  Faucet,
} from 'types/web3Typings';
import { ENABLE_WHITELIST } from '..';

export const getConvenienceContract = (
  web3: Web3,
  chainId: number,
): CreditRouter =>
  new web3.eth.Contract(
    ENABLE_WHITELIST?CONVENIENCE_WL_ABI as any[]: CONVENIENCE_ABI as any[],
    CONVENIENCE_ADDRESS[chainId],
  ) as any;

export const getTokenContract = (web3: Web3, address: string): Erc20 => {
  return new web3.eth.Contract(ERC_20_ABI as any[], address) as any;
};

export const getCDContract = (web3: Web3, address: string): LockedDebt =>
  new web3.eth.Contract(COLLATERALIZED_DEBT_ABI as any[], address) as any;

export const getCreditPairContract = (
  web3: Web3,
  address: string,
): CreditPair =>
  new web3.eth.Contract(CREDIT_PAIR_ABI as any[], address) as any;

export const getMulticallContract = (web3: Web3, address: string): Multicall =>
  new web3.eth.Contract(MULTICALL_ABI as any[], address) as any;

export const getCreditPositionContract = (
  web3: Web3,
  chainId: number,
): CreditPosition =>
  new web3.eth.Contract(
    CREDIT_POSITION_ABI as any[],
    CREDIT_POSITION_ADDRESS[chainId],
  ) as any;

export const getLPFarmingContract = (web3: Web3, chainId: number): LpFarming =>
  new web3.eth.Contract(
    LP_FARMING_ABI as any[],
    LP_FARMING_ADDRESS[chainId],
  ) as any;

export const getCreditStakingContract = (
  web3: Web3,
  chainId: number,
): CreditStaking =>
  new web3.eth.Contract(
    CREDIT_STAKING_ABI as any[],
    CREDIT_STAKING_ADDRESS[chainId],
  ) as any;

export const getAuctionClaimerContract = (
  web3: Web3,
  chainId: number,
): AuctionClaimer =>
  new web3.eth.Contract(
    AUCTION_CLAIMER_ABI as any[],
    AUCTION_CLAIM_ADDRESS[chainId],
  ) as any;

export const getAuctionContract = (web3: Web3, chainId: number): Auction =>
  new web3.eth.Contract(AUCTION_ABI as any[], AUCTION_ADDRESS[chainId]) as any;

export const getAuctionReferralContract = (
  web3: Web3,
  chainId: number,
): ReferralRewardManager =>
  new web3.eth.Contract(
    AUCTION_REFERRAL_ABI as any[],
    AUCTION_REFERRAL_ADDRESS[chainId],
  ) as any;

export const getAuctionDepositContract = (
  web3: Web3,
  chainId: number,
): DepositAndPlaceOrder =>
  new web3.eth.Contract(
    DEPOSIT_ORDER_ABI as any[],
    DEPOSIT_AND_PLACE_ORDER_ADDRESS[chainId],
  ) as any;

export const getFaucetContract = (web3: Web3, chainId: number): Faucet =>
  new web3.eth.Contract(FAUCET_ABI as any[], FAUCET_ADDRESS[chainId]) as any;
