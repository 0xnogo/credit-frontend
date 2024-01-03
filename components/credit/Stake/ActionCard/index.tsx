import { XCaliButton } from '@components/componentLibrary/Button/XCaliButton';
import Card from '@components/componentLibrary/Card';
import HorizontalInfo from '@components/componentLibrary/Info/HorizontalInfo';
import VerticalInfo from '@components/componentLibrary/Info/VerticalInfo';
import { useClaimableRewards } from '@functions/stake/claimableRewards';
import { useEpochData } from '@functions/stake/currentEpochData';
import { Box, Divider } from '@mui/material';
import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';
import RewardTokens from './Common/RewardTokens';
import StakeCard from './Actions/Stake';
import { useClaimStakeRewardsDispatch } from 'hooks/stake/transactions/claimRewards/useClaimTransactions';
import UnstakeCard from './Actions/Unstake';
import { compactCurrency } from '@utils/index';

export default function ActionCard() {
  const { data, mutate: mutateEpochData } = useEpochData('global');

  const { data: userRewards, mutate } = useClaimableRewards();

  const claimEnabled = userRewards && userRewards?.length > 0;

  const [isStakeModalOpen, setStakeModalOpen] = useState(false);
  const [isUnstakeModalOpen, setUnstakeModalOpen] = useState(false);

  const usdcAmount = useMemo(() => {
    if (!userRewards) return '0';
    return compactCurrency(
      userRewards.reduce(
        (prev, curr) => prev.plus(curr.usdAmount),
        new BigNumber(0),
      ),
    );
  }, [userRewards]);

  const rewardDispatch = useClaimStakeRewardsDispatch((err) => {
    if (!err) {
      mutateEpochData();
      mutate();
    }
  });

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
        value={`${data ? data.userAllocation.div(Math.pow(10, 18)) : 0}`}
      />
      <HorizontalInfo header={'Claimable Rewards'} value={`$${usdcAmount}`} />
      <HorizontalInfo
        header={'Total Share'}
        value={`${
          data
            ? data.totalAllocation.gt(0)
              ? data.userAllocation.div(data.totalAllocation).times(100)
              : 0
            : 0
        }%`}
      />

      <Divider />

      <VerticalInfo
        header="Claimable Rewards Breakdown"
        value={<RewardTokens />}
      />

      <Box display="flex" flexDirection="column" rowGap="12px">
        {claimEnabled && (
          <XCaliButton
            Component={'claim'}
            variant="blue"
            type="filled"
            onClickFn={rewardDispatch}
          />
        )}
        <Box display="flex" flexDirection={'row'} gap="12px">
          <XCaliButton
            Component={'stake'}
            variant="blue"
            type="filled"
            onClickFn={() => setStakeModalOpen(true)}
          />
          <XCaliButton
            onClickFn={() => setUnstakeModalOpen(true)}
            Component={'unstake'}
            variant="pink"
            type="filled"
          />
        </Box>
      </Box>
      <>
        <StakeCard
          modalOpen={isStakeModalOpen}
          handleCloseModal={() => setStakeModalOpen(false)}
        />
        <UnstakeCard
          modalOpen={isUnstakeModalOpen}
          handleCloseModal={() => setUnstakeModalOpen(false)}
        />
      </>
    </Card>
  );
}
