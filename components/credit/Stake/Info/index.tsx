import { Box } from '@mui/material';
import { compactCurrency, formatCurrency } from '@utils/index';
import Card from '@components/componentLibrary/Card';
import CurrentEpoch from './CurrentEpoch';
import { useStakingRewards } from '@functions/stake/stakingRewards';
import VestingSchedule from './VestingSchedule';
import CreditMetric from '@components/componentLibrary/CreditMetric';
import { useHistoricalEpochData } from '@functions/stake/historicalEpochData';
import BigNumber from 'bignumber.js';

export default function Info({ type }: { type: 'genesis' | 'staking' }) {
  const width = '150px';

  const rewards = useStakingRewards();

  const { data: historicalEpochData = [] } = useHistoricalEpochData();

  const totalRewardsUSD = historicalEpochData.reduce(
    (prev, curr) => prev.plus(curr.currentCycleRewards),
    new BigNumber(0),
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="start"
      position="relative"
      gap="24px"
      flex="1"
      maxWidth="100%"
      width="100%"
      minWidth="400px"
    >
      <Box
        display="flex"
        alignItems="center"
        position="relative"
        width="100%"
        gap="24px"
        flexWrap="wrap"
      >
        <Card
          sx={{
            width: { width },
            padding: '16px 16px 16px 16px',
            flex: 1,
            minWidth: '130.711px',
          }}
        >
          <CreditMetric
            title={
              type === 'genesis'
                ? 'Genesis Credit Staked'
                : 'Global Credit Staked'
            }
            data={`${compactCurrency(
              rewards.globalCreditStaked.div(Math.pow(10, 18)),
            )}`}
            color="#8D8D8D"
          />
        </Card>
        <Card
          sx={{
            width: { width },
            padding: '16px 16px 16px 16px',
            flex: 1,
            minWidth: '130.711px',
          }}
        >
          <CreditMetric
            title="xCredit APR"
            data={`${formatCurrency(rewards.xCreditAPR)}%`}
            color="#8D8D8D"
          />
        </Card>
        <Card
          sx={{
            width: { width },
            padding: '16px 16px 16px 16px',
            flex: 1,
            minWidth: '130.711px',
          }}
        >
          <CreditMetric
            title="Total Rewards"
            data={`$${compactCurrency(totalRewardsUSD)}`}
            color="#8D8D8D"
          />
        </Card>
        {type === 'genesis' && (
          <Card
            sx={{
              width: { width },
              padding: '16px 16px 16px 16px',
            }}
          >
            <CreditMetric
              title="Lock Up Period"
              data={`3 Months`}
              color="#8D8D8D"
            />
          </Card>
        )}
      </Box>
      {type === 'genesis' && <VestingSchedule />}
      <Box width="calc(100% - 48px)">
        <CurrentEpoch />
      </Box>
    </Box>
  );
}
