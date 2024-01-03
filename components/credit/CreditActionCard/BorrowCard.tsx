import { Box, Typography, useTheme } from '@mui/material';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import MaturityTab from '../MaturityTab';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import XCaliInput from 'components/componentLibrary/XCaliInput';
import Card from 'components/componentLibrary/Card';
import { CreditPair, CreditPool } from 'types/credit';
import { Type } from '../Pools';
import InfoCard from 'components/componentLibrary/Card/InfoCard';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import { formatCurrency, formatTimestampToDays } from '@utils/index';
import BigNumber from 'bignumber.js';
import { useBorrowQuote } from 'hooks/credit/borrow/useBorrowQuote';
import SubCard from 'components/componentLibrary/Card/SubCard';
import { useToken } from 'hooks/useToken';
import { useBorrowTransactionsDispatch } from 'hooks/credit/borrow/borrowTransactions/useBorrowTransactions';
import CoinBalance from '@components/componentLibrary/CoinBalance';
import { useCreditPositions } from '@functions/credit/creditPositions';
import { useBorrowedPositions } from '@functions/credit';
import { usePoolInfo } from 'hooks/credit/usePoolInfo';
import { getBorrowLimit } from '@functions/credit/helpers/BorrowMath';
import { APRSlider } from '@components/componentLibrary/APRSlider';

type BorrowCardProps = {
  pair: CreditPair;
  maturity: number;
  setMaturity: Dispatch<SetStateAction<number>>;
  type: Type;
  handleCloseModal: any;
  selectedPool: CreditPool;
};

