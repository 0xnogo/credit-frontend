import { StyledBox } from '@components/shared';
import { Box, LinearProgress, Typography, useTheme } from '@mui/material';
import { formatCurrency } from '@utils/index';
import BigNumber from 'bignumber.js';
interface UtilizationRateProps {
  utilizationRate: number;
  tvl?: string;
}

export function UtilizationRate({
  utilizationRate,
  tvl = '$0.00',
}: UtilizationRateProps) {
  const theme = useTheme();
  return (
    <StyledBox
      flexDirection="column"
      padding="8px 10px 16px"
      gap="6px"
      width="282px"
      style={{
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '12px',
        backgroundColor: '#0F0F0F',
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body-small-regular" color="#8A9FB3">
          Utilization Rate
        </Typography>
        <Typography variant="body-small-numeric" color="#FFFFFF">
          {formatCurrency(utilizationRate)}%
        </Typography>
      </Box>

      <Box>
        <Box sx={{ backgroundColor: '#1C2B39', borderRadius: '12px' }}>
          <LinearProgress
            sx={{
              ['& .MuiLinearProgress-bar1Determinate']: {
                backgroundColor: theme.palette.brand.accent.normal,
                color: 'transparent',
              },
              backgroundColor: 'transparent',
              padding: '0.1rem',
              borderRadius: '0.2rem',
            }}
            variant="determinate"
            value={utilizationRate}
          />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Typography variant="body-small-regular" color="#8A9FB3">
          Reserves
        </Typography>
        <Typography variant="body-small-numeric" color="#FFFFFF">
          {tvl}
        </Typography>
      </Box>
    </StyledBox>
  );
}
