import { Box, styled } from '@mui/material';
import React from 'react';
import CardTopSection from './CardTopSection';
import CardNameSection from './CardNameSection';
import CardMainSection, { CardMainInfo } from './CardMainSection';
import BigNumber from 'bignumber.js';
import { CreditPair } from 'types/credit';
import { formatCurrency } from '@utils/index';

const CardContainer = styled(Box)(
  ({ theme }: any) =>
    `
    width: 282px;
    border: 1px solid transparent;
    border-radius: 12px;
    &:hover {
      border: 1px solid ${theme.palette.brand.accent.normal};
      background: rgba(15, 15, 15, 0.90);
      box-shadow: 0px 4px 15px 10px #012424;
    }
  `,
);

export default function CreditMarketCard({
  pair,
  isActive,
}: {
  pair: CreditPair;
  isActive: boolean;
}) {
  // @TODO: calculate utilization rate
  const unmaturedPools = pair.pools.filter((pool) => !pool.matured);
  const utilizationRate =
    unmaturedPools
      .reduce((prev, curr) => prev.plus(curr.utilRate), new BigNumber(0))
      .toNumber() / (unmaturedPools.length || 1);

  const pools = pair?.pools || [];
  const poolsNumber = pools.length;
  const sumMaxAPRs = pools.reduce(
    (sum, { maxAPR = 0 }) => sum.plus(maxAPR),
    new BigNumber(0),
  );
  const averageAPR = `${sumMaxAPRs.dividedBy(poolsNumber).toFixed(2)}%`;

  const borrowAPR = `${new BigNumber(pair?.bestAPR ?? 0).toFixed(2)}%`;

  const { asset, collateral, totalLiquidity } = pair;
  const tvl =
    '$' +
    formatCurrency(
      pair.pools
        .reduce(
          (prev, curr) =>
            prev.plus(curr.assetReserveUSD.plus(curr.collateralReserveUSD)),
          new BigNumber(0),
        )
        .toNumber(),
    );
  const sumMinCDPs = pools.reduce(
    (sum, { minCDP = 0 }) => sum.plus(minCDP),
    new BigNumber(0),
  );
  const cdp = `${sumMinCDPs.times(100).dividedBy(poolsNumber).toFixed(2)}%`;
  const maturity = pools.map((pool) => pool.maturity);

  const cardMainInfo: CardMainInfo = {
    averageAPR,
    borrowAPR,
    cdp,
    maturity,
    utilizationRate,
    tvl,
  };
  return (
    <CardContainer sx={{ backgroundColor: '#161718', width: '282px' }}>
      <CardTopSection
        isActive={isActive}
        pools={poolsNumber}
        maturity={maturity}
      />
      <CardNameSection asset={asset} collateral={collateral} />
      <CardMainSection info={cardMainInfo} />
    </CardContainer>
  );
}
