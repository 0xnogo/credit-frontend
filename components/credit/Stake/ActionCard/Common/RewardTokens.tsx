import MultiCoinBalance from '@components/componentLibrary/MultiCoinBalances';
import { useClaimableRewards } from '@functions/stake/claimableRewards';
import {
  defaultGenesisStakingObject,
  useGenesisStakingInfo,
} from '@functions/stake/genesisStakeInfo';
import { Box } from '@mui/material';
import BigNumber from 'bignumber.js';

interface RewardTokenProps {
  type?: 'stake' | 'genesis';
}

export default function RewardTokens({ type = 'stake' }: RewardTokenProps) {
  const { data: userRewards = [] } = useClaimableRewards();
  const { data: genesisRewards = defaultGenesisStakingObject } =
    useGenesisStakingInfo();

  let arrayToUse = type === 'stake' ? userRewards : genesisRewards.rewardsAmts;

  return (
    <Box display="flex" flexDirection="row" flexWrap="wrap" gap="5px">
      <MultiCoinBalance
        tokens={arrayToUse.map((item) => item.token)}
        values={arrayToUse.map((item) => new BigNumber(item.dividendAmount))}
        showUSD={true}
      />
    </Box>
  );
}
