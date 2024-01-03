import { CreditTransactionsQuery } from "@graph/core/types";
import { Box, Link, Tooltip, Typography } from "@mui/material";
import { compactCurrency, formatTimestampToDate, shortenAddress } from "@utils/index";
import BigNumber from "bignumber.js";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ETHERSCAN_URL } from "@constants/index";
import { Token } from "types/assets";
import CurrencyLogo from "@components/componentLibrary/Logo/CurrencyLogo";

const colors:Record<string,string> = {
  "Lend":'#98FFFF',
  "Add Liquidity":'#FFBDE7',
  "Remove Liquidity":'#FFBDE7',
  "Borrow":'#FFBD13',
  "Repay":'#FFBD13',
  "Claim":'#98FFFF'
}

export const convertDataToRowObject =(value:CreditTransactionsQuery,chainId:number,asset:Token,collateral:Token)=>{
    const timestamp = Number(value.timestamp) * 1000;
    const date = new Date(timestamp);
    const dateString = (date).toLocaleDateString()
    const fullDate = formatTimestampToDate(timestamp);
    const timeString = `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`
    return {
        id:value.txHash,
        date:<Box>
          <Tooltip title={fullDate}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body-moderate-regular" fontWeight="bold">{dateString}</Typography>
              <Typography variant="body-small-regular" color="#8D8D8D" fontWeight="bold">{timeString}</Typography>
            </Box>
          </Tooltip>
        </Box>,
        type:<Typography variant="body-moderate-regular" fontWeight="bold" color={colors[value.type]}>{value.type}</Typography>,
        assetValue:`$${compactCurrency(new BigNumber(value.assetValue))}`,
        assetAmount: <Box display="flex" flexDirection="row" gap="6px" alignItems="center">
        <CurrencyLogo token={asset} size={18} />{compactCurrency(new BigNumber(value.assetAmount).div(Math.pow(10,asset.decimals)))}</Box>,
        collateralValue: `$${compactCurrency(new BigNumber(value.collateralValue))}`,
        collateralAmount: <Box display="flex" flexDirection="row" gap="6px" alignItems="center">
        <CurrencyLogo token={collateral} size={18} />{compactCurrency(new BigNumber(value.collateralAmount).div(Math.pow(10,collateral.decimals)))}</Box>,
        maxAPR: `${compactCurrency(new BigNumber(value.maxAPR))}%`,
        maker:<Link sx={{display:"flex",flexDirection:'row',alignItems:'center'}} href={`${ETHERSCAN_URL[chainId]}/address/${value.user.id}`} target="_blank">
        {
          shortenAddress(value.user.id,2)
        }
        <OpenInNewIcon sx={{fontSize:'15px'}} />
        </Link>,
        transactionHash: <Link sx={{display:"flex",flexDirection:'row',alignItems:'center'}} href={`${ETHERSCAN_URL[chainId]}/tx/${value.txHash}`} target="_blank">
        {value.txHash.slice(0,6)}...
        <OpenInNewIcon sx={{fontSize:'15px'}} />
        </Link>
    }
}