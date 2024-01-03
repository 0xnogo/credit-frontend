import { Box, Card, CircularProgress, useTheme } from '@mui/material';
import Faq from './Faq';
import AuctionDetails from './AuctionDetails';
import AuctionActions from './AuctionActions';
import Referral from './Referral';
import MyBids from './MyBids';
import VestingSchedule from '@components/credit/Stake/Info/VestingSchedule';
import OrderBook from './OrderBook';
import { useState } from 'react';
import { useAuctionInfo } from '@functions/gtm/auction/getAuctionData';
import AuctionClaim from './AuctionClaim';
import { AUCTION_END_TIMESTAMP } from '@constants/gtm';
import { FixedNumber } from 'ethers';

export default function MainAuction() {
  const [sellAmount, setSellAmount] = useState<string | undefined>();
  const [pricePerToken, setPricePerToken] = useState<string | undefined>();

  const {
    data: { auctionEndDate },
    isValidating,
    isLoading,
  } = useAuctionInfo();

  const now = Date.now() / 1000;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '50px',
        width: '1040px',
        maxWidth: '100%',
        margin: '80px auto',
        paddingX: '12px',
      }}
    >
      <AuctionDetails />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        width="100%"
        gap="24px"
        flexWrap="wrap"
      >
        {isValidating || isLoading ? (
          <Card
            sx={{
              width: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '455px',
            }}
          >
            <CircularProgress sx={{ margin: 'auto' }} />
          </Card>
        ) : now >= AUCTION_END_TIMESTAMP ? (
          <AuctionClaim />
        ) : (
          <AuctionActions
            sellAmount={sellAmount}
            pricePerToken={pricePerToken}
            setSellAmount={setSellAmount}
            setPricePerToken={setPricePerToken}
          />
        )}
        <OrderBook sellAmount={sellAmount} pricePerToken={pricePerToken} />
      </Box>
      <Referral />
      <MyBids />
      <VestingSchedule />
      <Faq />
    </Box>
  );
}
