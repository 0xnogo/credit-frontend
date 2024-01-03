import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { Box, Theme, useTheme } from '@mui/material';

export interface TableData {
  [key: string]: any;
}

export interface ColumnData {
  dataKey: keyof TableData;
  label: string;
  numeric?: boolean;
  width: number;
}

interface TableProps {
  height: number;
  width: number | string;
  rows: TableData[];
  columns: ColumnData[];
  endReachedHandler?: (index:number)=>void
}

const VirtuosoTableComponents: TableComponents<TableData> = {
  Scroller: React.forwardRef(function (props, ref) {
    return <TableContainer component={Box} sx={{ gap: '12px' }} {...props} ref={ref} />
  }),
  Table: (props) => (
    <Table
      {...props}
      sx={{
        borderCollapse: 'separate',
        tableLayout: 'fixed',
        borderSpacing: '0 12px !important',
      }}
    />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef(function (props, ref) { return <TableBody {...props} ref={ref} />}),
};

function FixedHeaderContent({ columns }: { columns: ColumnData[] }) {
  const theme = useTheme();

  return (
    <TableRow sx={{ backgroundColor: theme.palette.neutrals[80] }}>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={'left'}
          style={{ width: column.width }}
          sx={{
            borderBottom: 'none',
            backgroundColor: 'background.paper',
            color: `${theme.palette.neutrals[10]} !important`,
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(
  _index: number,
  row: TableData,
  columns: ColumnData[],
  theme: Theme,
) {
  return (
    <React.Fragment>
      {columns.map((column, index) => (
        <TableCell
          key={column.dataKey}
          align={'left'}
          sx={{
            color: 'white',
            backgroundColor: theme.palette.neutrals[60],
            borderBottom: 'none',
            borderTopLeftRadius: index === 0 ? '12px' : '0',
            borderTopRightRadius: index === columns.length - 1 ? '12px' : '0',
            borderBottomRightRadius:
              index === columns.length - 1 ? '12px' : '0',
            borderBottomLeftRadius: index === 0 ? '12px' : '0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function TableComponent({
  height,
  width,
  rows,
  columns,
  endReachedHandler
}: TableProps) {
  const theme = useTheme();
  return (
    <Box style={{ height: height, width: width, zIndex: 0 }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={() => <FixedHeaderContent columns={columns} />}
        itemContent={(_index: number, row: TableData) =>
          rowContent(_index, row, columns, theme)
        }
        endReached={endReachedHandler}
      />
    </Box>
  );
}
