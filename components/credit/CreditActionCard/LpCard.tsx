import { Box, useTheme } from '@mui/material';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import MaturityTab from '../MaturityTab';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import XCaliInput from 'components/componentLibrary/XCaliInput';
import XCaliAddIcon from 'components/componentLibrary/AddIcon';
import { CreditPair, CreditPool } from 'types/credit';
import Card from 'components/componentLibrary/Card';
import { Type } from '../Pools';
import InfoCard from 'components/componentLibrary/Card/InfoCard';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import { useToken } from 'hooks/useToken';
import { useQuoteAddLiquidityCredit } from 'hooks/liquidity/quotes/useQuoteAddLiquidityCredit';
import BigNumber from 'bignumber.js';
import {
  compactCurrency,
  formatCurrency,
  formatTimestampToDays,
} from '@utils/index';
import { useLiquidityCreateTransactionDispatch } from 'hooks/liquidity/transactions/addLiqTransactions/useAddLiqTransactions';
import { useCurrentBlockTimestamp } from 'hooks/useCurrentBlockTimestamp';
import { ChainIds } from '@constants/chains';
import { useCreditPositions } from '@functions/credit/creditPositions';
import { useLiquidityPositions } from '@functions/liquidity/liquidityPairs';
import { usePoolInfo } from 'hooks/credit/usePoolInfo';
import { mulDivUp } from '@functions/credit/helpers/math';
import CoinBalance from '@components/componentLibrary/CoinBalance';

type LPCardProps = {
  pair: CreditPair;
  maturity: number;
  setMaturity: Dispatch<SetStateAction<number>>;
  type: Type;
  handleCloseModal: any;
  selectedPool: CreditPool;
};

