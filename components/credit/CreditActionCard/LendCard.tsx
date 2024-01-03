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
import { useToken } from 'hooks/useToken';
import BigNumber from 'bignumber.js';
import { useLendQuote } from 'hooks/credit/lend/useLendQuote';
import {
  compactCurrency,
  formatCurrency,
  formatTimestampToDays,
} from '@utils/index';
import { useLendTransactionDispatch } from 'hooks/credit/lend/lendTransactions/useLendTransactions';
import { Box, Typography, useTheme } from '@mui/material';
import CoinBalance from '@components/componentLibrary/CoinBalance';
import { useCreditPositions } from '@functions/credit/creditPositions';
import { useLentPositions } from '@functions/credit';
import { BIG_NUMBER_ZERO } from '@constants/index';
import { usePoolInfo } from 'hooks/credit/usePoolInfo';
import { APRSlider } from '@components/componentLibrary/APRSlider';

type LendingCardProps = {
  pair: CreditPair;
  maturity: number;
  setMaturity: Dispatch<SetStateAction<number>>;
  type: Type;
  handleCloseModal: any;
  selectedPool: CreditPool;
};

export default function LendCard({
  pair,
  maturity,
  setMaturity,
  type,
  handleCloseModal,
  selectedPool,
}: LendingCardProps) {
  const creditPairInfo = usePoolInfo(
    pair?.address,
    selectedPool?.maturity,
  );
  if (selectedPool && creditPairInfo) {
    selectedPool = { ...selectedPool, ...creditPairInfo };
  }
  const { mutate: mutateCreditPositions } = useCreditPositions();
  const { mutate: mutateLentPositions } = useLentPositions();
  const callBack = useCallback(
    (err?: any) => {
      if (!err) {
        mutateCreditPositions();
        mutateLentPositions();
      }
    },
    [mutateCreditPositions, mutateLentPositions],
  );

  const [assetIn, setAssetIn] = useState<string>();

  const assetToken = useToken(pair?.asset?.address);

  const [aprPercent, setAPRPercent] = useState(50);
  const assetInBN = new BigNumber(assetIn ?? '0').times(
    Math.pow(10, pair?.asset?.decimals),
  );

  const { insurance, bond, apr, lendPercent, lendFees } = useLendQuote(
    pair,
    selectedPool,
    assetInBN,
    aprPercent,
  );

  const errorMessage = useMemo(() => {
    if (new BigNumber(assetIn ?? 0).lte(0) || isNaN(Number(assetIn))) {
      return '';
    } else if (
      pair?.asset &&
      new BigNumber(assetIn ?? 0).gt(assetToken?.balance ?? 0)
    ) {
      return `Greater than your available balance`;
    }
    return null;
  }, [assetIn, pair?.asset, assetToken?.balance]);

  const dispatch = useLendTransactionDispatch(
    apr.times(100),
    handleCloseModal,
    pair?.asset,
    pair?.collateral,
    new BigNumber(selectedPool?.maturity),
    new BigNumber(assetIn ?? '0'),
    bond,
    insurance,
    lendPercent,
    lendFees,
    '10',
    '1',
    callBack,
    selectedPool?.dateCreated,
  );

  const theme = useTheme();

  const aprRisky = apr.times(100).lt(10);
  const aprModerate = !aprRisky && apr.times(100).lt(30);

  const safe = !aprRisky && !aprModerate;
  const moderate = !safe && aprModerate;

  return (
    <Card fontSize="l" header="Lend" onClose={handleCloseModal}>
      <MaturityTab
        type={type}
        value={maturity}
        setValue={setMaturity}
        pair={pair}
      />
      <XCaliInput
        value={assetIn}
        setValue={setAssetIn}
        token={{ ...pair?.asset, balance: assetToken?.balance }}
        title="Amount to lend"
      />
      <APRSlider
        status={safe ? 'Safe' : moderate ? 'Moderate' : 'Risky'}
        apr={aprPercent}
        setAPR={(val) => setAPRPercent(val)}
        color="lend"
      />
      <InfoCard display="flex" flexDirection="column">
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
          header="Loan term"
          value={`${formatTimestampToDays(selectedPool?.maturity)}`}
        />
        <HorizontalInfo
          header="Total deposit"
          value={`$${compactCurrency(
            new BigNumber(assetIn ?? '0').times(pair?.asset?.price),
          )}`}
        />
        <HorizontalInfo
          header="Fees"
          value={
            <CoinBalance
              token={pair.asset}
              value={lendFees.div(Math.pow(10, pair?.asset?.decimals))}
              showLogo={true}
              showUSD={true}
            />
          }
        />
        <HorizontalInfo
          header="Amount at expiry"
          value={
            <CoinBalance
              token={pair?.asset}
              value={
                !bond.isNaN() && bond?.isPositive()
                  ? bond.div(10 ** Number(pair?.asset?.decimals))
                  : new BigNumber(0)
              }
              showLogo={true}
              showUSD={true}
            />
          }
        />
        <HorizontalInfo
          header="Insurance coverage"
          value={
            <CoinBalance
              token={pair?.collateral}
              value={
                !insurance.isNaN() && insurance?.isPositive()
                  ? insurance.div(10 ** Number(pair?.collateral.decimals))
                  : BIG_NUMBER_ZERO
              }
              showLogo={true}
              showUSD={true}
            />
          }
          toolTipText="The amount of coverage you are receiving for your loan. Should ALL borrowers default, the collateral in the pool will be used as insurance coverage"
        />
      </InfoCard>
      {errorMessage && (
        <Typography variant="body-small-regular" color="red" textAlign="center">
          {errorMessage}
        </Typography>
      )}
      <XCaliButton
        disabled={
          Boolean(errorMessage) || new BigNumber(assetIn ?? '-').isNaN()
        }
        variant="blue"
        Component="Lend"
        type="filled"
        onClickFn={dispatch}
      />
    </Card>
  );
}
