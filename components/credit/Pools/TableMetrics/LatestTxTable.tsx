import * as React from 'react';
import TableComponent, { ColumnData } from '@components/componentLibrary/Table';
import { CreditPair } from 'types/credit';
import { Box, Skeleton } from '@mui/material';
import { useTransactionsController } from '@functions/transactions/credit.ts/poolInformation/useTransactionsController';
import { useAllPoolInformation } from '@functions/transactions/credit.ts/poolInformation/usePoolInformation';
import { convertDataToRowObject } from '@functions/transactions/credit.ts/utils';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { useTokenMapping } from 'hooks/useTokenMapping';
import { CreditTransactionsQuery } from '@graph/core/types';

const columns: ColumnData[] = [
  {
    width: 80,
    label: 'Date',
    dataKey: 'date',
  },
  {
    width: 90,
    label: 'Type',
    dataKey: 'type',
  },
  {
    width: 90,
    label: 'Asset Value',
    dataKey: 'assetValue',
  },
  {
    width: 100,
    label: 'Asset Amount',
    dataKey: 'assetAmount',
  },
  {
    width: 110,
    label: 'Collateral Value',
    dataKey: 'collateralValue',
  },
  {
    width: 120,
    label: 'Collateral Amount',
    dataKey: 'collateralAmount',
  },
  {
    width: 80,
    label: 'Max APR',
    dataKey: 'maxAPR',
  },
  {
    width: 70,
    label: 'Maker',
    dataKey: 'maker',
  },
  {
    width: 120,
    label: 'Txn',
    dataKey: 'transactionHash',
  },
];

interface TransactionsTableProps {
    maturity: number;
    creditPair: CreditPair | undefined;
}

export default function LatestTxTable({
    maturity,
    creditPair
}:TransactionsTableProps) {
  
    const { chainId } = useActiveWeb3React()

    const {loadNextTransactions,loadingAhead,loadingBelow } = useTransactionsController(creditPair,maturity)

    const { poolInfo } =   useAllPoolInformation(creditPair?.address,maturity)

    const txs = poolInfo?.transactions ?? []

    const convertedTableData = React.useMemo(()=>{
      if(!creditPair) return []
      return txs.map((data:CreditTransactionsQuery)=>convertDataToRowObject(data,chainId,creditPair?.asset,creditPair?.collateral))
    },[txs,chainId,creditPair?.address])

  return (
    <Box minHeight={"200px"} >
    {
      (loadingAhead || loadingBelow ) && convertedTableData.length===0?
      <Skeleton sx={{height:'200px'}} animation="wave" variant='rectangular' />
      :
      <>
      <TableComponent
        height={400}
        width={'100%'}
        rows={convertedTableData}
        columns={columns}
        endReachedHandler={loadNextTransactions}
      />{
        ((loadingBelow) && convertedTableData.length>0) ?<Skeleton sx={{height:'50px',marginTop:"6px",borderRadius:'12px'}} animation="wave" variant='rectangular'/>:<></>
      }
      </>
    }
    </Box>
  );
}