export default function LpCard({
  pair,
  maturity,
  setMaturity,
  type,
  handleCloseModal,
  selectedPool,
}: LPCardProps) {
  const creditPairInfo = usePoolInfo(
    pair?.address,
    selectedPool?.maturity,
  );
  if (selectedPool && creditPairInfo) {
    selectedPool = { ...selectedPool, ...creditPairInfo };
  }

  const { mutate: mutateCreditPositions } = useCreditPositions();
  const { mutate: mutateLiquidityPositions } = useLiquidityPositions();
  const callBack = useCallback(
    (err?: any) => {
      if (!err) {
        mutateCreditPositions();
        mutateLiquidityPositions();
      }
    },
    [mutateCreditPositions, mutateLiquidityPositions],
  );

  const assetToken = useToken(selectedPool?.pair?.asset?.address);
  const collateralToken = useToken(selectedPool?.pair?.collateral?.address);
  const [priorityAsset, setPriorityAsset] = useState<0 | 1>(0);

  const [amount0, setAmount0] = useState<string>();
  const [amount1, setAmount1] = useState<string>();

  const setAssetValue = (val: string) => {
    setPriorityAsset(0);
    setAmount0(val);
  };

  const setCollateralValue = (val: string) => {
    setPriorityAsset(1);
    setAmount1(val);
  };

  const { data: blocktimestamp = 0 } = useCurrentBlockTimestamp();

  const expiredPool = useMemo(() => {
    return (
      Number(selectedPool?.maturity) * 1000 <=
      (ChainIds.LOCALHOST ? blocktimestamp * 1000 : Date.now())
    );
  }, [selectedPool?.maturity, blocktimestamp]);

  const {
    debt,
    liquidityMinted,
    amount0: assetAmt,
    amount1: collateralAmount,
    numDays,
    apr,
  } = useQuoteAddLiquidityCredit(
    priorityAsset === 0 ? amount0 ?? '0' : amount1 ?? '0',
    selectedPool?.X,
    selectedPool?.Y,
    selectedPool?.Z,
    selectedPool?.maturity,
    selectedPool?.totalSupply ?? new BigNumber(0),
    selectedPool?.feeStored ?? new BigNumber(0),
    priorityAsset,
    expiredPool,
    pair.asset,
    pair.collateral,
  );

  const lpFee = useMemo(() => {
    if (!selectedPool || liquidityMinted.lte(0)) return new BigNumber(0);
    //TODO - fix type errors
    //@ts-ignore
    return mulDivUp(
      selectedPool.feeStored ?? new BigNumber(0),
      liquidityMinted,
      selectedPool.totalSupply ?? new BigNumber(1),
    );
  }, [selectedPool, liquidityMinted]);

  useEffect(() => {
    if (priorityAsset === 0) {
      if (amount0 === '') {
        setAmount1('');
      }
    } else {
      if (amount1 === '') {
        setAmount0('');
      }
    }
  }, [priorityAsset, amount0, amount1]);

  useEffect(() => {
    if (priorityAsset === 0) {
      setAmount1(
        collateralAmount.div(Math.pow(10, pair.collateral.decimals)).toString(),
      );
    } else {
      setAmount0(assetAmt.div(Math.pow(10, pair.asset.decimals)).toString());
    }
  }, [assetAmt, collateralAmount, priorityAsset, pair]);

  const collateralPrice = collateralAmount
    .div(Math.pow(10, pair.collateral.decimals))
    .times(pair.collateral.price);
  const assetPrice = assetAmt
    .div(Math.pow(10, pair.asset.decimals))
    .times(pair.asset.price);

  const dispatch = useLiquidityCreateTransactionDispatch(
    apr.toFixed(),
    pair.asset,
    pair.collateral,
    new BigNumber(amount0 ?? '0'),
    new BigNumber(amount1 ?? '0'),
    selectedPool?.maturity?.toString(),
    debt.div(Math.pow(10, pair.asset.decimals)).toFixed(),
    '10',
    liquidityMinted.toFixed(),
    lpFee,
    '1',
    callBack,
    handleCloseModal,
    priorityAsset,
    selectedPool?.dateCreated,
    selectedPool?.farm?.poolHash,
  );

  const theme = useTheme();

  const dailyYield = Math.pow(
    new BigNumber(apr ?? 0).plus(1).toNumber(),
    1 / 365,
  );

  const loanTerm = new BigNumber(selectedPool?.maturity)
    .minus(selectedPool?.dateCreated)
    .toNumber();

  // Calculated using metrics.APR, taking into account the full loan term
  const positionYield = new BigNumber(
    Math.pow(dailyYield, new BigNumber(loanTerm).div(86400).toNumber()),
  ).minus(1);

  return (
    <Card header="Provide Liquidity" fontSize="l" onClose={handleCloseModal}>
      <MaturityTab
        type={type}
        value={maturity}
        setValue={setMaturity}
        pair={pair}
      />
      <Box>
        <Box
          display="flex"
          flexDirection="column"
          gap="16px"
          alignItems="center"
        >
          <XCaliInput
            value={amount0}
            setValue={setAssetValue}
            token={{ balance: assetToken?.balance, ...pair.asset }}
            title="Deposit amount"
          />
          <XCaliAddIcon
            innerColor={theme.palette.brand.pink.normal}
            outerColor={theme.palette.brand.pink.dark}
          />
        </Box>
        <XCaliInput
          value={amount1}
          setValue={setCollateralValue}
          title="Deposit amount"
          token={{ balance: collateralToken?.balance, ...pair.collateral }}
        />
      </Box>

      <InfoCard display="flex" flexDirection="column">
        <HorizontalInfo
          header="Total LP amount"
          value={`$${compactCurrency(collateralPrice.plus(assetPrice))}`}
        />
        <HorizontalInfo
          header="LP tokens"
          value={liquidityMinted.div(Math.pow(10, 18)).toFixed(0)}
        />
        <HorizontalInfo
          header="Max APR"
          value={formatCurrency(apr.times(100).toFixed()) + '%'}
        />
        <HorizontalInfo
          header="LP yield"
          value={`${formatCurrency(
            (positionYield ?? '0').times(100).toString(),
          )}%`}
        />
        <HorizontalInfo
          header="Fees"
          value={
            <CoinBalance
              token={pair.asset}
              value={lpFee.div(Math.pow(10, pair?.asset?.decimals))}
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
      <XCaliButton
        onClickFn={dispatch}
        variant="pink"
        Component="Provide Liquidity"
        type="filled"
        disabled={liquidityMinted.lte(0)}
      />
    </Card>
  );
}
