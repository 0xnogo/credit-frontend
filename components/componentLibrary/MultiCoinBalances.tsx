import { Box, Typography, useTheme } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import CoinBalance from './CoinBalance';
import { useMemo } from 'react';

interface MultiCoinBalancesProps {
  tokens: Token[];
  values: BigNumber[];
  showUSD?: boolean;
  andOr?: 'AND' | 'OR';
}

export default function MultiCoinBalance({
  tokens,
  values,
  showUSD = false,
  andOr = 'OR',
}: MultiCoinBalancesProps) {
  const theme = useTheme();

  const { tokensFiltered, valuesFiltered } = useMemo(() => {
    if (andOr === 'OR')
      return { tokensFiltered: tokens, valuesFiltered: values };
    let newTokensArray: Token[] = [];
    let newValuesArray: BigNumber[] = [];
    values.forEach((value, index) => {
      if (value.gt(0)) {
        newTokensArray.push(tokens[index]);
        newValuesArray.push(value);
      }
    });
    return { tokensFiltered: newTokensArray, valuesFiltered: newValuesArray };
  }, [tokens, values, andOr]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      flexWrap="wrap"
      gap="12px"
    >
      {tokensFiltered.map((token, index) => (
        <>
          <CoinBalance
            key={token.address + index}
            token={token}
            value={valuesFiltered[index]}
            showUSD={showUSD}
          />
          {index !== tokensFiltered.length - 1 && (
            <Typography
              key={token.address + 'type'}
              variant="body-small-medium"
              color={theme.palette.action.active}
            >
              {andOr}
            </Typography>
          )}
        </>
      ))}
    </Box>
  );
}
