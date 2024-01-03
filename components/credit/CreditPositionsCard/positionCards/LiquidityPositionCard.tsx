import React, { useCallback, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import { isPoolMatured } from 'functions/credit/utils';
import {
  compactCurrency,
  formatCurrency,
  formatTimestampToDate,
} from '@utils/index';
import SubCard from 'components/componentLibrary/Card/SubCard';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import { useLiquidityRemoveTransactionDispatch } from 'hooks/liquidity/transactions/removeLiqTransactions/useRemoveLiqTransactions';
import { CreditPair, CreditPool, Lp } from 'types/credit';
import { Box, Divider, Link, Typography, useTheme } from '@mui/material';
import { useStakeLPTransactionDispatch } from 'hooks/liquidity/transactions/stakeLPTransactions/useStakeLPTransactions';
import { useUnstakeLPTransactionDispatch } from 'hooks/liquidity/transactions/unstakeLPTransactions/useUnstakeLPTransactions';
import { useClaimFarmRewardsTransactions } from 'hooks/liquidity/transactions/farmRewards/useClaimFarmRewardsTransactions';
import { useTokenMapping } from 'hooks/useTokenMapping';
import {
  CREDIT_POSITION_ADDRESS,
  CREDIT_TOKEN_ADDRESS,
} from '@constants/contracts/addresses';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import CoinBalance from '@components/componentLibrary/CoinBalance';
import { useCreditPositions } from '@functions/credit/creditPositions';
import { useLiquidityPositions } from '@functions/liquidity/liquidityPairs';
import { usePoolInfo } from 'hooks/credit/usePoolInfo';
import { OPENSEA_URL } from '@constants/index';
import { OpenInNew } from '@mui/icons-material';
import { CreditMath } from '@functions/credit';
import VerticalInfo from '@components/componentLibrary/Info/VerticalInfo';
import MultiCoinBalance from '@components/componentLibrary/MultiCoinBalances';
import { Token } from 'types/assets';
import { useCreditPositionMetrics } from '@graph/core/hooks/credit';

export interface LiquidityPositionProps {
  position?: {
    pair: CreditPair;
    pool: CreditPool;
    lp: Lp;
  };
  index: number;
}

export default function LiquidityPositionCard({
  position,
  index,
}: LiquidityPositionProps) {
  const { data: tokenMapping = {} } = useTokenMapping();

  const { chainId } = useActiveWeb3React();

  const { mutate: mutateCreditPositions } = useCreditPositions();
  const { mutate: mutateLiqPositions } = useLiquidityPositions();

  let { pair, pool, lp } = position || {};
  const creditPairInfo = usePoolInfo(pair?.address, pool?.maturity);

  const positionInfo = {
    title: 'Liquidity Pool',
    id: lp?.positionId,
    apr: pool?.maxAPR,
    maturity: Number(pool?.maturity),
    titlePosition0: 'D',
    position0: `${formatCurrency(new BigNumber(lp?.balance ?? 0).toFixed())}`,
    symbol0: 'CLP',
    titlePosition1: '',
    position1: '',
    symbol1: '',
  };

  const farm = pool?.farm;

  if (creditPairInfo && pool && pair) {
    pool = {
      ...pool,
      ...creditPairInfo,
    };
  }

  const { data: metrics, isValidating: isAPRLoading } =
    useCreditPositionMetrics(
      position ? position.lp.positionId.toString() : undefined,
    );

  const { assetOut, collateralOut } = useMemo(() => {
    if (!pool || !pair || !creditPairInfo)
      return { assetOut: new BigNumber(0), collateralOut: new BigNumber(0) };
    const quote = CreditMath.getLiquidityClaims(
      pool?.assetReserve?.times(
        Math.pow(10, pair?.asset.decimals),
      ) as BigNumber,
      pool?.collateralReserve?.times(
        Math.pow(10, pair?.collateral.decimals),
      ) as BigNumber,
      creditPairInfo?.totalClaims,
      lp?.farmPosition?.positionInfo.amount ?? new BigNumber(lp?.balance ?? 0),
      creditPairInfo.totalLiquidity,
      creditPairInfo?.feeStored,
    );
    return {
      assetOut: quote.assetOut
        .plus(quote.lpFeeOut)
        .div(Math.pow(10, pair.asset.decimals)),
      collateralOut: quote.collateralOut.div(
        Math.pow(10, pair.collateral.decimals),
      ),
    };
  }, [pool, pair, creditPairInfo, lp]);

  const callBack = useCallback(
    (err?: any) => {
      if (!err) {
        mutateCreditPositions();
        mutateLiqPositions();
      }
    },
    [mutateCreditPositions, mutateLiqPositions],
  );

  const myLP =
    lp?.farmPosition?.positionInfo.amount ??
    new BigNumber(lp?.balance ?? 0).div(Math.pow(10, 18));

  const farmCreditRewards = lp?.farmPosition?.pendingCredit.gt(0)
    ? lp?.farmPosition?.pendingCredit.div(Math.pow(10, 18))
    : new BigNumber(0);

  const stakeDispatch = useStakeLPTransactionDispatch(
    new BigNumber(farm?.rewardAprPerYear ?? 0),
    lp?.balance.div(Math.pow(10, 18)).toString() as string,
    (lp?.positionId ?? 0).toString(),
    (pool?.maturity ?? 0).toString(),
    callBack,
    farm?.poolHash,
  );

  const unstakeDispatch = useUnstakeLPTransactionDispatch(
    new BigNumber(lp?.balance ?? 0).toString(),
    (lp?.positionId ?? 0).toString(),
    (pool?.maturity ?? 0).toString(),
    callBack,
    assetOut,
    collateralOut,
    pair as CreditPair,
    farm?.poolHash,
  );

  const claimRewardDispatch = useClaimFarmRewardsTransactions(
    lp?.balance.div(Math.pow(10, 18)).toString() as string,
    lp?.positionId.toString() ?? '',
    farmCreditRewards,
    farm?.poolHash.toString() ?? '',
    callBack,
  );

  const unstakeAndRemoveDispatch = useLiquidityRemoveTransactionDispatch(
    pair as CreditPair,
    pool as CreditPool,
    lp?.balance.toString() as string,
    lp?.positionId.toString() as string,
    callBack,
    assetOut,
    collateralOut,
    farm?.poolHash,
  );

  const withdrawDate = formatTimestampToDate(Number(pool?.maturity ?? 0) * 1000)
    .split(' ')
    .slice(1, 4)
    .reduce((prev, curr) => prev + ' ' + curr, '');

  const renderWithdrawInfo = () => {
    return (
      <>
        <Box border="1px solid #3D3D3D" />
        <VerticalInfo
          header={'Redeemable Amounts'}
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

  const theme = useTheme();

  const lpValue = assetOut
    .times(pair?.asset.price ?? 0)
    .plus(collateralOut.times(pair?.collateral.price ?? 0));

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
          {`Liquidity Position #${positionInfo.id}`}
        </Typography>
        <OpenInNew sx={{ fontSize: '20px' }} />
      </Link>
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
        header={'My liquidity'}
        value={
          <Box display="flex" gap="6px" alignItems="center" flexWrap="wrap">
            <Typography variant="body-moderate-numeric">
              {`${formatCurrency(myLP.toFixed())} CLP`}
            </Typography>
            <Typography
              variant="body-moderate-numeric"
              color={theme.palette.neutrals[15]}
            >
              {`($${compactCurrency(lpValue)})`}
            </Typography>
          </Box>
        }
      />
      {pool?.farm && (
        <>
          <Divider />
          <HorizontalInfo
            header={'LP Farmed'}
            value={formatCurrency(
              lp?.farmPosition && lp?.farmPosition?.positionInfo.amount.gt(0)
                ? lp?.farmPosition?.positionInfo.amount.toFixed()
                : 0,
            )}
          />
          <HorizontalInfo
            header={'Farm APR'}
            value={formatCurrency(farm?.rewardAprPerYear.toFixed()) + '%'}
          />
          <HorizontalInfo
            header={'Farm Rewards'}
            value={
              <CoinBalance
                token={tokenMapping?.[CREDIT_TOKEN_ADDRESS?.[chainId]] ?? {}}
                showUSD={true}
                value={farmCreditRewards}
              />
            }
          />

          {lp?.farmPosition?.positionInfo.amount.gt(0) ? (
            <XCaliButton
              onClickFn={unstakeDispatch}
              Component="Unstake LP Tokens"
              type={'filled'}
            />
          ) : (
            <XCaliButton
              onClickFn={stakeDispatch}
              Component="Stake LP Tokens"
              type={'filled'}
            />
          )}
          {farmCreditRewards.gt(0) && (
            <XCaliButton
              onClickFn={claimRewardDispatch}
              Component="Claim Rewards"
              type={'filled'}
            />
          )}
        </>
      )}
      {renderWithdrawInfo()}
      <XCaliButton
        variant={'neutral'}
        onClickFn={unstakeAndRemoveDispatch}
        Component={
          (lp?.farmPosition?.positionInfo.amount.gt(0)
            ? 'Unstake and Withdraw'
            : 'Withdraw') + ` - ${withdrawDate}`
        }
        type={'filled'}
        disabled={!isPoolMatured(positionInfo.maturity)}
      />
    </SubCard>
  );
}
