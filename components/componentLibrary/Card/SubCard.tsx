import { Box, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

type CardProps = {
  header?: string;
  children: ReactNode;
  padding?: string;
  style?: any;
  gap?: string;
};

export default function SubCard({
  header,
  children,
  padding,
  style,
  gap = '12px',
}: CardProps) {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      flexDirection="column"
      padding={padding ?? '20px'}
      gap={gap}
      sx={{
        background: theme.palette.neutrals[60],
        borderRadius: '12px',
        color: 'white',
      }}
      style={style}
    >
      {header && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="8px"
        >
          <Typography fontSize={'16px'} fontWeight="800" color="white">
            {header}
          </Typography>
        </Box>
      )}
      {children}
    </Box>
  );
}
