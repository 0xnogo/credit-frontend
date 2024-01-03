import { useEpochData } from './currentEpochData';
import BigNumber from 'bignumber.js';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import useSWR from 'swr';
import { useMultiCall } from 'hooks/useMulticall';
import { assetSWRConfig } from '@constants/swr';
import {
  getAuctionClaimerContract,
  getCreditStakingContract,
} from '@constants/contracts';
import { multicallSplitOnOverflow } from '@/lib/multicall/helpers';
import Multicall from '@/lib/multicall';
import { useTokenInfoWithPrice } from 'hooks/useTokenPrices';
import { useTokenMapping } from 'hooks/useTokenMapping';
import { CREDIT_TOKEN_ADDRESS } from '@constants/contracts/addresses';
import { Token } from 'types/assets';

export interface ProofInfo {
  proof: string[];
  rewardAmount: string;
}

export interface GenesisStakingInfo {
  withdrawnAmount: BigNumber;
  unlockProgress: BigNumber;
  claimedAmount: BigNumber;
  cliffDurationMonths: BigNumber;
  vestingPeriodMonths: BigNumber;
  releasableAmount: BigNumber;
  hasVestingEnded: boolean;
  hasStaked: boolean;
  amountLocked: BigNumber;
  genesisxCreditStaked: BigNumber;
  rewardsAmts: {
    usdAmount: BigNumber;
    dividendAmount: string;
    symbol: string;
    logoURI: string | undefined;
    token: Token;
  }[];
  islockingDecisionCutOffOver: boolean;
  totalUsdRewards: BigNumber;
  canLockLaunchShare: boolean;
  hasClaimedLaunchShare: boolean;
  canUnlockLaunchShare: boolean;
  userRewardInfo: ProofInfo | undefined;
  vestStartTimestamp: number;
}

export const defaultGenesisStakingObject: GenesisStakingInfo = {
  withdrawnAmount: new BigNumber(0),
  unlockProgress: new BigNumber(0),
  claimedAmount: new BigNumber(0),
  cliffDurationMonths: new BigNumber(0),
  vestingPeriodMonths: new BigNumber(0),
  releasableAmount: new BigNumber(0),
  hasVestingEnded: true,
  hasStaked: false,
  amountLocked: new BigNumber(0),
  genesisxCreditStaked: new BigNumber(0),
  rewardsAmts: [],
  islockingDecisionCutOffOver: true,
  totalUsdRewards: new BigNumber(0),
  canLockLaunchShare: false,
  canUnlockLaunchShare: false,
  hasClaimedLaunchShare: false,
  userRewardInfo: undefined,
  vestStartTimestamp: 0,
};

const ONE_MONTH_SECONDS = 2629746;

