import { Typography, useTheme } from '@mui/material';
import { StyledBox, StyledContainer } from '@components/shared';

interface AprSectionProps {
  averageAPR: string;
  borrowAPR: string;
}

export function AprSection({ averageAPR, borrowAPR }: AprSectionProps) {
  const theme = useTheme();
  return (
    <StyledBox
      width="100%"
      padding="8px 0"
      sx={{ background: theme.palette.neutrals[80] }}
    >
      <StyledContainer width="141px">
        <Typography variant="body-small-regular" color="#8A9FB3">
          Average Yield
        </Typography>
        <Typography
          variant="title-small-numeric"
          sx={{
            paddingBottom: '4px',
            borderBottom: '1px dashed #ffffff',
            color: '#ffffff',
          }}
        >
          {averageAPR}
        </Typography>
      </StyledContainer>
      <StyledContainer width="141px">
        <Typography variant="body-small-regular" color="#8A9FB3">
          Interest Rate
        </Typography>
        <Typography
          variant="title-small-numeric"
          sx={{
            paddingBottom: '4px',
            borderBottom: '1px dashed #ffffff',
            color: '#ffffff',
          }}
        >
          {borrowAPR}
        </Typography>
      </StyledContainer>
    </StyledBox>
  );
}
