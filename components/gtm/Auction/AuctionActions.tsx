import { XCaliButton } from '@components/componentLibrary/Button/XCaliButton';
import Card from '@components/componentLibrary/Card';
import XCaliInput from '@components/componentLibrary/XCaliInput';
import { Swap } from '@components/icons/svgs/Swap';
import { Tick } from '@components/icons/svgs/Tick';
import { Cross } from '@components/icons/svgs/Cross';
import { PURCHASE_TOKEN } from '@constants/gtm';
import { getNativeToken } from '@constants/index';
import { useCodeRegistered } from '@functions/gtm/auction/getCodeRegistrationState';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import BigNumber from 'bignumber.js';
import { useBidTransactionDispatch } from 'hooks/gtm/auction/biddingTransactions/useBidTransactions';
import { useTokenBalance } from 'hooks/useTokenBalances';
import { Dispatch, SetStateAction, useState } from 'react';
import { useAuctionInfo } from '@functions/gtm/auction/getAuctionData';
import { useAllBids } from '@functions/gtm/auction/getAllBids';
import { useUserBidInfo } from '@functions/gtm/auction/getUserBidInfo';

type AuctionActionProps = {
  setSellAmount: Dispatch<SetStateAction<string | undefined>>;
  setPricePerToken: Dispatch<SetStateAction<string | undefined>>;
  pricePerToken: string | undefined;
  sellAmount: string | undefined;
};

function AuctionActions({
  pricePerToken,
  sellAmount,
  setPricePerToken,
  setSellAmount,
}: AuctionActionProps) {
  const [referralId, setReferralId] = useState();
  const theme = useTheme();

  const {
    data: isRegistered,
    isValidating: isCodeLoading,
    error,
  } = useCodeRegistered(referralId);

  const {
    data: auctionInfo,
    isValidating: auctionInfoLoading,
    error: auctionInfoError,
  } = useAuctionInfo();

  const {
    error: allBidsError,
    isValidating: allBidsLoading,
    mutate,
  } = useAllBids();
  const { mutate: mutateUserBids } = useUserBidInfo();

  const { chainId } = useActiveWeb3React();

  const nativeToken = getNativeToken(chainId);

  const { data: tokenBalance = new BigNumber(0) } = useTokenBalance(
    nativeToken.address,
  );

  const unknownError = auctionInfoError || allBidsError;

  const pricePerTokenBN = new BigNumber(pricePerToken ?? 0);

  const minCheck = sellAmount
    ? auctionInfo.minimumBiddingAmountPerOrder.gt(
        new BigNumber(sellAmount ?? 0).times(Math.pow(10, 18)),
      )
    : false;

  const minimalOfferCheck = pricePerTokenBN.gt(0)
    ? new BigNumber(auctionInfo.initialAuctionOrder?.price ?? 0).gte(
        pricePerTokenBN,
      )
    : false;

  const dispatch = useBidTransactionDispatch(
    nativeToken,
    new BigNumber(pricePerToken ?? 0),
    new BigNumber(sellAmount ?? 0),
    referralId,
    (err) => {
      if (!err) {
        setPricePerToken(undefined);
        setSellAmount(undefined);
        setReferralId(undefined);
        setTimeout(() => {
          mutateUserBids();
          mutate();
        }, 2000);
      }
    },
  );

  const codeNotRegistered = !isCodeLoading && !isRegistered;

  const renderErrorState = codeNotRegistered || error;

  return (
    <Card
      sx={{
        background: theme.palette.neutrals[80],
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <Typography variant="title-small-bold" color="#F4F4F4">
        $CREDIT Auction
      </Typography>
      <XCaliInput
        token={{
          ...PURCHASE_TOKEN,
          balance: tokenBalance.toString(),
        }}
        value={sellAmount}
        setValue={setSellAmount}
        title="Participate"
        type="number"
      />
      <Box margin="auto" marginTop="12px">
        <Swap />
      </Box>
      <XCaliInput
        hideBalances={true}
        value={pricePerToken}
        setValue={setPricePerToken}
        title="ETH price per $CREDIT"
        type="number"
      />
      <XCaliInput
        placeholder="REFERRAL ID"
        hideBalances={true}
        value={referralId}
        setValue={setReferralId}
        title="Referral"
        orientation="left"
        endAdornment={
          referralId ? (
            isCodeLoading ? (
              <CircularProgress
                size={'24px'}
                sx={{
                  color: 'white',
                }}
              />
            ) : isRegistered && !error ? (
              <Tick />
            ) : (
              <Cross />
            )
          ) : undefined
        }
      />
      {minimalOfferCheck ||
      minCheck ||
      (referralId && !isCodeLoading) ||
      unknownError ? (
        <Box
          sx={{
            backgroundColor:
              renderErrorState || minimalOfferCheck || minCheck || unknownError
                ? '#36252F'
                : '#253A3A',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <Typography
            variant="body-small-medium"
            color={
              codeNotRegistered ||
              error ||
              minimalOfferCheck ||
              minCheck ||
              unknownError
                ? '#FF7E7E'
                : '#98FFFF'
            }
          >
            {unknownError
              ? 'An unknown error occurred, please refresh your page and try again!'
              : minCheck
              ? 'You cannot go below the minimum bid amount'
              : minimalOfferCheck
              ? 'limit price not better than mimimal offer'
              : codeNotRegistered
              ? 'Referral code not found. Please check spelling and try again'
              : error
              ? 'An error occurred while validating the referral code'
              : 'Success! Your friend will now receive additional $CREDIT tokens based on your bids! '}
          </Typography>
        </Box>
      ) : (
        <></>
      )}
      <Box marginTop="24px">
        <XCaliButton
          variant="blue"
          Component="Place Bids"
          type="filled"
          onClickFn={dispatch}
          disabled={
            (referralId && (codeNotRegistered || error)) ||
            minimalOfferCheck ||
            minCheck ||
            unknownError ||
            !pricePerToken ||
            !sellAmount
          }
          showLoader={isCodeLoading || auctionInfoLoading || allBidsLoading}
        />
      </Box>
    </Card>
  );
}

export default AuctionActions;
