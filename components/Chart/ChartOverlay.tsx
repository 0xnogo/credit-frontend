import { Typography } from '@mui/material';
import { Box } from '@mui/material';

import { timeFormat } from 'd3-time-format';
import { Overlay } from './AreaChart';
import { ChangeEvent } from 'react';

const formatDate = timeFormat("%b %d, '%y");

interface ChartOverlayProps {
  overlay: Overlay;
  onTimespanChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function ChartOverlay({
  overlay,
  onTimespanChange,
}: ChartOverlayProps) {
  const { value, date } = overlay;

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        style={{ position: 'absolute', top: 0, right: 0 }}
      >
        <Box />
        <Box className="flex flex-row flex-wrap items-center">
          <Typography
            variant="body-small-regular"
            className="mr-2"
            color="white"
          >
            {value}
          </Typography>
          <Box paddingX={0.5} />

          <Typography variant="body-small-regular" color="white">
            {formatDate(new Date(Number(date) * 1e3))}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
