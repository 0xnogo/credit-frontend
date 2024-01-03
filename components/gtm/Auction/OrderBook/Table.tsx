import * as React from 'react';
import TableComponent, { ColumnData } from '@components/componentLibrary/Table';
import { useOrderbookTableData } from '@functions/gtm/auction/orderBook/getOrderBookTableData';
import { Box, Typography } from '@mui/material';

const columns: ColumnData[] = [
  {
    width: 60,
    label: 'Price',
    dataKey: 'price',
  },
  {
    width: 120,
    label: 'Volume',
    dataKey: 'amount',
  },
  {
    width: 100,
    label: 'Sum(Volume)',
    dataKey: 'sum',
  },
  {
    width: 80,
    label: 'My Size(%)',
    dataKey: 'mySize',
  },
];

export default function OrderBookTable() {
  const tableData = useOrderbookTableData();

  const noData = tableData.length === 0;

  return (
    <Box height={450} width={'100%'} position="relative">
      {noData ? (
        <Typography
          color="white"
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: 'translate(-50%,-50%)' }}
        >
          No bids placed yet
        </Typography>
      ) : (
        <TableComponent
          height={450}
          width={'100%'}
          rows={tableData}
          columns={columns}
        />
      )}
    </Box>
  );
}
