import BigNumber from 'bignumber.js';

export interface DividendsInfo {
  currentDistributionAmount: BigNumber;
  currentCycleDistributedAmount: BigNumber;
  pendingAmount?: BigNumber;
  distributedAmount?: BigNumber;
  accDividendsPerShare?: BigNumber;
  lastUpdateTime?: BigNumber;
  distributionDisabled?: boolean;
  token: string;
}

export interface StakingUserInfo {
  pendingDividends: BigNumber;
  rewardDebt: BigNumber;
}

export interface StakingEpoch {
  dividendsInfo: DividendsInfo[];
  userInfo: StakingUserInfo[];
  userAllocation: BigNumber;
  totalAllocation: BigNumber;
  cycleDurationSeconds: BigNumber;
  currentCycleStartTime: BigNumber;
  unstakingPenalties: BigNumber[];
}

export interface Info {
  claimedLaunchShare: boolean;
  vestingAmountClaimed: BigNumber;
  amountLocked: BigNumber;
  lockingTimestamp: BigNumber;
}
