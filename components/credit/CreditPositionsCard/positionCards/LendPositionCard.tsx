import React, { useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import BigNumber from 'bignumber.js';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import { isPoolMatured } from 'functions/credit/utils';
import { CreditPair } from 'types/credit';
import { CreditPool } from 'types/credit';
import { formatCurrency, formatTimestampToDate } from '@utils/index';
import SubCard from 'components/componentLibrary/Card/SubCard';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import VerticalInfo from 'components/componentLibrary/Info/VerticalInfo';
import { useClaimTransactionsDispatch } from 'hooks/credit/claim/claimTransactions/useClaimTransactions';
import {
  CreditPosition,
  useCreditPositions,
} from 'functions/credit/creditPositions';
import { Token } from 'types/assets';
import MultiCoinBalance from '@components/componentLibrary/MultiCoinBalances';
import CoinBalance from '@components/componentLibrary/CoinBalance';
import { CreditMath, useLentPositions } from '@functions/credit';
import { usePoolInfo } from 'hooks/credit/usePoolInfo';
import { Link, Typography } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { OPENSEA_URL } from '@constants/index';
import { CREDIT_POSITION_ADDRESS } from '@constants/contracts/addresses';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { useCreditPositionMetrics } from '@graph/core/hooks/credit';

interface LendPositionCardProps {
  position: {
    pair: CreditPair;
    pool: CreditPool;
    maturity: number;
  };
  index: number;
}

export default function LendPositionCard({
  position,
  index,
}: LendPositionCardProps) {
  const { chainId } = useActiveWeb3React();

  const { pair, pool, maturity } = position;

  const {
    loanPrincipalBalance,
    loanInterestBalance,
    coveragePrincipalBalance,
    coverageInterestBalance,
  } = useMemo(() => {
    return {
      loanPrincipalBalance: new BigNumber(
        pool?.position?.loanPrincipal?.totalAmount ?? 0,
      ),
      loanInterestBalance: new BigNumber(
        pool?.position?.loanInterest?.totalAmount ?? 0,
      ),
      coveragePrincipalBalance: new BigNumber(
        pool?.position?.coveragePrincipal?.totalAmount ?? 0,
      ),
      coverageInterestBalance: new BigNumber(
        pool?.position?.coverageInterest?.totalAmount ?? 0,
      ),
    };
  }, [pool]);

  const claimsIn = useMemo(
    () => ({
      loanPrincipal: loanPrincipalBalance,
      loanInterest: loanInterestBalance,
      coveragePrincipal: coveragePrincipalBalance,
      coverageInterest: coverageInterestBalance,
    }),
    [
      coverageInterestBalance,
      coveragePrincipalBalance,
      loanInterestBalance,
      loanPrincipalBalance,
    ],
  );

  const positionInfo = {
    title: 'Lend',
    id: pool.position?.positionIndex,
    apr: pool.maxAPR as BigNumber,
    maturity: pool.maturity,
    titlePosition0: 'Current deposit',
    position0: loanPrincipalBalance
      .div(Math.pow(10, pair.asset.decimals))
      .toFixed(4),
    symbol0: pair.asset.symbol,
    titlePosition1: '',
    position1: '',
    symbol1: '',
  };

  const currentDepositUSD = loanPrincipalBalance.div(
    Math.pow(10, pair.asset.decimals),
  );

  const creditPairInfo = usePoolInfo(pair?.address, pool?.maturity);
  const { assetOut, collateralOut } = useMemo(() => {
    if (!pool || !pair || !creditPairInfo)
      return { assetOut: new BigNumber(0), collateralOut: new BigNumber(0) };
    const { assetOut, collateralOut } = CreditMath.withdraw(
      creditPairInfo.assetReserve.times(
        Math.pow(10, pair.asset.decimals),
      ) as BigNumber,
      creditPairInfo.collateralReserve.times(
        Math.pow(10, pair.collateral.decimals),
      ) as BigNumber,
      creditPairInfo?.totalClaims,
      claimsIn,
    );

    const assetOutAdjusted = assetOut.div(Math.pow(10, pair.asset.decimals));
    const collateralOutAdjusted = collateralOut.div(
      Math.pow(10, pair.collateral.decimals),
    );
    return {
      assetOut: assetOutAdjusted,
      collateralOut: collateralOutAdjusted,
    };
  }, [pool, claimsIn, creditPairInfo, pair]);

  const { data: metrics, isValidating: isAPRLoading } =
    useCreditPositionMetrics(pool.position?.positionIndex as string);

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

  const dispatch = useClaimTransactionsDispatch(
    pair.asset,
    pair.collateral,
    new BigNumber(pool.maturity),
    pool.position as CreditPosition,
    callBack,
    assetOut,
    collateralOut,
  );

  const renderLendInfo = () => {
    return (
      <>
        <Box border="1px solid #3D3D3D" />
        <VerticalInfo
          header={'Redeemable Amounts:'}
          gap="8px"
          value={
            <MultiCoinBalance
              tokens={[pair?.asset as Token, pair?.collateral as Token]}
              values={[assetOut, collateralOut]}
              showUSD={true}
              andOr={'AND'}
            />
          }
        />
      </>
    );
  };

  const withdrawDate = formatTimestampToDate(Number(pool?.maturity ?? 0) * 1000)
    .split(' ')
    .slice(1, 4)
    .reduce((prev, curr) => prev + ' ' + curr, '');

  const dailyYield = Math.pow(
    new BigNumber(metrics?.APR ?? 0).div(100).plus(1).toNumber(),
    1 / 365,
  );

  const loanTerm = new BigNumber(pool?.maturity)
    .minus(pool?.dateCreated)
    .toNumber();

  // Calculated using metrics.APR, taking into account the full loan term
  const positionYield = new BigNumber(
    Math.pow(dailyYield, new BigNumber(loanTerm).div(86400).toNumber()),
  ).minus(1);

  return (
    <SubCard gap="24px">
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
          {`Lend Position #${positionInfo.id}`}
        </Typography>
        <OpenInNew sx={{ fontSize: '20px' }} />
      </Link>
      <Box display="flex" flexDirection="column" gap="12px">
        <HorizontalInfo
          header={'Expiry time'}
          value={formatTimestampToDate(positionInfo.maturity * 1000)}
        />
        <HorizontalInfo
          header={'Max APR'}
          value={`${metrics ? formatCurrency(metrics.APR) : '-'}%`}
          isLoading={isAPRLoading && !metrics}
        />
        <HorizontalInfo
          header={'Lender yield'}
          value={`${
            metrics
              ? formatCurrency(new BigNumber(positionYield).times(100))
              : '-'
          }%`}
          isLoading={isAPRLoading && !metrics}
        />
        <HorizontalInfo
          header={positionInfo?.titlePosition0}
          value={
            <CoinBalance
              token={pair.asset}
              value={currentDepositUSD}
              showUSD={true}
              showLogo={true}
            />
          }
        />
        <HorizontalInfo
          header={'Total collateral'}
          value={
            <CoinBalance
              token={pair.collateral}
              value={coveragePrincipalBalance
                .plus(coverageInterestBalance)
                .div(Math.pow(10, pair?.collateral?.decimals))}
              showUSD={true}
              showLogo={true}
            />
          }
          isLoading={isAPRLoading && !metrics}
        />
      </Box>
      {renderLendInfo()}
      <XCaliButton
        variant={'neutral'}
        onClickFn={dispatch}
        disabled={!isPoolMatured(maturity)}
        Component={`Redeem - ${withdrawDate}`}
        type="filled"
      />
    </SubCard>
  );
}
