import React, { useMemo } from 'react';
import { Box, Skeleton, Theme, Typography, useTheme } from '@mui/material';
import BigNumber from 'bignumber.js';
import SubCard from '@components/componentLibrary/Card/SubCard';
import CreditMetric from '@components/componentLibrary/CreditMetric';
import formatTimestamp, { formatCurrency } from '@utils/index';
import {
  useLentPositionsFormatted,
  useBorrowPositionsFormatted,
  useLiquidityPositionsFormatted,
} from 'hooks/credit/useUserPositionsFormatted';
import { CreditPair, CreditPool, Due } from 'types/credit';
import BorrowPositionCard from '../CreditPositionsCard/positionCards/BorrowedPositionCard';
import LendPositionCard from '../CreditPositionsCard/positionCards/LendPositionCard';
import LiquidityPositionCard from '../CreditPositionsCard/positionCards/LiquidityPositionCard';
import { useBorrowedPositions, useLentPositions } from '@functions/credit';
import { useLiquidityPositions } from '@functions/liquidity/liquidityPairs';
import { useTransactionsController } from '@functions/transactions/credit.ts/poolInformation/useTransactionsController';

interface LoadingCardProps {}

const LoadingCard: React.FC<LoadingCardProps> = () => (
  <SubCard style={{ height: '300px', padding: '0' }}>
    <Skeleton
      animation="wave"
      variant="rectangular"
      sx={{ borderRadius: '10px' }}
      width="100%"
      height="100%"
    />
  </SubCard>
);

interface PositionCardsProps {
  positions: any[];
  isLoading: boolean;
  CardComponent: React.ElementType;
  theme: Theme;
  type: 'Borrow' | 'Lend' | 'LP';
  additionalProps?: object;
}

const PositionCards: React.FC<PositionCardsProps> = ({
  positions,
  isLoading,
  CardComponent,
  theme,
  type,
  additionalProps,
}) => {
  if (isLoading) return <LoadingCard />;
  return (
    <Box
      sx={{
        border: `1px solid ${
          type === 'Lend'
            ? theme.palette.brand.accent.normal
            : type === 'Borrow'
            ? theme.palette.brand.yellow.normal
            : theme.palette.brand.pink.normal
        }`,
        borderRadius: '12px',
      }}
    >
      {positions.map((position, index) => (
        <CardComponent
          position={position}
          index={index}
          key={index}
          {...additionalProps}
        />
      ))}
    </Box>
  );
};

interface PoolCardProps {
  pool: CreditPool;
  pair: CreditPair;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, pair }) => {
  const theme = useTheme();

  const { isValidating: isLoadingLentPositions } = useLentPositions();
  const { isValidating: isLoadingBorrowedPositions } = useBorrowedPositions();
  const { isValidating: isLoadingLiqPositions } = useLiquidityPositions();

  const { data: userLent } = useLentPositionsFormatted(
    pool?.pair?.asset.address,
    pool?.pair?.collateral.address,
    pool?.maturity,
  );
  const { data: userBorrowed } = useBorrowPositionsFormatted(
    pool?.pair?.asset.address,
    pool?.pair?.collateral.address,
    pool?.maturity,
  );
  const { data: userLP } = useLiquidityPositionsFormatted(
    pool?.pair?.asset.address,
    pool?.pair?.collateral.address,
    pool?.maturity,
  );

  useTransactionsController(pair, pool?.maturity);

  const totalLentForPool = useMemo(() => {
    return userLent?.reduce(
      (acc, position) =>
        acc
          .plus(new BigNumber(position?.pool?.loanPrincipalBalance ?? 0))
          .plus(new BigNumber(position?.pool?.loanInterestBalance ?? 0)),
      new BigNumber(0),
    );
  }, [userLent]);

  const totalBorrowedForPool = useMemo(
    () =>
      userBorrowed?.reduce(
        (acc, position) => acc.plus(new BigNumber(position?.due?.debt ?? 0)),
        new BigNumber(0),
      ),
    [userBorrowed],
  );

  const totalCoverageForPool = useMemo(() => {
    return userLent?.reduce(
      (acc, position) =>
        acc
          .plus(new BigNumber(position?.pool?.coveragePrincipalBalance ?? 0))
          .plus(new BigNumber(position?.pool?.coverageInterestBalance ?? 0)),
      new BigNumber(0),
    );
  }, [userLent]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        backgroundColor: theme.palette.neutrals[60],
        padding: '24px',
        borderRadius: '12px',
        border: `1px solid ${theme.palette.neutrals[40]}`,
      }}
    >
      <Typography
        variant="body-large-regular"
        color={theme.palette.neutrals.white}
      >
        {`Pool: ${pool?.pair?.asset?.symbol}/${pool?.pair?.collateral
          ?.symbol} - ${formatTimestamp(String(pool?.maturity))}`}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <SubCard
          padding="16px 16px 16px 16px"
          style={{
            flex: '1',
            background: theme.palette.neutrals[80],
            minWidth: 'max-content',
          }}
        >
          <CreditMetric
            title={'Total lent'}
            titleSize="18px"
            color={theme.palette.brand.accent.normal}
            data={`${formatCurrency(totalLentForPool.toString())} ${pool?.pair
              ?.asset?.symbol}`}
          />
        </SubCard>
        <SubCard
          padding="16px 16px 16px 16px"
          style={{
            flex: '1',
            background: theme.palette.neutrals[80],
            minWidth: 'max-content',
          }}
        >
          <CreditMetric
            title={'Total borrowed'}
            titleSize="18px"
            color={theme.palette.brand.yellow.normal}
            data={`${formatCurrency(totalBorrowedForPool.toString())} ${pool
              ?.pair?.asset?.symbol}`}
          />
        </SubCard>
        <SubCard
          padding="16px 16px 16px 16px"
          style={{
            flex: '1',
            background: theme.palette.neutrals[80],
            minWidth: 'max-content',
          }}
        >
          <CreditMetric
            title={'Total coverage'}
            titleSize="18px"
            color={theme.palette.brand.pink.normal}
            data={`${formatCurrency(totalCoverageForPool.toString())} ${pool
              ?.pair?.collateral?.symbol}`}
          />
        </SubCard>
      </Box>
      {userLent?.length > 0 && (
        <PositionCards
          positions={userLent}
          isLoading={isLoadingLentPositions}
          CardComponent={LendPositionCard}
          theme={theme}
          type="Lend"
          additionalProps={{ pair: pool.pair, maturity: pool.maturity }}
        />
      )}
      {userBorrowed?.length > 0 && (
        <PositionCards
          positions={userBorrowed}
          isLoading={isLoadingBorrowedPositions}
          CardComponent={BorrowPositionCard}
          theme={theme}
          type="Borrow"
          additionalProps={{ pair: pool.pair, maturity: pool.maturity }}
        />
      )}
      {userLP?.length > 0 && (
        <PositionCards
          positions={userLP}
          isLoading={isLoadingLiqPositions}
          theme={theme}
          type="LP"
          CardComponent={LiquidityPositionCard}
        />
      )}
    </Box>
  );
};

export default PoolCard;
