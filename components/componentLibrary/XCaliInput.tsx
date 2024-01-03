import { Box, Input, Typography, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';
import { XCaliButton } from './Button/XCaliButton';
import { Token } from 'types/assets';
import BigNumber from 'bignumber.js';
import { compactCurrency, formatCurrency } from '@utils/index';
import CurrencyLogo from './Logo/CurrencyLogo';

interface InputProps {
  title?: string;
  value: string | undefined;
  setValue: any;
  token?: Token | string;
  hideBalances?: boolean;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  orientation?: 'left' | 'right';
  flexJustify?: string;
  sx?: Record<string, any>;
  fontFamily?: string;
  endAdornment?: ReactNode;
  titleEndIcon?:ReactNode;
  assetLabel?:String;
}

export default function XCaliInput({
  title,
  value,
  setValue,
  token,
  hideBalances = false,
  disabled = false,
  type = 'text',
  placeholder = '0.0',
  orientation = 'right',
  flexJustify = 'space-between',
  fontFamily = 'Retron2000',
  assetLabel = "Balance",
  endAdornment,
  titleEndIcon,
  sx = {},
}: InputProps) {
  const theme = useTheme();
  const onChangeHandler = (e: any) => {
    setValue(e.target.value);
  };

  const isTokenType = token && typeof token !== 'string';

  const usdValue = isTokenType
    ? new BigNumber(value ?? 0).times(token.price)
    : new BigNumber(0);

  const displayUSDValue = !usdValue.isNaN()
    ? formatCurrency(usdValue.toFixed())
    : '0';

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        color: '#F4F4F4',
        gap: '8px',
        width: '100%',
      }}
    >
      {title && (
        <Box display="flex" justifyContent={titleEndIcon?"space-between":"flex-start"} alignItems="center">
          <Typography
            variant="body-small-regular"
            color={theme.palette.neutrals[15]}
          >
            {title}
          </Typography>
          {titleEndIcon}
        </Box>
      )}
      <Box
        sx={{
          background: '#1D1E1F',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          gap: '8px',
          ...sx,
        }}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: flexJustify,
          }}
        >
          {token && (
            <Box
              display="flex"
              gap="6px"
              flexDirection="row"
              alignItems="center"
            >
              {typeof token === 'string' ? (
                <></>
              ) : (
                <CurrencyLogo token={token as Token} size={24} />
              )}
              <Typography variant="body-large-medium">
                {typeof token === 'string' ? token : token?.symbol}
              </Typography>
            </Box>
          )}
          <Input
            disabled={disabled}
            disableUnderline
            placeholder={placeholder}
            sx={{
              width: '100%',
              fontFamily: fontFamily,
              '& input[type=number]::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
            }}
            value={value === undefined ? '' : value}
            onChange={onChangeHandler}
            inputProps={{
              style: {
                textAlign: orientation,
                color: theme.palette.neutrals.white,
              },
            }}
            endAdornment={endAdornment}
            type={type}
          />
        </Box>
        {!hideBalances &&
          typeof token != 'string' &&
          typeof token != 'undefined' && (
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box display="flex" alignItems="center" gap="8px">
                <Typography
                  variant="body-small-regular"
                  color={theme.palette.neutrals.white}
                >
                  {assetLabel}:{' '}
                  {compactCurrency(new BigNumber(token?.balance ?? '0'))}
                </Typography>
                <XCaliButton
                  variant="ghost"
                  color="primary"
                  Component="Max"
                  padding="0"
                  size="xs"
                  borderRadius="0"
                  disabled={disabled}
                  onClickFn={() => setValue(token?.balance)}
                />
              </Box>
              <Typography
                variant="body-small-numeric"
                color={theme.palette.neutrals[15]}
              >
                ${displayUSDValue}
              </Typography>
            </Box>
          )}
      </Box>
    </Box>
  );
}
