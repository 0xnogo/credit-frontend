import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import useLendCallback from './useLendCallback';
import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import InfoCard from 'components/componentLibrary/Card/InfoCard';
import { Box, Typography, useTheme } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import formatTimestamp, { formatCurrency } from '@utils/index';
import SubCard from 'components/componentLibrary/Card/SubCard';
import useConvenienceAllowanceCallback from 'hooks/approval/useConvenienceApproval';
import { get } from 'http';
import { getConvenienceApproval } from 'functions/approval/getConvenienceApproval';
import CoinBalance from '@components/componentLibrary/CoinBalance';
import { useETHPrice } from 'hooks/useETHPrice';

export const useLendTransactionDispatch = (
  apr: BigNumber,
  handleCloseParent: any,
  asset: Token,
  collateral: Token,
  maturity: BigNumber,
  assetIn: BigNumber,
  bond: BigNumber,
  insurance: BigNumber,
  percent: BigNumber,
  lendFees: BigNumber,
  deadline: string,
  slippage: string,
  lendCallback: (err?: any) => void,
  dateCreated: number,
) => {
  const { data: ethPrice = new BigNumber(0) } = useETHPrice();

  const { account, web3, chainId } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState, transactionInfo } =
    useCurrentTransactions();

  const approvalFn = useConvenienceAllowanceCallback(
    asset,
    assetIn,
    lendCallback,
    addTransaction,
    setTransactionStatus,
    transactionInfo,
  );

  const lendFn = useLendCallback(
    asset,
    collateral,
    maturity,
    assetIn,
    bond,
    insurance,
    percent,
    deadline,
    slippage,
    lendCallback,
    setTransactionStatus,
  );

  const defaultObj = (
    allowance0TXID: string,
    lendTXID: string,
    lendComponent: JSX.Element,
  ): AddTransaction => ({
    title: `Confirm Lend`,
    type: 'Lending',
    verb: `${asset.symbol} lent successfully`,
    txType: 'lend',
    transactions: [
      {
        uuid: allowance0TXID,
        description: `Checking your ${asset.symbol} allowance`,
        status: 'WAITING',
        actionName: `Approve ${asset.symbol}`,
        action: () => approvalFn(allowance0TXID),
      },
      {
        uuid: lendTXID,
        description: `Lend ${asset.symbol}`,
        status: 'WAITING',
        actionName: 'Confirm Deposit',
        action: () => lendFn(lendTXID),
      },
    ],
    transactionComponent: lendComponent,
  });

  const theme = useTheme();

  const dailyYield = Math.pow(
    new BigNumber(apr ?? 0).div(100).plus(1).toNumber(),
    1 / 365,
  );

  const loanTerm = new BigNumber(maturity).minus(dateCreated).toNumber();

  // Calculated using metrics.APR, taking into account the full loan term
  const positionYield = new BigNumber(
    Math.pow(dailyYield, new BigNumber(loanTerm).div(86400).toNumber()),
  ).minus(1);

  const lendComponent = useMemo(() => {
    return (
      <>
        <Box display="flex" flexDirection="column" gap="8px" marginTop="24px">
          <Typography
            variant="body-small-regular"
            color={theme.palette.neutrals[15]}
          >
            Lend Amount
          </Typography>
          <SubCard padding="16px">
            <HorizontalInfo
              header="Total Deposit"
              value={`$${formatCurrency(
                ethPrice.times(assetIn).times(asset.derivedETH).toFixed(),
              )}`}
            />
            <HorizontalInfo
              header="Token Amount"
              value={`${formatCurrency(assetIn.toFixed())} ${asset.symbol}`}
            />
          </SubCard>
        </Box>
        <Box display="flex" flexDirection="column" gap="8px">
          <Typography
            variant="body-small-regular"
            color={theme.palette.neutrals[15]}
          >
            Position Summary
          </Typography>
          <InfoCard display="flex" flexDirection="column">
            <HorizontalInfo
              header="Max APR"
              value={`${formatCurrency((apr ?? '0').toString())}%`}
            />
            <HorizontalInfo
              header="Lender Yield"
              value={`${formatCurrency(
                (positionYield ?? '0').times(100).toString(),
              )}%`}
            />
            <HorizontalInfo
              header="Fees"
              value={
                <CoinBalance
                  token={asset}
                  value={lendFees.div(Math.pow(10, asset?.decimals))}
                  showLogo={true}
                  showUSD={true}
                />
              }
            />
            <HorizontalInfo
              header="Expiry date"
              value={`${formatTimestamp(maturity.toString())}`}
            />
            <HorizontalInfo
              header="Loan term"
              value={`${formatCurrency(
                (maturity.toNumber() - Date.now() / 1000) / 86400,
              )} days`}
            />
            <HorizontalInfo
              header="Insurance coverage"
              value={
                <CoinBalance
                  token={collateral}
                  value={insurance.div(10 ** Number(collateral.decimals))}
                  showUSD={true}
                />
              }
              toolTipText="The amount of coverage you are receiving for your loan. Should ALL borrowers default, the collateral in the pool will be used as insurance coverage"
            />
          </InfoCard>
        </Box>
      </>
    );
  }, [assetIn, insurance, collateral, maturity, asset, apr, lendFees]);

  const startTransactions = useCallback(() => {
    const allowance0TXID = uuid();
    const lendTXID = uuid();
    resetState();
    addTransaction(defaultObj(allowance0TXID, lendTXID, lendComponent));
    handleCloseParent();
    setTimeout(() => {
      getConvenienceApproval(
        asset,
        chainId,
        web3,
        account as string,
        assetIn,
        setTransactionStatus,
        allowance0TXID,
      );
    });
  }, [
    addTransaction,
    resetState,
    defaultObj,
    lendComponent,
    handleCloseParent,
    assetIn,
    asset,
    chainId,
    web3,
    account,
    assetIn,
    setTransactionStatus,
  ]);

  return startTransactions;
};
