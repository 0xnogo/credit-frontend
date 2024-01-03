import { Box, Skeleton, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import InfoCard from 'components/componentLibrary/Card/InfoCard';
import SubCard from 'components/componentLibrary/Card/SubCard';
import CreditMetric from 'components/componentLibrary/CreditMetric';
import { useLendingPoolDayDatas } from '@graph/core/hooks/credit';
import BigNumber from 'bignumber.js';
import { getPairFromQuery } from 'functions/credit/utils';
import { usePairFromAddresses } from 'functions/credit/utils';
import { useMemo, useState } from 'react';
import {
  compactCurrency,
  formatCurrency,
  formatTimestampToDate,
  formatToDays,
} from '@utils/index';
import {
  CustomSelect,
  StyledOption,
} from '@components/componentLibrary/XCaliSelect';
import DoubleLineChart from '@components/Chart/DoubleLineChart';
import { ParentSize } from '@visx/responsive';
import StackedAreaChart from '@components/Chart/StackedAreaChart';
import { useLentPositionsHourData } from '@functions/credit/chartingDatas';
import CoinBalance from '@components/componentLibrary/CoinBalance';
import {
  CreditPair as CreditMath,
  useLendingPairsInfo,
} from '@functions/credit';
import Image from 'next/image';
import { Token } from 'types/assets';
import { useCountdown } from 'hooks/useCountDownTimer';
import { usePoolInfo } from 'hooks/credit/usePoolInfo';
import { getBorrowLimit } from '@functions/credit/helpers/BorrowMath';
import { BIG_NUMBER_ZERO } from '@constants/index';
import { CreditPair } from 'types/credit';
import InfoIcon from '@mui/icons-material/Info';

const areaColors = ['#1D2222', '#231C20', '#252015'];

const colors = ['#98FFFF', '#FFBDE7', '#FFBD13'];

let series = [
  {
    assetValue: 5000,
    collateralValue: 1000,
    date: 1690325915,
  },
  {
    assetValue: 6000,
    collateralValue: 4000,
    date: 1693004315,
  },
  {
    assetValue: 3000,
    collateralValue: 4500,
    date: 1695682715,
  },
  {
    assetValue: 7000,
    collateralValue: 5000,
    date: 1698274715,
  },
  {
    assetValue: 4000,
    collateralValue: 2000,
    date: 1700953115,
  },
];

const PlaceHolderChart = ({ width, text }: { width: number; text: string }) => {
  return (
    <Box
      width={width}
      height="fit-content"
      position="relative"
      sx={{ pointerEvents: 'none' }}
    >
      <Typography
        margin="auto"
        position="absolute"
        top="50%"
        left="50%"
        sx={{ transform: 'translate(-50%)' }}
      >
        {text}
      </Typography>
      <Box sx={{ filter: 'blur(5px)' }} width="100%" height="100%">
        <DoubleLineChart
          series={series}
          colors={colors}
          width={width}
          height={300}
          keys={['assetValue', 'collateralValue']}
          labels={['Asset Value', 'Collateral Value']}
        />
      </Box>
    </Box>
  );
};

const MaturityCountDown = ({maturity,isLoadingPair}:{maturity:number | undefined;isLoadingPair:boolean;}) =>{

  const theme = useTheme()

  const [days, hours, minutes, seconds] = useCountdown(
    Number(maturity ?? 0),
  );

  const matured = useMemo(
    () => Date.now() / 1000 > Number(maturity ?? 0),
    [maturity, hours, minutes, seconds],
  );

  return (
    <CreditMetric
      title="Loan Term"
      data={
        !matured
          ? days === 0
            ? `${hours}:${minutes}:${seconds}`
            : formatToDays([Number(maturity)])
          : 'Expired'
      }
      color={theme.palette.neutrals[15]}
      isLoading={isLoadingPair}
      toolTipText={formatTimestampToDate(
        Number(maturity) * 1000,
      )}
    />
  )
}

interface PoolDetailPageProps {
  maturityIndex: number;
  selectMaturityIndex: any;
  creditPair: CreditPair | undefined;
}

export default function PoolDetailPage({
  maturityIndex,
  selectMaturityIndex,
  creditPair: selectedPair,
}: PoolDetailPageProps) {
  const theme = useTheme();
  const { data } = useLendingPoolDayDatas();

  const { isValidating: isLoadingPair } = useLendingPairsInfo();

  const { pools } = selectedPair || {};

  const [chartType, setChartType] = useState(0);

  let selectedPool = pools?.[maturityIndex];

  const creditPairInfo = usePoolInfo(
    selectedPair?.address,
    selectedPool?.maturity,
  );

  if (creditPairInfo && selectedPool && selectedPair) {
    selectedPool = {
      ...selectedPool,
      ...creditPairInfo,
      maxAPR: CreditMath.calculateApr(creditPairInfo.X, creditPairInfo.Y).times(
        100,
      ),
      minCDP: CreditMath.calculateCdp(
        creditPairInfo.X,
        creditPairInfo.Z,
        selectedPair.asset,
        selectedPair.collateral,
      ),
    };
  }

  const borrowLimit = useMemo(() => {
    if (!selectedPool || !selectedPair) return BIG_NUMBER_ZERO;
    return getBorrowLimit(
      selectedPool.X,
      new BigNumber(selectedPool.maturity),
      selectedPair.fee,
      selectedPair.protocolFee,
      selectedPair.stakingFee,
      new BigNumber(Date.now() / 1000),
    ).div(Math.pow(10, selectedPair.asset.decimals));
  }, [selectedPool, selectedPair]);

  const selectedPoolDayDatas = data?.filter(
    (dayData: any) =>
      dayData?.id?.includes(selectedPool?.pair?.address) &&
      dayData?.id?.includes(selectedPool?.maturity),
  );

  const hourData = useLentPositionsHourData(
    selectedPool?.pair.address,
    selectedPool?.maturity ?? 0,
  );

  const { data: hourlyPositionInfo = [] } = hourData;

  const insufficientData = useMemo(
    () => hourlyPositionInfo.length < 2,
    [hourlyPositionInfo],
  );

  const media927 = useMediaQuery('(max-width : 927px)')

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ flex: '1'}}
      minWidth="350px"
      maxWidth={media927?"100%":"720px"}
      gap="24px"
      paddingBottom="12px"
      position="relative"
    >
      <Box
        display="flex"
        gap="12px"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <SubCard
          padding="16px 16px 16px 16px"
          style={{
            maxWidth: '20%',
            flex: '1',
            background: theme.palette.neutrals[80],
            minWidth: 'max-content',
          }}
        >
          <CreditMetric
            title="APR"
            data={`${formatCurrency(
              selectedPool ? selectedPool.maxAPR?.toFixed() : 0,
              2,
            )}%`}
            color={theme.palette.neutrals[15]}
            isLoading={isLoadingPair}
          />
        </SubCard>
        <SubCard
          padding="16px 16px 16px 16px"
          style={{
            maxWidth: '20%',
            flex: '1',
            background: theme.palette.neutrals[80],
            minWidth: 'max-content',
          }}
        >
          <CreditMetric
            title="Borrow Limit"
            data={`${compactCurrency(borrowLimit)}`}
            color={theme.palette.neutrals[15]}
            isLoading={isLoadingPair}
            toolTipText="Maximum Borrow Position"
          />
        </SubCard>
        <SubCard
          padding="16px 16px 16px 16px"
          style={{
            maxWidth: '20%',
            flex: '1',
            background: theme.palette.neutrals[80],
            minWidth: 'max-content',
          }}
        >
          <CreditMetric
            title="CDP"
            data={`${formatCurrency(
              selectedPool ? selectedPool.minCDP?.times(100).toFixed() : 0,
              2,
            )}%`}
            color={theme.palette.neutrals[15]}
            isLoading={isLoadingPair}
            toolTipText="Collateralized Debt Position"
          />
        </SubCard>
        <SubCard
          padding="16px 16px 16px 16px"
          style={{
            maxWidth: '20%',
            flex: '1',
            background: theme.palette.neutrals[80],
            minWidth: 'max-content',
          }}
        >
          <MaturityCountDown maturity={selectedPool?.maturity} isLoadingPair={isLoadingPair} />
        </SubCard>
      </Box>
      <SubCard
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.neutrals[80],
          position: 'relative',
          paddingBottom: '0',
        }}
      >
        {hourData.isValidating && (
          <>
            <Image
              draggable={false}
              style={{ zIndex: 1, filter: 'blur(10px)' }}
              alt="market card"
              src="/images/charts.png"
              layout="fill"
            />
            <Skeleton
              sx={{ position: 'absolute', top: '0', left: '0', zIndex: 1 }}
              variant="rectangular"
              animation="wave"
              width="100%"
              height="100%"
            />
          </>
        )}

        <Box marginBottom="5px" width="320px">
          <CustomSelect value={chartType}>
            <StyledOption value={0} onClick={() => setChartType(0)}>
              Interest Rate Model
            </StyledOption>
            <StyledOption value={1} onClick={() => setChartType(1)}>
              Asset Value vs. Collateral Value
            </StyledOption>
            <StyledOption value={2} onClick={() => setChartType(2)}>
              Outstanding Debt vs. Repaid
            </StyledOption>
          </CustomSelect>
        </Box>
        <ParentSize>
          {({ width, height }) =>
            insufficientData ? (
              <PlaceHolderChart  width={width} text="Insufficient Data" />
            ) : chartType === 0 ? (
              <DoubleLineChart
                series={hourData.data ?? []}
                colors={[colors[1]]}
                width={width}
                height={300}
                keys={['interestRateMax']}
                labels={['Max APR']}
                dataType="percentage"
              />
            ) : // <PlaceHolderChart width={width} text="Coming Soon" />
            chartType === 2 ? (
              <StackedAreaChart
                data={hourData.data ?? []}
                colors={colors}
                areaColors={areaColors}
                width={width}
                keys={['totalRepayedUSD', 'totalBorrowedUSD']}
                labels={['Total Repayed USD', 'Total Borrowed USD']}
                height={300}
              />
            ) : (
              <DoubleLineChart
                series={hourData.data ?? []}
                colors={colors}
                width={width}
                height={300}
                keys={['assetReserveUSD', 'collateralReserveUSD']}
                labels={['Asset Value', 'Collateral Value']}
              />
            )
          }
        </ParentSize>
      </SubCard>
      <Box
        display="flex"
        gap="12px"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <SubCard
          padding="16px 16px 0px 16px"
          style={{
            maxWidth: '20%',
            flex: '1',
            background: theme.palette.neutrals[80],
          }}
          gap="0px"
        >
          <CreditMetric
            title="Asset vs Collateral"
            data={
              formatCurrency(
                new BigNumber(selectedPool?.assetReserveUSD ?? 0)
                  .div(selectedPool?.collateralReserveUSD ?? 0)
                  .toNumber() * 100,
              ) + '%'
            }
            color={theme.palette.neutrals[15]}
            isLoading={isLoadingPair}
            dataSize="16px"
            titleSize="12px"
            underlined={false}
          />
        </SubCard>
        <SubCard
          padding="16px 16px 0px 16px"
          style={{
            maxWidth: '20%',
            flex: '1',
            background: theme.palette.neutrals[80],
          }}
          gap="0px"
        >
          <CreditMetric
            title="Total Debt"
            data={`$${compactCurrency(
              selectedPool?.totalDebt
                .div(Math.pow(10, selectedPair?.asset.decimals || 18))
                .times(selectedPair?.asset.price ?? 0)
                .toFixed(),
            )}`}
            color={theme.palette.neutrals[15]}
            isLoading={isLoadingPair}
            dataSize="16px"
            titleSize="12px"
            underlined={false}
          />
        </SubCard>
        <SubCard
          padding="16px 16px 0px 16px"
          style={{
            maxWidth: '20%',
            flex: '1',
            background: theme.palette.neutrals[80],
          }}
          gap="0px"
        >
          <CreditMetric
            title="Debt Ratio"
            data={
              selectedPool?.debtRatio?.isFinite()
                ? formatCurrency(selectedPool?.debtRatio.toFixed())
                : '0'
            }
            color={theme.palette.neutrals[15]}
            isLoading={isLoadingPair}
            dataSize="16px"
            titleSize="12px"
            underlined={false}
            toolTipText="Ratio of Total Debt to Total Assets"
          />
        </SubCard>
        <SubCard
          padding="16px 16px 0px 16px"
          style={{
            maxWidth: '20%',
            flex: '1',
            background: theme.palette.neutrals[80],
          }}
          gap="0px"
        >
          <CreditMetric
            title="LP Fees"
            data={`$${compactCurrency(selectedPool?.totalFeeUSD.toFixed())}`}
            color={theme.palette.neutrals[15]}
            isLoading={isLoadingPair}
            dataSize="16px"
            titleSize="12px"
            underlined={false}
          />
        </SubCard>
      </Box>

      <SubCard
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: theme.palette.neutrals[80],
        }}
      >
        <Typography variant="body-large-regular" color="#F4F4F4">
          Pool Reserves
        </Typography>
        <Box
          display="flex"
          gap="12px"
          alignItems="center"
          flexWrap="wrap"
          justifyContent={'space-between'}
        >
          <InfoCard
            alignItems="center"
            sx={{ flex: '1', minWidth: '200px', maxWidth: '100%' }}
          >
            {isLoadingPair ? (
              <Skeleton variant="rectangular" width="100%" animation="wave" />
            ) : (
              <>
                <Typography variant="body-moderate-regular" color="#F4F4F4">
                  {selectedPair?.asset?.symbol}
                </Typography>
                <CoinBalance
                  token={selectedPair?.asset as Token}
                  value={
                    selectedPool
                      ? (selectedPool.assetReserve as BigNumber)
                      : new BigNumber(0)
                  }
                  showUSD={true}
                />
              </>
            )}
          </InfoCard>
          <InfoCard
            alignItems="center"
            sx={{ flex: '1', minWidth: '200px', maxWidth: '100%' }}
          >
            {isLoadingPair ? (
              <Skeleton variant="rectangular" width="100%" animation="wave" />
            ) : (
              <>
                <Typography variant="body-moderate-regular" color="#F4F4F4">
                  {selectedPair?.collateral?.symbol}
                </Typography>
                <CoinBalance
                  token={selectedPair?.collateral as Token}
                  value={
                    selectedPool
                      ? (selectedPool.collateralReserve as BigNumber)
                      : new BigNumber(0)
                  }
                  showUSD={true}
                />
              </>
            )}
          </InfoCard>
        </Box>
      </SubCard>
    </Box>
  );
}
