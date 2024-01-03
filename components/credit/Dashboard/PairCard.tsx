import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import PoolCard from './PoolCard';
import { CreditPool } from 'types/credit';
import { Token } from 'types/assets';
import BigNumber from 'bignumber.js';
import { useTheme } from '@mui/material';
import {
  useCreditPositions,
  AllPositions,
} from '@functions/credit/creditPositions';

interface Pair {
  pools: CreditPool[];
  address: string;
  asset: Token;
  collateral: Token;
  bestAPR?: BigNumber;
  totalLiquidity?: BigNumber;
  fee: BigNumber;
  protocolFee: BigNumber;
  stakingFee: BigNumber;
}

interface PairCardProps {
  pair: Pair;
}

const PairCard: React.FC<PairCardProps> = ({ pair }) => {
  const theme = useTheme();
  const [sortedPools, setSortedPools] = useState<CreditPool[]>([]);
  const { data: allPositions = {} } = useCreditPositions();

  useEffect(() => {
    const positions = Object.values(allPositions as AllPositions)
      .flatMap((position) => position)
      .flatMap((position) => String(position?.maturity));

    const newSortedPools = [...pair.pools].sort((a, b) => {
      const aHasPosition = positions.includes(String(a.maturity));
      const bHasPosition = positions.includes(String(b.maturity));
      if (aHasPosition && !bHasPosition) {
        return -1;
      } else if (!aHasPosition && bHasPosition) {
        return 1;
      } else {
        return a.maturity - b.maturity;
      }
    });

    setSortedPools(newSortedPools);
  }, [pair.pools, allPositions]);

  return (
    <Box
      sx={{
        flex: '1 1 300px',
        backgroundColor: theme.palette.neutrals[80],
        padding: '24px',
        borderRadius: '12px',
        gap: '12px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant="title-moderate-bold"
        color={theme.palette.neutrals.white}
      >
        {`Pair: ${pair?.asset?.symbol}/${pair?.collateral?.symbol}`}
      </Typography>
      {sortedPools.map((pool, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <PoolCard pair={pair} pool={pool} />
        </Box>
      ))}
    </Box>
  );
};

export default PairCard;
