import React, { useCallback, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import { isPoolMatured } from 'functions/credit/utils';
import { Due, CreditPair, CreditPool } from 'types/credit';
import { formatCurrency, formatTimestampToDate } from '@utils/index';
import SubCard from 'components/componentLibrary/Card/SubCard';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import { useRepayQuote } from 'hooks/credit/repay/useRepayQuote';
import { useRepayTransactionsDispatch } from 'hooks/credit/repay/repayTransactions/useRepayTransactions';
import { Box, Link, Typography } from '@mui/material';
import CoinBalance from '@components/componentLibrary/CoinBalance';
import { useBorrowedPositions } from '@functions/credit';
import { useCreditPositions } from '@functions/credit/creditPositions';
import { OPENSEA_URL } from '@constants/index';
import { CREDIT_POSITION_ADDRESS } from '@constants/contracts/addresses';
import { OpenInNew } from '@mui/icons-material';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import {
  useBorrowedAmountForPosition,
  useCreditPositionMetrics,
} from '@graph/core/hooks/credit';
import XCaliInput from '@components/componentLibrary/XCaliInput';
import { useTokenBalance } from 'hooks/useTokenBalances';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme } from '@mui/material';
import { givenMaxAssetsIn } from '@functions/credit/helpers/Pay';
export interface BorrowPositionCardProps {
  position: {
    pair: CreditPair;
    pool: CreditPool;
    due: Due;
    maturity: number;
    borrowedPositions: Array<{
      id: string;
      borrowAmount: string;
    }>;
  };
  index: number;
}

