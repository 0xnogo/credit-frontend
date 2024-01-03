import { Box, Typography } from '@mui/material';
import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { BigNumber } from 'bignumber.js';
import { CreditPool } from 'types/credit';
import { formatToDays } from '@utils/index';

const StyledBox = styled(Box)({
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  padding: '12px',
  gap: '8px',
});

const StyledItem = styled(Typography)({
  display: 'flex',
  padding: '4px 8px',
  gap: '8px',
  alignItems: 'center',

  borderRadius: '8px',
  fontSize: '11px',
});

interface CardTopSectionProps {
  pools?: number;
  maturity: number[];
  isActive: boolean;
}

export default function CardTopSection({
  pools,
  maturity,
  isActive,
}: CardTopSectionProps) {
  const theme = useTheme();
  return (
    <StyledBox
      sx={{
        background: theme.palette.neutrals[60],
      }}
    >
      <StyledItem
        variant="body-small-numeric"
        sx={{
          background: theme.palette.neutrals[40],
          color: theme.palette.neutrals.white,
        }}
      >{`${pools} ${pools ? `POOLS` : `POOL`}`}</StyledItem>
      {isActive ? (
        <StyledItem
          variant="body-small-numeric"
          sx={{
            background: theme.palette.neutrals[40],
            color: theme.palette.neutrals.white,
          }}
        >
          <AccessTimeIcon fontSize="inherit" />
          {`${formatToDays(maturity)}`}
        </StyledItem>
      ) : (
        <></>
      )}
    </StyledBox>
  );
}
