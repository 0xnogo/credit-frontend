import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import InfoCard from 'components/componentLibrary/Card/InfoCard';
import { Box, Typography, useTheme } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import formatTimestamp, { compactCurrency, formatCurrency } from '@utils/index';
import SubCard from 'components/componentLibrary/Card/SubCard';
import useConvenienceAllowanceCallback from 'hooks/approval/useConvenienceApproval';
import { getConvenienceApproval } from 'functions/approval/getConvenienceApproval';
import { useDepositCallbackCredit } from './useCreditLiqAddCallback';
import { LP_FARMING_ADDRESS } from '@constants/contracts/addresses';
import useCreditPositionAllowanceCallback from 'hooks/approval/useCreditPositionApproval';
import { useFarmLPCallback } from './useFarmLPCallback';
import { getCreditPositionApproval } from '@functions/approval/getCreditPositionApproval';
import CoinBalance from '@components/componentLibrary/CoinBalance';

export const useLiquidityCreateTransactionDispatch = (
  apr: string,
  asset: Token,
  collateral: Token,
  assetInAmount: BigNumber,
  collateralInAmount: BigNumber,
  maturity: string,
  debt: string,
  deadline: string,
  liquidity: string,
  lpFees: BigNumber,
  slippage: string,
  depositCallback: (err?: any) => void,
  handleCloseParent: any,
  priorityAsset: 0 | 1,
  dateCreated: number,
  poolHash?: string,
) => {
  const { account, web3, chainId } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState, transactionInfo } =
    useCurrentTransactions();

  const afterAssetApprovalCallback = async (id: string) => {
    getConvenienceApproval(
      collateral,
      chainId,
      web3,
      account as string,
      collateralInAmount,
      setTransactionStatus,
      id,
    );
  };

  const afterDepositCallback = async (id: string, allowanceTXID: string) => {
    await getCreditPositionApproval(
      chainId,
      web3,
      setTransactionStatus,
      id,
      allowanceTXID,
      undefined,
      LP_FARMING_ADDRESS[chainId],
    );
  };

  const assetApprovalFn = useConvenienceAllowanceCallback(
    asset,
    assetInAmount,
    depositCallback,
    addTransaction,
    setTransactionStatus,
    transactionInfo,
    afterAssetApprovalCallback,
  );

  const collateralApprovalFn = useConvenienceAllowanceCallback(
    collateral,
    collateralInAmount,
    depositCallback,
    addTransaction,
    setTransactionStatus,
    transactionInfo,
  );

  const depositFn = useDepositCallbackCredit(
    asset,
    collateral,
    assetInAmount.toFixed(),
    collateralInAmount.toFixed(),
    maturity,
    debt,
    deadline,
    slippage,
    priorityAsset,
    depositCallback,
    afterDepositCallback,
  );

  const creditPositionApproval = useCreditPositionAllowanceCallback(
    'latest',
    depositCallback,
    undefined,
    LP_FARMING_ADDRESS[chainId],
  );

  const farmFn = useFarmLPCallback(poolHash as string, depositCallback);

  const totalLendValue = compactCurrency(
    collateralInAmount
      .times(collateral.price)
      .plus(assetInAmount.times(asset.price)),
  );

  const defaultObj = (
    allowance0TXID: string,
    allowance1TXID: string,
    allowance2TXID: string,
    depositTXID: string,
    deposit1TXID: string,
    depositComponent: JSX.Element,
  ): AddTransaction => {
    const tx: AddTransaction = {
      title: `Confirm Deposit`,
      type: 'Lending',
      verb: `${asset.symbol} lent successfully`,
      txType: 'liquidity',
      transactions: [
        {
          uuid: allowance0TXID,
          description: `Checking your ${asset.symbol} allowance`,
          status: 'WAITING',
          actionName: `Approve ${asset.symbol}`,
          action: () => assetApprovalFn(allowance0TXID, allowance1TXID),
        },
        {
          uuid: allowance1TXID,
          description: `Checking your ${collateral.symbol} allowance`,
          status: 'WAITING',
          actionName: `Approve ${collateral.symbol}`,
          action: () => collateralApprovalFn(allowance1TXID),
        },
        {
          uuid: depositTXID,
          description: `Lend ${asset.symbol}`,
          status: 'WAITING',
          actionName: 'Confirm Deposit',
          action: () =>
            depositFn(depositTXID, poolHash ? allowance2TXID : undefined),
        },
      ],
      transactionComponent: depositComponent,
    };
    if (poolHash) {
      tx.transactions.push(
        {
          uuid: allowance2TXID,
          description: `Approve your credit position`,
          status: 'WAITING',
          actionName: 'Approve CP',
          action: () => creditPositionApproval(allowance2TXID),
        },
        {
          uuid: deposit1TXID,
          description: `Deposit to Farm`,
          status: 'WAITING',
          actionName: 'Farm LP',
          action: () => farmFn(deposit1TXID),
        },
      );
    }
    return tx;
  };

  const theme = useTheme();

  const dailyYield = Math.pow(
    new BigNumber(apr ?? 0).plus(1).toNumber(),
    1 / 365,
  );

  const loanTerm = new BigNumber(maturity).minus(dateCreated).toNumber();

  // Calculated using metrics.APR, taking into account the full loan term
  const positionYield = new BigNumber(
    Math.pow(dailyYield, new BigNumber(loanTerm).div(86400).toNumber()),
  ).minus(1);

  const sendSlippageInc = new BigNumber(100).plus(slippage).div(100);
  const lendComponent = useMemo(() => {
    return (
      <>
        <Box display="flex" flexDirection="column" gap="8px" marginTop="24px">
          <Typography
            variant="body-small-regular"
            color={theme.palette.neutrals[15]}
          >
            Deposit Summary
          </Typography>
          <SubCard padding="16px">
            <HorizontalInfo
              header="Total LP Amount"
              value={`$${totalLendValue}`}
            />
            <HorizontalInfo
              header={`Amount of ${collateral.symbol} ${
                priorityAsset === 0 ? '(Max)' : ''
              }`}
              value={
                <CoinBalance
                  token={collateral}
                  value={
                    priorityAsset === 1
                      ? collateralInAmount
                      : collateralInAmount.times(sendSlippageInc)
                  }
                  showUSD={true}
                />
              }
            />
            <HorizontalInfo
              header={`Amount of ${asset.symbol} ${
                priorityAsset === 1 ? '(Max)' : ''
              }`}
              value={
                <CoinBalance
                  token={asset}
                  value={
                    priorityAsset === 0
                      ? assetInAmount
                      : assetInAmount.times(sendSlippageInc)
                  }
                  showUSD={true}
                />
              }
            />
            <HorizontalInfo
              header={'Fees'}
              value={
                <CoinBalance
                  token={asset}
                  value={lpFees.div(Math.pow(10, asset.decimals))}
                  showUSD={true}
                />
              }
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
              header="LP tokens"
              value={`${formatCurrency(
                new BigNumber(liquidity).div(Math.pow(10, 18)).toFixed(0),
              )}`}
            />
            <HorizontalInfo
              header="Max APR"
              value={`${formatCurrency(Number(apr) * 100)}%`}
            />
            <HorizontalInfo
              header="LP yield"
              value={`${formatCurrency(
                (positionYield ?? '0').times(100).toString(),
              )}%`}
            />
            <HorizontalInfo
              header="Expiry date"
              value={`${formatTimestamp(maturity.toString())}`}
            />
            <HorizontalInfo
              header="Loan term"
              value={`${formatCurrency(
                (Number(maturity) - Date.now() / 1000) / 86400,
              )} days`}
            />
          </InfoCard>
        </Box>
      </>
    );
  }, [
    asset,
    collateral,
    assetInAmount,
    collateralInAmount,
    liquidity,
    apr,
    maturity,
    lpFees,
  ]);

  const startTransactions = useCallback(async () => {
    const allowance0TXID = uuid();
    const allowance1TXID = uuid();
    const allowance2TXID = uuid();
    const lpTXID = uuid();
    const farmTXID = uuid();
    resetState();
    addTransaction(
      defaultObj(
        allowance0TXID,
        allowance1TXID,
        allowance2TXID,
        lpTXID,
        farmTXID,
        lendComponent,
      ),
    );
    handleCloseParent();
    setTimeout(() => {
      getConvenienceApproval(
        asset,
        chainId,
        web3,
        account as string,
        assetInAmount,
        setTransactionStatus,
        allowance0TXID,
        () => afterAssetApprovalCallback(allowance1TXID),
      );
    });
  }, [
    addTransaction,
    resetState,
    defaultObj,
    lendComponent,
    handleCloseParent,
    asset,
    collateral,
    assetInAmount,
    collateralInAmount,
    chainId,
    web3,
    account,
    setTransactionStatus,
    getConvenienceApproval,
    afterAssetApprovalCallback,
  ]);

  return startTransactions;
};
