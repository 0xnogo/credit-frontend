import { CancelOutlined, Clear } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { XCaliButton } from '../Button/XCaliButton';
import React, { ReactNode } from 'react';

const textSizing = {
  s: '8px',
  m: '16px',
  l: '24px',
};

type CardProps = {
  fontSize?: 's' | 'm' | 'l';
  onClose?: (params?: any) => void;
  header?: string;
  children: ReactNode | JSX.Element;
  width?: string;
  maxHeight?: string;
  sx?: Record<string, any>;
};

export default function Card({
  fontSize = 'm',
  onClose,
  header = undefined,
  children,
  width = '100%',
  maxHeight,
  sx = {},
}: CardProps) {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      flexDirection="column"
      padding="24px"
      rowGap="24px"
      position="relative"
      maxWidth="100%"
      sx={{
        background: theme.palette.neutrals[80],
        borderRadius: '12px',
        color: 'white',
        ...sx,
      }}
      width={width}
      maxHeight={maxHeight ?? 'auto'}
    >
      {header && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            fontSize={textSizing[fontSize]}
            fontWeight="800"
            color="white"
          >
            {header}
          </Typography>
          {onClose && (
            <XCaliButton
              variant="ghost"
              Component={<Clear sx={{ color: 'white' }} />}
              onClickFn={onClose}
              padding="0"
            ></XCaliButton>
          )}
        </Box>
      )}
      {children}
    </Box>
  );
}
