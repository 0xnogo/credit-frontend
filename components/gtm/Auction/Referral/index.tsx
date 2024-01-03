import Card from '@components/componentLibrary/Card';
import { Box, Typography } from '@mui/material';
import ShareLink from './ShareLink';
import { CreditLogo } from '@components/icons/svgs/CreditLogo';
import { useWindowSize } from 'hooks/useWindowSize';
import CreditMetric from '@components/componentLibrary/CreditMetric';
import { useUserReferralInfo } from '@functions/gtm/auction/getUserReferralInfo';
import { formatCurrency } from '@utils/index';

function Referral() {
  const {
    data: {
      totalSellAmount,
      totalCreditWinningsForReferredOrders,
      ordersReferredCount,
    },
  } = useUserReferralInfo();

  const [width] = useWindowSize();

  return (
    <Card
      sx={{
        width: 'calc(100% - 48px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        zIndex: '0',
      }}
      header="Refer a friend"
      fontSize="m"
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        position="relative"
        width="100%"
      >
        <Box display="flex" flexDirection="column" gap="12px" maxWidth="100%">
          <Typography color="GrayText" variant="body-small-regular">
            Share your link
          </Typography>
          <ShareLink />
          <Box display="flex" flexDirection="row" flexWrap="wrap" gap="12px">
            <CreditMetric
              title="$CREDIT earned"
              data={formatCurrency(
                totalCreditWinningsForReferredOrders
                  .div(Math.pow(10, 18))
                  .toFixed(),
              )}
              titleSize="12px"
              dataSize="14px"
              underlined={false}
            />
            <CreditMetric
              title="Orders Referred"
              titleSize="12px"
              dataSize="14px"
              data={ordersReferredCount.toFixed()}
              underlined={false}
            />
            <CreditMetric
              title="Amount Combined"
              titleSize="12px"
              dataSize="14px"
              data={`${formatCurrency(
                totalSellAmount.div(Math.pow(10, 18)).toFixed(),
              )} ETH`}
              underlined={false}
            />
          </Box>
        </Box>
      </Box>

      {width >= 810 && (
        <Box
          sx={{
            zIndex: '-1',
            transform: 'scale(0.75) translateX(40px)',
            position: 'absolute',
            top: '0',
            right: '0',
          }}
        >
          <CreditLogo />
        </Box>
      )}
    </Card>
  );
}

export default Referral;
