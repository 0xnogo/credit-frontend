import React from 'react';
import { useLendingPairsInfo } from 'functions/credit';
import CreditMarketCard from './MarketCard';
import { Box, Skeleton } from '@mui/material';
import { CreditPair } from 'types/credit';
import { useRouter } from 'next/router';
import { useMaturityFilteredPairs } from 'hooks/filters/useMaturityFilteredPairs';
import { useMetricFilterdPairs } from 'hooks/filters/metricFilteredPairs';
import { Token } from 'types/assets';
import { useTokenFilteredPairs } from 'hooks/filters/useTokenFilteredPairs';
import Image from 'next/image';
import { useLoanTermFilteredPairs } from 'hooks/filters/useLoanTermFilteredPairs';

interface CreditMarketPageProps {
  isActive: boolean;
  filter: number;
  asset: Token | null;
  collateral: Token | null;
  loanTerm: number;
}

export default function CreditMarketPage({
  isActive,
  filter,
  asset,
  collateral,
  loanTerm,
}: CreditMarketPageProps) {
  const creditPairsInfo = useLendingPairsInfo();

  const { isValidating } = creditPairsInfo;

  const maturityFilteredPairs = useMaturityFilteredPairs(
    isActive,
    creditPairsInfo.data ?? [],
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

  const router = useRouter();

  const handleCardClick = (creditPair: CreditPair) => {
    const assetAddress = creditPair?.asset?.address;
    const collateralAddress = creditPair?.collateral?.address;

    router.push(
      `/credit/pools/${assetAddress}/${collateralAddress}/${
        isActive ? 'active' : 'expired'
      }`,
    );
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(282px, 1fr))',
        gap: '24px',
        marginBottom: '24px',
      }}
    >
      {isValidating
        ? new Array(4).fill(0).map((_, index) => (
            <Box
              style={{
                borderRadius: '10px',
                textDecoration: 'none',
                height: '327.688px',
                minWidth: '282px',
                maxWidth: '282px',
                backgroundColor: '#161718',
              }}
              flex="1"
              zIndex="0"
              key={`${index}-placeholder`}
              padding="0"
              position="relative"
              justifySelf={'center'}
            >
              <Skeleton
                animation="wave"
                sx={{ zindex: 2, opacity: 0.5 }}
                variant="rectangular"
                height={327.688}
              />
              <Image
                draggable={false}
                style={{
                  filter: 'blur(5px)',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 0,
                  opacity: 0.3,
                }}
                alt="market card"
                src="images/marketLoadingImg.svg"
                height={327.688}
                width={282}
              />
            </Box>
          ))
        : loanTermFilteredPairs.map((creditPair, index) => (
            <Box
              key={`${index}-real`}
              style={{
                textDecoration: 'none',
                cursor: 'pointer',
                zIndex: 0,
                minWidth: '282px',
                maxWidth: '282px',
              }}
              onClick={() => handleCardClick(creditPair)}
              flex="1"
              justifySelf={'center'}
            >
              <CreditMarketCard isActive={isActive} pair={creditPair} />
            </Box>
          ))}
    </Box>
  );
}
