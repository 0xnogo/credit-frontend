import Card from '@components/componentLibrary/Card';
import { Box, Typography } from '@mui/material';
import { formatCurrency } from '@utils/index';
import {
  defaultGenesisStakingObject,
  useGenesisStakingInfo,
} from '@functions/stake/genesisStakeInfo';
import ProgressBar from '@components/componentLibrary/Progress';
import CreditMetric from '@components/componentLibrary/CreditMetric';

export default function VestingSchedule() {
  const { data = defaultGenesisStakingObject } = useGenesisStakingInfo();
  return (
    <Card
      header="Vesting Schedule"
      fontSize="l"
      sx={{ width: 'calc(100% - 48px)' }}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        maxWidth="100%"
        flexWrap={'wrap'}
        gap="24px"
      >
        <CreditMetric
          title="Releasable Amount"
          data={formatCurrency(data.releasableAmount)}
          color="#8D8D8D"
          dataSize="14px"
          underlined={false}
        />
        <CreditMetric
          title="Withdrawn"
          data={formatCurrency(data.withdrawnAmount)}
          color="#8D8D8D"
          dataSize="14px"
          underlined={false}
        />
        <CreditMetric
          title="Vesting Period"
          data={`${formatCurrency(data.vestingPeriodMonths)} Months`}
          color="#8D8D8D"
          dataSize="14px"
          underlined={false}
        />
        <CreditMetric
          title="Cliff Period"
          data={`${formatCurrency(data.cliffDurationMonths)} Months`}
          color="#8D8D8D"
          dataSize="14px"
          underlined={false}
        />
        <CreditMetric
          title="Unlock Progress"
          data={`${formatCurrency(data.unlockProgress)}%`}
          color="#8D8D8D"
          dataSize="14px"
          underlined={false}
        />
      </Box>
      <Box display="flex" flexDirection="column" gap="6px">
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body-small-regular">Vesting Start</Typography>
          <Typography variant="body-small-regular">Vesting End</Typography>
        </Box>
        <ProgressBar value={data.unlockProgress.toNumber()} />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body-small-regular" color="#8D8D8D">
            0%
          </Typography>
          <Typography variant="body-small-regular" color="#8D8D8D">
            100%
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
