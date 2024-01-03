import { useLendingPairsInfo } from '@functions/credit';
import { Box, Typography, useTheme } from '@mui/material';
import { useMaturityFilteredPairs } from 'hooks/filters/useMaturityFilteredPairs';
import { useMetricFilterdPairs } from 'hooks/filters/metricFilteredPairs';
import { useTokenFilteredPairs } from 'hooks/filters/useTokenFilteredPairs';
import { useLoanTermFilteredPairs } from 'hooks/filters/useLoanTermFilteredPairs';
import { useState } from 'react';
import { Token } from 'types/assets';
import PairCard from './PairCard';
import { useMediaQueryHit } from 'hooks/useMediaQueryHit';
import { AssetsFilter } from '../filters/AssetsFilter';
import { SortByFilter } from '../filters/SortByFilter';
import { PoolStatusFilter } from '../filters/PoolStatusFilter';
import { FilterContainer } from '..';

export default function DashboardComponent() {
  const theme = useTheme();

  const [loanTerm, setLoanTerm] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [asset, setAsset] = useState<Token | null>(null);
  const [collateral, setCollateral] = useState<Token | null>(null);
  const [filter, setFilter] = useState(0);
  const { data: creditPairsInfo, isValidating } = useLendingPairsInfo();

  const matchesPhone = useMediaQueryHit('760px', 'max');

  const maturityFilteredPairs = useMaturityFilteredPairs(
    isActive,
    creditPairsInfo ?? [],
  );

  const metricFilteredPairs = useMetricFilterdPairs(
    filter,
    maturityFilteredPairs,
  );

  const assetFilteredPairs = useTokenFilteredPairs(
    asset,
    collateral,
    metricFilteredPairs,
  );

  const loanTermFilteredPairs = useLoanTermFilteredPairs(
    loanTerm,
    assetFilteredPairs,
  );

  return (
    <Box
      sx={{
        padding: '3vw',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <Typography
        variant="title-extra-large"
        color={theme.palette.neutrals.white}
      >
        User Dashboard
      </Typography>
      <FilterContainer
        sx={{
          display: 'flex',
          alignItems: 'end',
          flexWrap: 'wrap',
          flex: 1,
          gap: '12px',
          width: '100%',
        }}
      >
        <FilterContainer
          sx={{
            display: 'flex',
            alignItems: 'end',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <AssetsFilter
            token={collateral as Token}
            setToken={setCollateral}
            placeholder="Collateral"
          />
          <SortByFilter filter={filter} setFilter={setFilter} />
          <PoolStatusFilter isActive={isActive} setIsActive={setIsActive} />
        </FilterContainer>
      </FilterContainer>
      <Box
        sx={{
          display: 'flex',
          flexDirection: matchesPhone ? 'column' : 'row',
          gap: '2vw',
          flexWrap: 'wrap',
        }}
      >
        {loanTermFilteredPairs.map((pair, index) => (
          <PairCard key={index} pair={pair} />
        ))}
      </Box>
    </Box>
  );
}
