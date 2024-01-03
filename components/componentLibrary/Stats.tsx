import { Box, styled, useMediaQuery, useTheme } from '@mui/material';
import CreditMetric from 'components/componentLibrary/CreditMetric';
import { useProtocolInfo } from 'hooks/credit/useProtocolInfo';
import { compactCurrency } from '@utils/index';
import { useLendingPairsInfo } from 'functions/credit/lendingPairs';

interface StatsRectangleProps {
  color0: string | undefined;
  color1: string | undefined;
  percentage0?: string;
  percentage1?: string;
}

const StatsRectangle = styled(Box)<StatsRectangleProps>`
  background: linear-gradient(
    90deg,
    ${({ color0 }) => color0}
      ${({ percentage0 }) => (percentage0 ? percentage0 : '0.85%')},
    ${({ color1 }) => color1}
      ${({ percentage1 }) => (percentage1 ? percentage1 : '99.15%')}
  );
  box-shadow: 0px 8px 50px ${({ color0 }) => color0};
  height: 4px;
  width: 100%;
`;

export default function Stats() {
  const theme = useTheme();
  const media605 = useMediaQuery('(max-width:605px)');

  const { isValidating } = useLendingPairsInfo();
  const { supplyBalance, totalBorrow, collateralBalance, totalDue } =
    useProtocolInfo();
  return (
    <Box
      display="flex"
      minWidth={'300px'}
      width="821px"
      maxWidth="100%"
      paddingX="20px"
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <StatsRectangle
          color0={theme.palette.brand.accent.normal}
          color1="#4BD2D2"
          percentage0="15.85%"
          percentage1="100.27%"
        />
        <CreditMetric
          title="Available Assets"
          data={`$${compactCurrency(supplyBalance)}`}
          gradient={`linear-gradient(90deg, ${theme.palette.brand.accent.normal} 15.85%, #4BD2D2 47.01%), linear-gradient(90deg, #FFB904 5.74%, #FFE49D 100.27%), #D9D9D9`}
          dataSize={media605 ? '14px' : '24px'}
          titleSize={media605 ? '10px' : '14px'}
          center={true}
          isLoading={isValidating}
          toolTipText="Available Assets for Borrowers"
        />
      </Box>
      <Box
        style={{
          display: 'flex',
          margin: '0 4px',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <StatsRectangle color0="#FFB904" color1="#FFE49D" />
        <CreditMetric
          title="Borrowed Assets"
          data={`$${compactCurrency(totalBorrow)}`}
          color="#CF9808"
          gradient="linear-gradient(90deg, #FFB904 5.74%, #FFE49D 100.27%), #D9D9D9"
          dataSize={media605 ? '14px' : '24px'}
          titleSize={media605 ? '10px' : '14px'}
          center={true}
          isLoading={isValidating}
          toolTipText="Total Assets Borrowed "
        />
      </Box>
      <Box
        style={{
          display: 'flex',
          margin: '0 4px',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <StatsRectangle color0={theme.palette.brand.green} color1="#82FFCB" />
        <CreditMetric
          title="Locked Collateral"
          data={`$${compactCurrency(collateralBalance)}`}
          color={theme.palette.brand.green}
          gradient={`linear-gradient(90deg, ${theme.palette.brand.green} 5.74%, #82FFCB 100.27%), #D9D9D9`}
          opacity="0.5"
          dataSize={media605 ? '14px' : '24px'}
          titleSize={media605 ? '10px' : '14px'}
          center={true}
          isLoading={isValidating}
          toolTipText="Collateral Locked by Borrowers"
        />
      </Box>
      <Box
        style={{
          display: 'flex',
          margin: '0 4px',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <StatsRectangle color0="#FF73CC" color1="#F7CBE7" />
        <CreditMetric
          title="Borrower Debt"
          data={`$${compactCurrency(totalDue)}`}
          color="#F7CBE7"
          gradient="linear-gradient(90deg, #FF73CC 5.74%, #F7CBE7 100.27%)"
          opacity="0.5"
          dataSize={media605 ? '14px' : '24px'}
          titleSize={media605 ? '10px' : '14px'}
          center={true}
          isLoading={isValidating}
          toolTipText="Debt Accumulated by Borrowers"
        />
      </Box>
    </Box>
  );
}
