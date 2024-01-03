import { Box } from '@mui/material';
import { ReactNode } from 'react';

type HorizontalStackedButtonsProps = {
  button1: ReactNode;
  button2: ReactNode;
};

export function HorizontalStackedButtons({
  button1,
  button2,
}: HorizontalStackedButtonsProps) {
  return (
    <Box display="flex" gap="8px">
      <Box flex="1">{button1}</Box>
      <Box flex="1">{button2}</Box>
    </Box>
  );
}
