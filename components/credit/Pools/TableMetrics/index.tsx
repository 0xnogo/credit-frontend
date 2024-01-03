import { CreditPair } from "types/credit";
import LatestTxTable from "./LatestTxTable";
import { Box } from "@mui/material";
import Card from "@components/componentLibrary/Card";

interface TransactionsTableProps {
    maturity: number;
    creditPair: CreditPair | undefined;
}
  
export function TableMetrics({
    maturity,
    creditPair
}:TransactionsTableProps){

    return (
        <Box width="100%" sx={{margin:"0",marginBottom:'40px'}}>
            <Card 
                    header="Recent Transactions"
                    sx={{margin:"0 auto",width:"1192px",maxWidth:'calc(100% - 68px)'}}
                    
                    >
                        <LatestTxTable maturity={maturity} creditPair={creditPair} />
            </Card>
        </Box>
    )
  
}