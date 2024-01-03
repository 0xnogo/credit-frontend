import { Box, Typography, useTheme } from '@mui/material';
import { compactCurrency, formatCurrency } from 'utils/index';
import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import { useETHPrice } from 'hooks/useETHPrice';
import { TypographyPropsVariantOverrides } from '@mui/material/Typography/Typography';
import { Variant } from '@mui/material/styles/createTypography';
import { OverridableStringUnion } from '@mui/types';
import CurrencyLogo from './Logo/CurrencyLogo';

interface XCaliAddIconProps {
  token: Token;
  value: BigNumber;
  showUSD?: boolean;
  variant?: OverridableStringUnion<
    'inherit' | Variant,
    TypographyPropsVariantOverrides
  >;
  showLogo?: boolean;
}

export default function CoinBalance({
  token,
  value,
  showUSD = false,
  variant = 'body-moderate-numeric',
  showLogo = true,
}: XCaliAddIconProps) {
  const theme = useTheme();

  const { data: ethPrice = new BigNumber(0) } = useETHPrice();

  return (
    <Box display="flex" alignItems="center" gap="6px">
      {showLogo && <CurrencyLogo token={token} size={20} />}
      <Typography color={'white'} variant={variant}>
        {`${compactCurrency(value)} ${token?.symbol}`}
      </Typography>
      {showUSD && value && value.gt(0) && token ? (
        <Typography color={theme.palette.neutrals[15]} variant={variant}>
          {`($${compactCurrency(
            value.times(ethPrice).times(token.derivedETH),
          )})`}
        </Typography>
      ) : (
        <></>
      )}
    </Box>
  );
}
