import { Box, LinearProgress, useTheme } from '@mui/material';

type ProgressBarProps = {
  value: number;
};

export default function ProgressBar({ value }: ProgressBarProps) {
  const theme = useTheme();
  return (
    <Box sx={{ backgroundColor: '#1C2B39', borderRadius: '3px' }}>
      <LinearProgress
        sx={{
          ['& .MuiLinearProgress-bar1Determinate']: {
            backgroundColor: theme.palette.brand.accent.normal,
            color: 'transparent',
          },
          backgroundColor: 'transparent',
          padding: '0.1rem',
          borderRadius: '3px',
          height: '6px',
        }}
        variant="determinate"
        value={value}
      />
    </Box>
  );
}
