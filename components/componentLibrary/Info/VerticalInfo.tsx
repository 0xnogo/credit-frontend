import { Box, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

type VerticalInfoProps = {
  header: ReactNode;
  value: ReactNode;
  gap?: string;
};

export default function VerticalInfo({
  header,
  value,
  gap = '12px',
}: VerticalInfoProps) {
  const theme = useTheme();
  return (
    <Box display="flex" flexDirection="column" gap={gap}>
      <Typography
        variant="body-moderate-regular"
        color={theme.palette.neutrals[15]}
      >
        {header}
      </Typography>
      <Typography
        variant="body-moderate-numeric"
        color={theme.palette.neutrals.white}
      >
        {value}
      </Typography>
    </Box>
  );
}
