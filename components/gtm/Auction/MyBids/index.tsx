import Card from '@components/componentLibrary/Card';
import MyBidsTable from './Table';
import { useUserBidInfo } from '@functions/gtm/auction/getUserBidInfo';
import { CircularProgress, Typography, useTheme } from '@mui/material';

function MyBids() {
  const theme = useTheme();

  const {
    data: { auctionSellOrders },
    isValidating,
  } = useUserBidInfo();

  return (
    <Card
      header="Your Bids"
      sx={{
        width: 'calc(100% - 48px)',
        position: 'relative',
        minHeight: '200px',
      }}
    >
      {isValidating ? (
        <CircularProgress sx={{ margin: 'auto' }} />
      ) : auctionSellOrders.length > 0 ? (
        <MyBidsTable />
      ) : (
        <Typography
          textAlign={'center'}
          color={theme.palette.neutrals[10]}
          margin="auto"
        >
          You have no orders for this auction
        </Typography>
      )}
    </Card>
  );
}

export default MyBids;

//position contributed creditQuantity date&time address referral cancel