export default function BorrowCard({
  pair,
  maturity,
  setMaturity,
  type,
  handleCloseModal,
  selectedPool,
}: BorrowCardProps) {
  const creditPairInfo = usePoolInfo(
    pair?.address,
    selectedPool?.maturity,
  );
  if (selectedPool && creditPairInfo) {
    selectedPool = { ...selectedPool, ...creditPairInfo };
  }
  const { mutate: mutateCreditPositions } = useCreditPositions();
  const { mutate: mutateBorrowedPositions } = useBorrowedPositions();
  const callBack = useCallback(
    (err?: any) => {
      if (!err) {
        mutateCreditPositions();
        mutateBorrowedPositions();
      }
    },
    [mutateCreditPositions, mutateBorrowedPositions],
  );

  const theme = useTheme();
  const [assetOut, setAssetOut] = useState<string>();

  const assetToken = useToken(selectedPool?.pair?.asset.address);
  const collateralToken = useToken(selectedPool?.pair?.collateral.address);

  const [aprPercent, setAPRPercent] = useState(50);
  const assetOutBN = new BigNumber(assetOut ?? '0').times(
    Math.pow(10, pair.asset.decimals),
  );
  const amountTooHigh = new BigNumber(assetOut ?? '0').gt(
    selectedPool?.assetReserve || 0,
  );

  const borrowLimit = getBorrowLimit(
    selectedPool?.X,
    new BigNumber(selectedPool.maturity),
    pair.fee,
    pair.protocolFee,
    pair.stakingFee,
    new BigNumber(Date.now() / 1000),
  ).div(Math.pow(10, pair.asset.decimals));

  const { dueOut, cdp, apr, borrowPercent, isInvalid, borrowFees } =
    useBorrowQuote(
      pair,
      selectedPool,
      amountTooHigh ? new BigNumber(0) : assetOutBN,
      aprPercent,
    );

  const errorMessage = useMemo(() => {
    if (assetOutBN.lte(0) || assetOutBN.isNaN()) {
      return '';
    } else if (
      pair.collateral &&
      dueOut.collateral
        .div(Math.pow(10, pair.collateral.decimals))
        .gt(collateralToken?.balance ?? 0)
    ) {
      return 'Balance too low';
    } else if (isInvalid || dueOut.collateral.lte(0) || dueOut.debt.lte(0)) {
      return 'Invalid transaction';
    }

    return null;
  }, [assetOutBN, isInvalid, pair, collateralToken, dueOut]);

  const dispatch = useBorrowTransactionsDispatch(
    apr.times(100),
    cdp,
    handleCloseModal,
    pair.asset,
    pair.collateral,
    new BigNumber(selectedPool?.maturity),
    new BigNumber(assetOut ?? '0'),
    dueOut,
    borrowPercent,
    borrowFees,
    '10',
    '1',
    selectedPool?.dateCreated,
    callBack,
  );

  const cdpRisky = cdp.times(100).lt(100);
  const aprRisky = apr.times(100).gt(15);
  const aprModerate = !aprRisky && apr.times(100).gt(10);

  const safe = !cdpRisky && !aprRisky && !aprModerate;
  const moderate = !safe && aprModerate;
  // const risky = !safe && !moderate

  return (
    <Card fontSize="l" header="Borrow" onClose={handleCloseModal}>
      <MaturityTab
        value={maturity}
        setValue={setMaturity}
        pair={pair}
        type={type}
      />
      <XCaliInput
        token={{ ...pair.asset, balance: assetToken?.balance }}
        value={assetOut}
        setValue={setAssetOut}
        title="Amount to Borrow"
        hideBalances={true}
      />
      <Box>
        <Typography
          variant="body-small-regular"
          color={theme.palette.neutrals[15]}
        >
          Borrow limit
        </Typography>
        <SubCard>
          <HorizontalInfo
            header={selectedPool.pair.asset.symbol}
            value={formatCurrency(borrowLimit)}
            type="medium"
          />
        </SubCard>
      </Box>
      <APRSlider
        status={safe ? 'Safe' : moderate ? 'Moderate' : 'Risky'}
        apr={aprPercent}
        setAPR={(val) => setAPRPercent(val)}
        color="borrow"
      />
      <InfoCard display="flex" flexDirection="column">
        <HorizontalInfo
          header="CDP"
          value={
            <Box display="flex" flexDirection="row" gap="2px">
              <Typography
                variant="body-moderate-numeric"
                color={theme.palette.neutrals[15]}
              >
                {`${formatCurrency(
                  selectedPool.minCDP?.times(100),
                ).toString()}%`}
              </Typography>
              <Typography
                variant="body-moderate-numeric"
                color={theme.palette.neutrals[15]}
              >
                {'->'}
              </Typography>
              <Typography color={'white'} variant={'body-moderate-numeric'}>
                {`${formatCurrency((cdp.times(100) ?? '0').toString())}%`}
              </Typography>
            </Box>
          }
        />
        <HorizontalInfo
          header="Max APR"
          value={
            <Box display="flex" flexDirection="row" gap="2px">
              <Typography
                variant="body-moderate-numeric"
                color={theme.palette.neutrals[15]}
              >
                {`${formatCurrency(selectedPool.maxAPR).toString()}%`}
              </Typography>
              <Typography
                variant="body-moderate-numeric"
                color={theme.palette.neutrals[15]}
              >
                {'->'}
              </Typography>
              <Typography color={'white'} variant="body-moderate-numeric">
                {`${formatCurrency((apr.times(100) ?? '0').toString())}%`}
              </Typography>
            </Box>
          }
        />
        <HorizontalInfo
          header="Collateral to lock"
          value={
            <CoinBalance
              token={pair.collateral}
              value={
                !dueOut.collateral.isNaN()
                  ? dueOut.collateral.div(
                      10 ** Number(pair.collateral.decimals),
                    )
                  : new BigNumber(0)
              }
              showLogo={true}
              showUSD={true}
            />
          }
        />
        <HorizontalInfo
          header="Debt to repay"
          value={
            <CoinBalance
              token={pair.asset}
              value={
                !dueOut.debt.isNaN()
                  ? dueOut.debt.div(10 ** Number(pair.asset.decimals))
                  : new BigNumber(0)
              }
              showLogo={true}
              showUSD={true}
            />
          }
        />
        <HorizontalInfo
          header="Fees"
          value={
            <CoinBalance
              token={pair.asset}
              value={borrowFees.div(Math.pow(10, pair?.asset?.decimals))}
              showLogo={true}
              showUSD={true}
            />
          }
        />
        <HorizontalInfo
          header="Loan term"
          value={formatTimestampToDays(selectedPool?.maturity)}
        />
      </InfoCard>

      {errorMessage && (
        <Typography variant="body-small-regular" color="red" textAlign="center">
          {errorMessage}
        </Typography>
      )}
      <XCaliButton
        variant="yellow"
        disabled={
          Boolean(errorMessage) || new BigNumber(assetOut ?? '-').isNaN()
        }
        Component="Borrow"
        type="filled"
        onClickFn={dispatch}
      />
    </Card>
  );
}
