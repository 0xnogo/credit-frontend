import SubCard from '@components/componentLibrary/Card/SubCard';
import TimedCircularProgressWithLabel from '@components/componentLibrary/CircularStatic';
import { AUCTION_END_TIMESTAMP, AUCTION_START_TIMESTAMP } from '@constants/gtm';
import { useAuctionInfo } from '@functions/gtm/auction/getAuctionData';
import { useClearingPrice } from '@functions/gtm/auction/orderBook/orderBookUtils';
import { Box, Typography, useTheme } from '@mui/material';
import BigNumber from 'bignumber.js';
import { useWindowSize } from 'hooks/useWindowSize';

function AuctionDetails() {
  const { data: auctionInfo } = useAuctionInfo();
  const { data: clearingPrice } = useClearingPrice(undefined);

  const theme = useTheme();

  const [width] = useWindowSize();

  const headerSize =
    width >= 700 ? 'body-moderate-medium' : 'body-small-medium';

  const infoSize = width >= 700 ? 'title-small-numeric' : 'body-small-numeric';

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      padding="0"
    >
      <Typography
        variant="title-extra-large"
        color="#FFFFFF"
        textAlign="center"
      >
        Auction Details
      </Typography>
      <SubCard
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 'calc(100% - 48px)',
          alignItems: 'center',
          marginTop: '40px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            flex: 1,
            flexWrap: 'wrap',
            rowGap: '12px',
          }}
        >
          <Box display="flex" flexDirection="column" width="110px">
            <Typography variant={headerSize} color={theme.palette.neutrals[15]}>
              Total Credit
            </Typography>
            <Typography variant={infoSize} color={theme.palette.neutrals.white}>
              {`${new BigNumber(
                auctionInfo.initialAuctionOrder?.sellAmount ?? 0,
              )
                .div(Math.pow(10, 18))
                .toFixed()}`}
            </Typography>
          </Box>
          {width >= 700 && (
            <Box
              height="50px"
              width="1px"
              sx={{ background: theme.palette.neutrals[15] }}
            />
          )}
          <Box display="flex" flexDirection="column" width="110px">
            <Typography variant={headerSize} color={theme.palette.neutrals[15]}>
              Bidding with
            </Typography>
            <Typography variant={infoSize} color={theme.palette.neutrals.white}>
              ETH
            </Typography>
          </Box>
        </Box>

        <Box position="relative" height="10px" marginTop="-140px">
          <TimedCircularProgressWithLabel
            value={90}
            header={'Ends in'}
            endTimestamp={AUCTION_END_TIMESTAMP}
            startTimestamp={AUCTION_START_TIMESTAMP}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            rowGap: '12px',
          }}
        >
          <Box display="flex" flexDirection="column" width="110px">
            <Typography variant={headerSize} color={theme.palette.neutrals[15]}>
              Current Price
            </Typography>
            <Typography variant={infoSize} color={theme.palette.neutrals.white}>
              {`${new BigNumber(clearingPrice ?? 0).toFixed()} ETH`}
            </Typography>
          </Box>
          {width >= 700 && (
            <Box
              height="50px"
              width="1px"
              sx={{ background: theme.palette.neutrals[15] }}
            />
          )}
          <Box display="flex" flexDirection="column" width="110px">
            <Typography variant={headerSize} color={theme.palette.neutrals[15]}>
              Min. sell price
            </Typography>
            <Typography variant={infoSize} color={theme.palette.neutrals.white}>
              {`${new BigNumber(
                auctionInfo.initialAuctionOrder?.price ?? 0,
              ).toFixed()} ETH`}
            </Typography>
          </Box>
        </Box>
      </SubCard>
    </Box>
  );
}

export default AuctionDetails;
