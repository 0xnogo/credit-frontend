import { Box } from '@mui/material';
import { useMediaQueryHit } from 'hooks/useMediaQueryHit';
import { useMemo } from 'react';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';

export const useFaqColumns = () => {
  const matchesSmallLaptop = useMediaQueryHit('1036px', 'max');
  const matchesTablet = useMediaQueryHit('892px', 'max');
  const matchesSmallTablet = useMediaQueryHit('749px', 'max');

  return useMemo(() => {
    const tableColumns = [
      {
        key: 'name',
        numeric: false,
        render: () => (
          <Box
            display="flex"
            alignItems="center"
            columnGap="10px"
            paddingY="6px"
          >
            HELLO
          </Box>
        ),
        label: 'Name',
      },
    ];

    if (matchesSmallLaptop) {
      tableColumns.splice(-2, 1);
    }

    if (matchesTablet) {
      tableColumns.splice(-2, 1);
    }

    if (matchesSmallTablet) {
      tableColumns.splice(-2, 1);
    }

    return tableColumns;
  }, [matchesSmallLaptop, matchesTablet, matchesSmallTablet]);
};
