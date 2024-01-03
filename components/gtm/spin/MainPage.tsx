import { Box, useTheme } from '@mui/material';
import SpinSection from './SpinSection';
import PurchaseSection from './PurchaseSection';
import { useWindowSize } from 'hooks/useWindowSize';
import { useMemo } from 'react';

const queries: any = {
  1400: {
    spin: {
      flex: '1',
    },
    pay: {
      width: '648px',
    },
    modal: {
      width: '480px',
      maxWidth: '100%',
    },
  },
  1000: {
    spin: {
      flex: '1',
    },
    pay: {
      width: '500px',
    },
    modal: {
      width: '400px',
      maxWidth: '100%',
    },
  },
  850: {
    spin: {
      flex: '1',
    },
    pay: {
      width: '400px',
    },
    modal: {
      width: '320px',
      maxWidth: '100%',
    },
  },
  0: {
    spin: {
      width: '100%',
    },
    pay: {
      width: '500px',
      maxWidth: 'calc(100% - 60px)',
      margin: 'auto',
    },
    modal: {
      width: '100%',
      maxWidth: '100%',
    },
  },
};

const flexQueries: any = {
  0: {
    flexDirection: 'column',
  },
  850: {
    flexDirection: 'row',
  },
};

const slotQueries = [0, 850, 1000, 1400];

function MainPage() {
  const [width] = useWindowSize();

  const theme = useTheme();

  const currentHitQuery = useMemo(() => {
    let query = 0;
    slotQueries.forEach((currentQuery) => {
      if (width >= currentQuery) {
        query = currentQuery;
      }
    });
    return query;
  }, [width]);

  const currentProperties = queries[currentHitQuery];

  const wrapQuery = flexQueries[currentHitQuery];
  return (
    <Box
      display="flex"
      flexDirection="row"
      height="100%"
      minHeight="100vh"
      sx={{ ...wrapQuery }}
    >
      <Box
        sx={{
          overflowX: 'hidden',
          overflowY: 'hidden',
          minHeight: '100%',
          background: theme.palette.neutrals[60],
          paddingBottom: '10px',
          ...currentProperties['spin'],
        }}
        position="relative"
      >
        <SpinSection />
      </Box>
      <Box
        sx={{
          ...currentProperties['pay'],
        }}
        height="10px"
      >
        <PurchaseSection properties={currentProperties.modal} />
      </Box>
    </Box>
  );
}

export default MainPage;