export function useGenesisStakingInfo() {
  const { chainId, account, web3 } = useActiveWeb3React();

  const { data } = useEpochData('global');

  const multicall = useMultiCall();

  const { data: tokenMapping = {} } = useTokenMapping();

  return useSWR<GenesisStakingInfo>(
    account && chainId && web3 && multicall && data && tokenMapping
      ? ['genesis-staking-info', chainId, account, data, tokenMapping]
      : null,
    async () => {
      try {
        let proofData: ProofInfo | undefined = undefined;
        try {
          const response = await fetch(
            `/api/auction/rewards?address=${account}`,
          );
          const result = await response.json();
          proofData = {
            proof: result.proof as string[],
            rewardAmount: result.rewardData[1] as string,
          };
        } catch (error) {
          console.log(error);
        }

        const auctionStakeContract = getAuctionClaimerContract(web3, chainId);
        const creditStakingContract = getCreditStakingContract(web3, chainId);

        const [
          info,
          standardVestingEnd,
          reducedVestingEnd,
          reducedCliffDuration,
          standardCliffDuration,
          totalLaunchShareLocked,
          rewardTokens,
          lockingDecisionCutOff,
          unstakedReducedCliffAmount,
          vestingStart,
        ]: any[] = await multicallSplitOnOverflow(
          [
            auctionStakeContract.methods.info(account as string),
            auctionStakeContract.methods.standardVestingEnd(),
            auctionStakeContract.methods.reducedVestingEnd(),
            auctionStakeContract.methods.reducedCliffDuration(),
            auctionStakeContract.methods.standardCliffDuration(),
            auctionStakeContract.methods.totalLaunchShareLocked(),
            creditStakingContract.methods.distributedTokens(),
            auctionStakeContract.methods.lockingDecisionCutOff(),
            auctionStakeContract.methods.unstakedReducedCliffAmount(),
            auctionStakeContract.methods.vestingStart(),
          ],
          multicall as Multicall,
        );

        const genesisxCreditStaked = new BigNumber(totalLaunchShareLocked).div(
          Math.pow(10, 18),
        );

        const proof: any[] = proofData?.proof ?? [];

        const vestStartTimestamp = new BigNumber(vestingStart);
        const vestingEnd = new BigNumber(
          info[3] !== '0' ? reducedVestingEnd : standardVestingEnd,
        );
        const cliffDuration = new BigNumber(
          info[3] !== '0' ? reducedCliffDuration : standardCliffDuration,
        );
        const hasClaimedLaunchShare = info[0];

        const currentTimestamp = new BigNumber(Date.now() / 1000);
        const islockingDecisionCutOffOver = currentTimestamp.gte(
          lockingDecisionCutOff,
        );
        const canLockLaunchShare =
          new BigNumber(info[3]).eq(0) && !islockingDecisionCutOffOver;

        const claimedAmount = new BigNumber(info[1]);
        const amountLocked = new BigNumber(info[2]);
        const canUnlockLaunchShare =
          amountLocked.gt(0) && unstakedReducedCliffAmount;

        const cliffDurationMonths = cliffDuration.div(ONE_MONTH_SECONDS);
        const vestingPeriodMonths = new BigNumber(vestingEnd)
          .plus(cliffDuration)
          .minus(vestStartTimestamp)
          .div(ONE_MONTH_SECONDS);

        const hasVestingStarted = currentTimestamp.gte(
          vestStartTimestamp.plus(cliffDuration),
        );
        const hasVestingEnded = currentTimestamp.gte(vestingEnd);

        const hasStaked = info[3] !== '0';

        let releasableAmount = new BigNumber(0);
        try {
          releasableAmount = new BigNumber(
            await auctionStakeContract.methods
              .getReleasableAmount(
                new BigNumber(info[2]).times(2).toString(),
                account as string,
                proof,
              )
              .call(),
          ).div(Math.pow(10, 18));
        } catch (error) {}
        const withdrawnAmount = new BigNumber(info[1]).div(Math.pow(10, 18));

        const unlockProgress = hasVestingStarted
          ? currentTimestamp
              .minus(vestStartTimestamp.plus(cliffDuration))
              .div(currentTimestamp)
              .times(100)
          : new BigNumber(0);
        const creditToken = tokenMapping[CREDIT_TOKEN_ADDRESS[chainId]];
        const rewardsAmts = [
          {
            usdAmount: releasableAmount.times(
              new BigNumber(creditToken?.price ?? 0),
            ),
            dividendAmount: releasableAmount.toString(),
            symbol: creditToken.symbol,
            logoURI: creditToken?.logoURI,
            token: creditToken,
          },
        ];

        const totalUsdRewards = rewardsAmts.reduce(
          (prev, curr) => prev.plus(curr.usdAmount),
          new BigNumber(0),
        );

        return {
          withdrawnAmount,
          unlockProgress,
          claimedAmount,
          cliffDurationMonths,
          vestingPeriodMonths,
          releasableAmount,
          hasVestingEnded,
          hasStaked,
          amountLocked,
          genesisxCreditStaked,
          rewardsAmts,
          islockingDecisionCutOffOver: currentTimestamp.gte(
            lockingDecisionCutOff,
          ),
          totalUsdRewards,
          canLockLaunchShare,
          canUnlockLaunchShare,
          hasClaimedLaunchShare,
          userRewardInfo: proofData,
          vestStartTimestamp: Number(vestStartTimestamp),
        };
      } catch (error) {
        console.log(error);
        return defaultGenesisStakingObject;
      }
    },
    assetSWRConfig,
  );
}
