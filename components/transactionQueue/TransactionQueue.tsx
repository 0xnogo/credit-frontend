import React from 'react';
import { Box, Divider } from '@mui/material';
import Transaction from './TransactionItem';
import { useCurrentTransactions } from '../../hooks/useCurrentTransactions';

export const txColors = {
  liquidity: '#36252F',
  lend: '#253A3A ',
  borrow: '#383121',
  error: '#4d0219',
};

export const txTextColors = {
  liquidity: '#FFBDE7',
  lend: '#98FFFF',
  borrow: '#FFBD13',
  error: 'red',
};

export function TransactionQueue({
  type,
  nextTx,
  isFailed,
}: {
  type: 'lend' | 'liquidity' | 'borrow';
  nextTx: number;
  isFailed: boolean;
}) {
  const {
    transactionInfo: { transactions },
  } = useCurrentTransactions();

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      gap="5px"
      position="relative"
    >
      {transactions.map((tx, idx) => {
        const isCompleted = tx.status === 'DONE';
        return (
          <>
            <Transaction
              nextTx={nextTx}
              index={idx}
              type={type}
              transaction={tx}
              key={`${idx}-tx`}
              isFailed={isFailed}
            />
            {idx !== transactions.length - 1 && (
              <Divider
                key={`${idx}-divider`}
                color={
                  nextTx === idx && isFailed
                    ? txColors['error']
                    : isCompleted
                    ? txColors[type]
                    : 'transparent'
                }
                orientation="horizontal"
                sx={{ width: '0.2', height: '0px' }}
              />
            )}
          </>
        );
      })}
    </Box>
  );
}
