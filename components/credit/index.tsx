import { Box, keyframes, styled } from '@mui/material';
import { useState } from 'react';
import Hero from 'components/componentLibrary/Hero';
import TermFilter from '../componentLibrary/TermFilter';
import CreditMarketPage from './CreditMarketPage';
import Image from 'next/image';
import { PoolStatusFilter } from './filters/PoolStatusFilter';
import { SortByFilter } from './filters/SortByFilter';
import { AssetsFilter } from './filters/AssetsFilter';
import { Token } from 'types/assets';
import { useWindowSize } from 'hooks/useWindowSize';

const pulseAnimation = keyframes`

from { opacity: 1; }
50% { opacity: 0.4; }
to { opacity: 1; }
`;

export const FilterContainer = styled(Box)(
  ({ theme }: any) => `
  & {
    justify-content:space-between;
  }
    
  @media only screen and (max-width: 1198px) {
    & {
      justify-content:center;
    }
  }
`,
);

export default function CreditMain() {
  const [loanTerm, setLoanTerm] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [asset, setAsset] = useState<Token | null>(null);
  const [collateral, setCollateral] = useState<Token | null>(null);
  const [filter, setFilter] = useState(0);

  const [width] = useWindowSize();

  return (
    <Box>
      <Hero />
      <Box position="relative">
        <Box sx={{ opacity: '0.7' }}>
          <Image
            style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            src="/images/bg.svg"
            alt="bg"
            width={width}
            height={577}
          />
          <Box sx={{ animation: `${pulseAnimation} 4s linear infinite` }}>
            <Image
              style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              src="/images/bgCircles.svg"
              alt="bg"
              width={width}
              height={577}
            />
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          margin="0 auto"
          gap="24px"
          width="1200px"
          maxWidth="calc(100% - 40px)"
          paddingX="20px"
        >
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
            <Box position="relative" display="flex" justifyContent={'center'}>
              <TermFilter value={loanTerm} setValue={setLoanTerm} />
            </Box>
            <FilterContainer
              sx={{
                display: 'flex',
                alignItems: 'end',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <AssetsFilter
                token={asset as Token}
                setToken={setAsset}
                placeholder="Asset"
              />
              <AssetsFilter
                token={collateral as Token}
                setToken={setCollateral}
                placeholder="Collateral"
              />
              <SortByFilter filter={filter} setFilter={setFilter} />
              <PoolStatusFilter isActive={isActive} setIsActive={setIsActive} />
            </FilterContainer>
          </FilterContainer>
          <CreditMarketPage
            isActive={isActive}
            filter={filter}
            asset={asset}
            collateral={collateral}
            loanTerm={loanTerm}
          />
        </Box>
      </Box>
    </Box>
  );
}