export default function BorrowPositionCard({
  position,
  index,
}: BorrowPositionCardProps) {
  const theme = useTheme();

  const [repaySelected, setRepaySelected] = useState(false);
  const [value, setValue] = useState<string | undefined>();

  const valueBN = new BigNumber(value ?? 0);

  const { chainId } = useActiveWeb3React();
  const { pair, pool, due, maturity } = position;
  const { mutate: mutateCreditPositions } = useCreditPositions();
  const { mutate: mutateBorrowedPositions } = useBorrowedPositions();
  // ui calcs
  const quote = useRepayQuote(
    due?.debt,
    due?.collateral,
    due.debt.toFixed(),
    '0',
    0,
  );

  const { data: balance = new BigNumber(0) } = useTokenBalance(
    pair.asset.address,
  );

  const partialRepayError = useMemo(() => {
    if (valueBN.lt(0)) return 'Repay amount must be greater than zero';
    if (valueBN.gt(due.debt)) return 'Repay amount cannot exceed debt';
    if (valueBN.gt(balance)) return 'Insufficient asset balance';
  }, [valueBN, due, balance]);

  const collateralOut = givenMaxAssetsIn([due], [valueBN]);

  const {
    data: borrowedAmount = {
      borrowAmount: new BigNumber(1),
      debt: new BigNumber(0),
    },
    isValidating: loadingBorrowedAmount,
  } = useBorrowedAmountForPosition(position?.due?.position?.positionIndex);

  const positionInfo = {
    id: due.position?.positionIndex,
    apr: pool.maxAPR as BigNumber,
    maturity: pool.maturity,
    position0: new BigNumber(quote.amount1).toFixed(5),
    symbol0: pair.collateral.symbol,
    position1: new BigNumber(due.debt).toFixed(5),
    symbol1: pair.asset.symbol,
  };

  const { data: metrics, isValidating: isAPRLoading } =
    useCreditPositionMetrics(due.position?.positionIndex as string);

  const dailyYield = Math.pow(
    new BigNumber(metrics?.APR ?? 0).div(100).plus(1).toNumber(),
    1 / 365,
  );

  const loanTerm = new BigNumber(maturity).minus(pool?.dateCreated).toNumber();

  const positionYield = new BigNumber(
    Math.pow(dailyYield, new BigNumber(loanTerm).div(86400).toNumber()),
  ).minus(1);

  const callBack = useCallback(
    (err?: any) => {
      if (!err) {
        mutateCreditPositions();
        mutateBorrowedPositions();
      }
    },
    [mutateCreditPositions, mutateBorrowedPositions],
  );

  const repayDispatch = useRepayTransactionsDispatch(
    pair.asset,
    pair.collateral,
    new BigNumber(pool.maturity),
    valueBN,
    collateralOut[0],
    (due?.position?.positionIndex as string).toString(),
    callBack,
    () => {},
  );

  return (
    <SubCard>
      <Link
        display="flex"
        flexDirection="row"
        gap="6px"
        alignItems="center"
        marginBottom="8px"
        sx={{ cursor: 'pointer', textDecoration: 'none' }}
        target={'_blank'}
        href={`${OPENSEA_URL[chainId]}${CREDIT_POSITION_ADDRESS[chainId]}/${positionInfo.id}`}
      >
        <Typography fontSize={'16px'} fontWeight="800" color="white">
          {`Borrow Position #${positionInfo.id}`}
        </Typography>
        <OpenInNew sx={{ fontSize: '20px' }} />
      </Link>
      <Box display="flex" flexDirection="column" gap="24px">
        <Box display="flex" flexDirection="column" gap="12px">
          <HorizontalInfo
            header={'Expiry time'}
            value={formatTimestampToDate(positionInfo.maturity * 1000)}
          />
          <HorizontalInfo
            header={'Borrowed amount'}
            isLoading={loadingBorrowedAmount}
            value={
              <CoinBalance
                token={pair.asset}
                value={new BigNumber(borrowedAmount.borrowAmount).div(
                  Math.pow(10, position?.pair?.asset?.decimals),
                )}
                showLogo={true}
                showUSD={true}
              />
            }
          />
          <HorizontalInfo
            header={'Total debt'}
            value={
              <CoinBalance
                token={pair.asset}
                value={due.debt}
                showLogo={true}
                showUSD={true}
              />
            }
          />
          <HorizontalInfo
            header={'Wallet balance'}
            value={
              <CoinBalance
                token={pair.asset}
                value={balance}
                showLogo={true}
                showUSD={true}
              />
            }
          />
          <HorizontalInfo
            header={'Max APR'}
            value={`${metrics ? formatCurrency(metrics.APR) : '-'}%`}
            isLoading={isAPRLoading && !metrics}
          />
          <HorizontalInfo
            header={'Interest rate'}
            value={`${metrics ? formatCurrency(positionYield) : '-'}%`}
            isLoading={(isAPRLoading && !metrics) || loadingBorrowedAmount}
          />
          <HorizontalInfo
            header={'Locked collateral'}
            value={
              <CoinBalance
                token={pair.collateral}
                value={quote.amount1}
                showLogo={true}
                showUSD={true}
              />
            }
          />
        </Box>
        {!repaySelected ? (
          <>
            {isPoolMatured(maturity) ? (
              <XCaliButton
                variant={'neutral'}
                Component={'Collateral Forfeited'}
                disabled={true}
                type="filled"
                style={{ flex: '1' }}
              />
            ) : (
              <>
                <XCaliButton
                  variant={'neutral'}
                  onClickFn={() => setRepaySelected(true)}
                  Component={'Repay'}
                  type="filled"
                  style={{ flex: '1' }}
                />
              </>
            )}
          </>
        ) : (
          <>
            <XCaliInput
              assetLabel={'Debt'}
              titleEndIcon={
                <KeyboardArrowUpIcon
                  onClick={() => setRepaySelected(false)}
                  sx={{ color: theme.palette.neutrals[15], cursor: 'pointer' }}
                />
              }
              value={value}
              setValue={setValue}
              token={{ ...pair.asset, balance: due.debt.toFixed() }}
              title="Amount to repay"
            />
            <HorizontalInfo
              header="Unlocked Collateral"
              value={
                collateralOut[0].isNaN() ? '0.00' : collateralOut[0].toFixed()
              }
            />
            {Boolean(partialRepayError) ? (
              <Typography
                variant="body-moderate-regular"
                color={theme.palette.error.main}
              >
                {partialRepayError}
              </Typography>
            ) : (
              <></>
            )}
            <XCaliButton
              variant={'neutral'}
              onClickFn={() => repayDispatch(valueBN)}
              Component={'Confirm'}
              disabled={
                Boolean(partialRepayError) || valueBN.eq(0) || valueBN.isNaN()
              }
              type="filled"
              style={{ flex: '1' }}
            />
          </>
        )}
      </Box>
    </SubCard>
  );
}
