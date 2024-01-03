import { XCaliButton } from '@components/componentLibrary/Button/XCaliButton';
import Card from '@components/componentLibrary/Card';
import HorizontalInfo from '@components/componentLibrary/Info/HorizontalInfo';
import VerticalInfo from '@components/componentLibrary/Info/VerticalInfo';
import { Box, Divider } from '@mui/material';
import { useState } from 'react';
import RewardTokens from './Common/RewardTokens';
import {
  defaultGenesisStakingObject,
  useGenesisStakingInfo,
} from '@functions/stake/genesisStakeInfo';
import BigNumber from 'bignumber.js';
import GenesisStakeCard from './Actions/GenesisStake';
import { useClaimVestTransactionDispatch } from 'hooks/stake/genesisTransactions/claimVest/useClaimVestTransactions';
import { useClaimgGenesisStakingRewardsDispatch } from 'hooks/stake/genesisTransactions/claimGenesisStakingRewards/useClaimTransactions';

export default function GenesisActionCard() {
  const { data = defaultGenesisStakingObject, mutate } =
    useGenesisStakingInfo();
  const vestEnabled = data && data.releasableAmount.gt(0);

  const userProof = data.userRewardInfo?.proof ?? [];

  const hasUserParticipated = userProof.length > 0;
  const canStake = data.canLockLaunchShare && hasUserParticipated;

  const [isStakeModalOpen, setStakeModalOpen] = useState(false);

  const depositCallback = (err: any) => {
    if (!err) {
      mutate();
    }
  };

  const rewardDispatch = useClaimVestTransactionDispatch(
    new BigNumber(0),
    depositCallback,
    userProof,
  );

  const unstakeDisptach = useClaimgGenesisStakingRewardsDispatch(
    depositCallback,
    userProof,
    new BigNumber(0),
  );

  return (
    <Card
      header="Your Share"
      fontSize="l"
      sx={{
        width: '320px',
        maxWidth: '100%',
        margin: '0 auto',
        height: 'max-content',
      }}
    >
      <HorizontalInfo
        header={'Staked Position'}
        value={`${data ? data.amountLocked.div(Math.pow(10, 18)) : 0}`}
      />
      <HorizontalInfo
        header={'Claimable Rewards'}
        value={`$${data.totalUsdRewards}`}
      />
      <HorizontalInfo
        header={'Total Share'}
        value={`${
          data
            ? data.genesisxCreditStaked.plus(data.amountLocked).gt(0)
              ? data.amountLocked
                  .div(data.genesisxCreditStaked.plus(data.amountLocked))
                  .times(100)
              : 0
            : 0
        }%`}
      />

      <Divider />

      <VerticalInfo
        header="Claimable Rewards Breakdown"
        value={<RewardTokens type="genesis" />}
      />

      <Box display="flex" flexDirection="column" rowGap="12px">
        {vestEnabled && (
          <XCaliButton
            Component={'claim'}
            variant="blue"
            type="filled"
            onClickFn={rewardDispatch}
          />
        )}
        {canStake ? (
          <Box display="flex" flexDirection={'row'} gap="12px">
            <XCaliButton
              Component={'stake'}
              variant="blue"
              type="filled"
              onClickFn={() => setStakeModalOpen(true)}
            />
          </Box>
        ) : (
          data.canUnlockLaunchShare &&
          hasUserParticipated && (
            <XCaliButton
              onClickFn={unstakeDisptach}
              Component={'unstake'}
              variant="pink"
              type="filled"
            />
          )
        )}
      </Box>
      <>
        <GenesisStakeCard
          modalOpen={isStakeModalOpen}
          handleCloseModal={() => setStakeModalOpen(false)}
          assetOut={new BigNumber(0)}
        />
      </>
    </Card>
  );
}
