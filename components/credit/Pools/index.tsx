import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import PoolDetailPage from './PoolDetailPage';
import CreditPositionCard from '../CreditPositionsCard';
import PoolTopSection from './PoolTopSection';
import { useRouter } from 'next/router';
import { CreditPair } from 'types/credit';
import CreditActionCard from '../CreditActionCard';
import { useLendingPair } from 'functions/credit';
import { TableMetrics } from './TableMetrics';

export type Type = 'Lend' | 'Borrow' | 'Provide Liquidity';

export default function CreditPools() {
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<Type>('Lend');

  const [maturityIndex, selectMaturityIndex] = useState(0);

  const router = useRouter();

  const { query } = router;

  const { asset, collateral, maturityType } = useMemo(() => {
    return Array.isArray(query?.addresses)
      ? {
          asset: query?.addresses[0],
          collateral: query?.addresses[1],
          maturityType: query?.addresses[2] ?? 'active',
        }
      : { asset: undefined, collateral: undefined, maturity: 'active' };
  }, [query]);

  const setShowActivePools = (val: boolean) => {
    router.push(
      `/credit/pools/${asset}/${collateral}/${val ? 'active' : 'expired'}`,
    );
  };

  const showActivePools = maturityType === 'active';

  let creditPair = useLendingPair(asset as string, collateral as string);

  const handleOpenModal = (card: Type) => {
    setType(card);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  creditPair.data = useMemo(() => {
    if (!creditPair.data) return undefined;
    const pools = creditPair.data.pools.filter(({ matured }) => {
      return matured === !showActivePools;
    });
    return {
      ...creditPair.data,
      pools,
    };
  }, [creditPair, showActivePools]);

  useEffect(() => {
    selectMaturityIndex(0);
  }, [showActivePools]);

  const noPoolExists =
    !creditPair.isValidating &&
    (!creditPair.data ||
      (creditPair.data && creditPair.data.pools.length === 0));

  const maturity = creditPair.data?.pools?.[maturityIndex]
    ? creditPair.data?.pools[maturityIndex].maturity
    : 0;

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <CreditActionCard
        maturity={maturityIndex}
        setMaturity={selectMaturityIndex}
        type={type}
        creditPair={creditPair.data as CreditPair}
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
      />
      <PoolTopSection
        checked={showActivePools}
        setChecked={setShowActivePools}
        pair={creditPair.data as CreditPair}
        isLoading={creditPair.isLoading}
        openModal={handleOpenModal}
        maturityIndex={maturityIndex}
        selectMaturityIndex={selectMaturityIndex}
      />
      <Box position="relative">
        {noPoolExists && (
          <Typography
            position={'absolute'}
            color="white"
            top="50%"
            left="50%"
            margin="auto"
            zIndex="1"
            sx={{ transform: 'translate(-50%,-50%)' }}
          >
            No Pool Found
          </Typography>
        )}
        <Box
          sx={{ filter: noPoolExists ? 'blur(10px)' : 'unset' }}
          paddingTop="16px"
          paddingX="12px"
          display="flex"
          flexDirection="column"
          columnGap="24px"
          rowGap="12px"
        >
          <Box 
          display="flex"
          flexDirection="row-reverse"
          justifyContent="center"
          columnGap="24px"
          flexWrap="wrap"
          paddingX="12px"
          rowGap="12px"
          position="relative">

            <CreditPositionCard
                creditPair={creditPair.data}
                openModal={handleOpenModal}
                loading={creditPair.isValidating}
                maturity={maturity as number}
                showActivePools={showActivePools}
              />
            <PoolDetailPage
              creditPair={creditPair.data}
              maturityIndex={maturityIndex}
              selectMaturityIndex={selectMaturityIndex}
            />
          </Box>
          <TableMetrics 
              creditPair={creditPair.data}
              maturity={maturity as number}
           />
        </Box>
      </Box>
    </Box>
  );
}
