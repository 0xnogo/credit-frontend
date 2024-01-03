import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Transaction } from 'types/transactions';
import { txColors, txTextColors } from './TransactionQueue';

export default function TransactionItem({
  transaction,
  index,
  type,
  nextTx,
  isFailed,
}: {
  transaction: Transaction;
  index: number;
  type: 'lend' | 'borrow' | 'liquidity';
  nextTx: number;
  isFailed: boolean;
}) {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="8px"
    >
      <Box
        sx={{
          border: `thin ${
            isFailed || nextTx >= index
              ? 'transparent'
              : theme.palette.neutrals[15]
          } solid`,
          borderRadius: '100%',
          width: '24px',
          height: '24px',
          background: `${
            isFailed && nextTx === index
              ? txColors['error']
              : nextTx >= index
              ? txColors[type]
              : 'transparent'
          }`,
        }}
        key={transaction.uuid}
      >
        <Typography
          color={
            isFailed && nextTx === index
              ? txTextColors['error']
              : nextTx >= index
              ? txTextColors[type]
              : 'white'
          }
          textAlign="center"
        >
          {index + 1}
        </Typography>
      </Box>
      <Typography
        variant="body-moderate-regular"
        color={
          isFailed && nextTx === index
            ? txTextColors['error']
            : nextTx >= index
            ? txTextColors[type]
            : theme.palette.neutrals[15]
        }
        textAlign="center"
        sx={{
          position: 'absolute',
          bottom: '0',
          transform: 'translateY(120%)',
          borderColor: 'unset',
        }}
      >
        {transaction.actionName}
      </Typography>
    </Box>
  );
}
