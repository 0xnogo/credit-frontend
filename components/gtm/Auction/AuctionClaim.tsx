import { XCaliButton } from '@components/componentLibrary/Button/XCaliButton';
import Card from '@components/componentLibrary/Card';
import XCaliInput from '@components/componentLibrary/XCaliInput';
import { Swap } from '@components/icons/svgs/Swap';
import { PURCHASE_TOKEN } from '@constants/gtm';
import { getCreditToken } from '@constants/index';
import {
  defaultGenesisStakingObject,
  useGenesisStakingInfo,
} from '@functions/stake/genesisStakeInfo';
import { Box, Typography } from '@mui/material';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import Link from 'next/link';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import BigNumber from 'bignumber.js';
import { useUserBidInfo } from '@functions/gtm/auction/getUserBidInfo';
import { useMemo } from 'react';
import { useClaimVestTransactionDispatch } from 'hooks/stake/genesisTransactions/claimVest/useClaimVestTransactions';

function AuctionClaim() {
  const { chainId } = useActiveWeb3React();

  const {
    data: { auctionSellOrders },
  } = useUserBidInfo();

  const totalSellAmount = useMemo(
    () =>
      auctionSellOrders.reduce(
        (prev, curr) => prev.plus(curr.sellAmount),
        new BigNumber(0),
      ),
    [auctionSellOrders],
  );

  const {
    data = defaultGenesisStakingObject,
    isValidating,
    mutate,
  } = useGenesisStakingInfo();

  const userRewardAmountBN = new BigNumber(
    data.userRewardInfo?.rewardAmount ?? 0,
  ).div(Math.pow(10, 18));

  const userProof = data.userRewardInfo?.proof ?? [];
  const claimVestTransactionDispatch = useClaimVestTransactionDispatch(
    userRewardAmountBN,
    (err) => {
      if (!err) {
        mutate();
      }
    },
    userProof,
  );

  return (
    <Card
      sx={{
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: '455px',
      }}
    >
      <Typography variant="title-small-bold" color="#F4F4F4">
        Claim CREDIT
      </Typography>
      <XCaliInput
        token={{
          ...PURCHASE_TOKEN,
        }}
        hideBalances={true}
        value={totalSellAmount.div(Math.pow(10, 18)).toFixed()}
        setValue={() => {}}
        title="You have contributed"
        type="number"
        disabled={true}
      />
      <Box margin="auto" marginTop="12px">
        <Swap />
      </Box>
      <XCaliInput
        token={{ ...getCreditToken(chainId) }}
        hideBalances={true}
        value={userRewardAmountBN.toFixed()}
        setValue={() => {}}
        title="Amount to claim"
        type="number"
        disabled={true}
      />
      <Box marginTop="24px" gap="12px" display="flex" flexDirection="column">
        <XCaliButton
          variant="neutral"
          Component={
            data.amountLocked.gt(0)
              ? 'Staked'
              : userRewardAmountBN.gt(0)
              ? 'Claim'
              : 'Nothing to Claim'
          }
          type="filled"
          onClickFn={claimVestTransactionDispatch}
          disabled={
            data.amountLocked.gt(0) || userRewardAmountBN.lte(0) || !userProof
          }
          showLoader={isValidating}
        />
        <Link href="/stake/genesis-token" target="_blank">
          <XCaliButton
            variant="outline"
            Component={
              <Box
                display="flex"
                alignItems="center"
                gap="6px"
                justifyContent="center"
              >
                Stake <ArrowOutwardIcon sx={{ width: '20px' }} />
              </Box>
            }
            type="filled"
            onClickFn={() => {}}
          />
        </Link>
      </Box>
    </Card>
  );
}

export default AuctionClaim;
