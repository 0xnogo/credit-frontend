import { Box, Typography, useTheme } from '@mui/material';
import { StyledBox } from '@components/shared';

interface PositionSectionProps {
  cdp: string;
  maturity: string;
}

export function PositionSection({ cdp, maturity }: PositionSectionProps) {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      alignItems="center"
      width="282px"
      sx={{ background: '#0F0F0F' }}
    >
      <StyledBox width="141px" height="100%">
        <Box padding="0px 16px" display="flex" flexDirection="column">
          <Typography variant="body-small-regular" color="#8A9FB3">
            CDP
          </Typography>
          <Typography
            variant="body-small-numeric"
            color={theme.palette.brand.accent.normal}
          >
            {cdp}
          </Typography>
        </Box>
      </StyledBox>
      <StyledBox
        width="141px"
        height="42px"
        sx={{ backgroundColor: '#0F0F0F' }}
      >
        <Box padding="0px 16px" display="flex" flexDirection="column">
          <Typography variant="body-small-regular" color="#8A9FB3">
            Expiry Date
          </Typography>
          <Typography variant="body-small-numeric" color="#FFFFFF">
            {maturity}
          </Typography>
        </Box>
      </StyledBox>
    </Box>
  );
}
