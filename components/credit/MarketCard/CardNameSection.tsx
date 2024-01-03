import { Box, Typography, useTheme } from '@mui/material';
import CurrencyLogo from 'components/componentLibrary/Logo/CurrencyLogo';
import { Token } from 'types/assets';

interface CardNameSectionProps {
  asset: Token;
  collateral: Token;
}

export default function CardNameSection({
  asset,
  collateral,
}: CardNameSectionProps) {
  const theme = useTheme();
  return (
    <Box
      style={{
        background: theme.palette.neutrals[80],
        padding: '12px',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        style={{ borderRadius: '12px', padding: '4px' }}
      >
        <Box>
          <CurrencyLogo size={56} token={asset} />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap="2px"
          whiteSpace="nowrap"
        >
          <Typography variant="title-small-semibold" color="#F4F4F4">
            Borrow {asset?.symbol}
            <Typography
              variant="body-moderate-medium"
              display="flex"
              alignItems="center"
              color="#8A9FB3"
              gap="8px"
            >
              Collateral:
              <Typography variant="body-moderate-medium" color="#FFFFFF">
                {collateral?.symbol}
              </Typography>
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
