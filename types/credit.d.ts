import { LPFarming } from '@functions/credit/formatAPRData';
import { FarmPositions } from '@functions/liquidity/farming/positions';
import BigNumber from 'bignumber.js';
import { CreditPosition } from 'functions/credit/creditPositions';
import { Token } from './assets';

export interface UserTransaction{
    date:number;
    type:string;
    assetValue:BigNumber;
    assetAmount:BigNumber;
    collateralValue:BigNumber;
    collateralAmount:BigNumber;
    maxAPR:BigNumber;
    maker:string;
    transactionHash:string 
}

export type CreditPair = {
  address: string;
  asset: Token;
  collateral: Token;
  bestAPR?: BigNumber;
  totalLiquidity?: BigNumber;
  pools: CreditPool[];
  fee: BigNumber;
  protocolFee: BigNumber;
  stakingFee: BigNumber;
};

// export type Token = {
//   address: string;
//   symbol: string;
//   name: string;
//   decimals: number;
//   logoURI?: string;
// };

export type CreditedPool = {
  loanInterestBalance: BigNumber;
  loanPrincipalBalance: BigNumber;
  coverageInterestBalance: BigNumber;
  coveragePrincipalBalance: BigNumber;
  position: CreditPosition;
};

export interface CreditPool {
  id?: string;
  X: BigNumber;
  Y: BigNumber;
  Z: BigNumber;
  assetReserve?: BigNumber;
  collateralReserve?: BigNumber;
  loanInterestBalance?: BigNumber;
  loanPrincipalBalance?: BigNumber;
  coverageInterestBalance?: BigNumber;
  coveragePrincipalBalance?: BigNumber;
  dues?: Due[];
  lps?: Lp[];
  creditedPools?: CreditedPool[];
  collateralFactor?: BigNumber;
  minCDP?: BigNumber;
  maxAPR?: BigNumber;
  maturity: number;
  matured?: boolean;
  maturationPercentage?: number;
  position?: CreditPosition;
  index?: number;
  pair: {
    address: string;
    name: string;
    fee: BigNumber;
    protocolFee: BigNumber;
    asset: Token;
    collateral: Token;
  };
  farm?: LPFarming;
  totalSupply?: BigNumber;
  feeStored?: BigNumber;
  dateCreated: number;
  utilRate: number;
  assetReserveUSD: BigNumber;
  collateralReserveUSD: BigNumber;
  totalFee: BigNumber;
  totalDebt: BigNumber;
  debtRatio: BigNumber;
  totalFeeUSD: BigNumber;
  totalBorrowedUSD: BigNumber;
  totalRepayedUSD: BigNumber;
  totalDebtUSD: BigNumber;
  creditPositions?: Array;
}

export type Position = {
  maxAPR: BigNumber;
  liquidityBalance?: BigNumber;
  loanInterestBalance?: BigNumber;
  loanPrincipalBalance?: BigNumber;
  coverageInterestBalance?: BigNumber;
  coveragePrincipalBalance?: BigNumber;
  lockedDebtBalance?: BigNumber;
  maturation;
  matured;
  maturity;
  asset;
};

export type Lp = {
  balance: BigNumber;
  positionId: number;
  position: CreditPosition;
  farmPosition?: FarmPositions[keyof FarmPositions];
};
export type Due = {
  debt: BigNumber;
  collateral: BigNumber;
  positionId?: number;
  position?: CreditPosition;
};

export type CreditProduct = 'lend' | 'borrow' | 'repay' | 'claim';

export type CreditState = {
  pair?: CreditPair;
  subPool?: number;
  maturity?: number;
  product: Product;
  status: string;
  selectedDue?: Due;
};

export type CP = {
  x: BigNumber;
  y: BigNumber;
  z: BigNumber;
};

export interface Claims {
  loanPrincipal: BigNumber;
  loanInterest: BigNumber;
  coveragePrincipal: BigNumber;
  coverageInterest: BigNumber;
}

export enum TokenType {
  BOND_PRINCIPAL,
  BOND_INTEREST,
  INSURANCE_PRINCIPAL,
  INSURANCE_INTEREST,
  LIQUIDITY,
  COLLATERAL_DEBT,
}

export type CreditToken = {
  assetContract: string;
  tokenId: string;
  totalAmount: number;
  tokenType: TokenType;
  test?: string;
};

export type UserInfo = {
  creditPositionIds: number[]; // The ids of the credit position
  amount: BigNumber; // How many LP tokens the user has provided
  rewardDebt: BigNumber; // The amount of CREDIT entitled to the user
};

export type PoolInfo = {
  allocPoint: BigNumber; // How many allocation points assigned to this pool. CREDIT to distribute per block
  lastRewardTime: BigNumber; // Last block number that CREDIT distribution occurs
  accCreditPerShare: BigNumber; // Accumulated CREDIT per share, times 1e12
  maturity: number; // The maturity of the pool
  lpSupply: BigNumber; // The total amount of LP tokens farmed
};

export const DYEAR = 31556926;
