import Card from '@components/componentLibrary/Card';
import { Box, Typography } from '@mui/material';
import { compactCurrency, formatCurrency } from '@utils/index';
import { useEpochData } from '@functions/stake/currentEpochData';
import { useTokenMapping } from 'hooks/useTokenMapping';
import CreditMetric from '@components/componentLibrary/CreditMetric';
import { useHistoricalEpochData } from '@functions/stake/historicalEpochData';
import {
  CustomSelect,
  StyledOption,
} from '@components/componentLibrary/XCaliSelect';
import { useState } from 'react';
import BigNumber from 'bignumber.js';

const fontColors = ['#98FFFF', '#FFBD13', '#FFBDE7'];
const backgroundColors = ['#253A3A', '#383121', '#36252F'];

export default function CurrentEpoch() {
  const { data } = useEpochData('global');

  const { data: tokenMapping = {} } = useTokenMapping();

  const { data: historicalEpochData = [] } = useHistoricalEpochData();

  const [selectedEpochIndex, setSelectedEpochIndex] = useState(0);

  const selectedEpoch = historicalEpochData?.[selectedEpochIndex] ?? {
    id: 0,
    currentCycleRewards: new BigNumber(0),
    period: '0',
    rewardDistribution: [],
  };

  return (
    <Card header="" fontSize="l" sx={{ width: '100%' }}>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="12px"
      >
        <Typography variant="title-small-semibold">Current Epoch</Typography>
        <Box>
          <CustomSelect value={selectedEpochIndex} style={{ width: '151px' }}>
            {historicalEpochData.map((_, index) => (
              <StyledOption
                key={index}
                value={index}
                onClick={() => setSelectedEpochIndex(index)}
              >
                {`Epoch ${historicalEpochData.length - index}`}
              </StyledOption>
            ))}
          </CustomSelect>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        maxWidth="100%"
        flexWrap={'wrap'}
        gap="24px"
      >
        <CreditMetric
          title="Distributed Rewards"
          data={`$${compactCurrency(selectedEpoch.currentCycleRewards)}`}
          color="#8D8D8D"
        />
        <CreditMetric
          title="Period"
          data={`${formatCurrency(selectedEpoch.period)} days`}
          color="#8D8D8D"
          underlined={false}
        />
        <CreditMetric
          title="Countdown"
          data="0"
          color="#8D8D8D"
          underlined={false}
        />
      </Box>
      <Box display="flex" flexDirection="row" width="100%" marginTop="12px">
        {selectedEpoch?.rewardDistribution?.length ? (
          selectedEpoch.rewardDistribution.map(
            ({ usdValue, rewardAmt }, index) => (
              <Typography
                key={index}
                width={`${100 / selectedEpoch.rewardDistribution.length}%`}
                color={fontColors[index]}
                sx={{ background: backgroundColors[index], padding: '6px' }}
                variant="body-small-regular"
                fontWeight={700}
                height={38}
                display="flex"
                alignItems="center"
              >
                {`${compactCurrency(new BigNumber(rewardAmt))} ${tokenMapping[
                  data?.dividendsInfo[index].token as string
                ]?.symbol} (${formatCurrency(
                  usdValue.div(selectedEpoch.currentCycleRewards).toNumber() *
                    100,
                )}%)`}
              </Typography>
            ),
          )
        ) : (
          <Typography
            width={`${100}%`}
            color={fontColors[0]}
            sx={{ background: backgroundColors[0], padding: '6px' }}
            variant="body-small-regular"
            fontWeight={700}
            display="flex"
            alignItems="center"
          >
            {`${formatCurrency(0)} ETH (0%)`}
          </Typography>
        )}
      </Box>
    </Card>
  );
}
