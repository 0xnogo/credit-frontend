import Card from '@components/componentLibrary/Card';
import { Box, Typography, useTheme } from '@mui/material';
import AuctionChart from './Chart';
import { ParentSize } from '@visx/responsive';
import { Close } from '@mui/icons-material';
import ToggleButton from '@components/componentLibrary/ToggleButton';
import { useMemo, useState } from 'react';
import BarChartIcon from '@mui/icons-material/BarChart';
import TocIcon from '@mui/icons-material/Toc';
import OrderBookTable from './Table';
import BigNumber from 'bignumber.js';
import { MinimalAuctionOrder } from 'types/auction';

const icons: any = {
  0: <BarChartIcon />,
  1: <TocIcon />,
};

type OrderbookProps = {
  sellAmount: string | undefined;
  pricePerToken: string | undefined;
};

function OrderBook({ sellAmount, pricePerToken }: OrderbookProps) {
  const theme = useTheme();

  const [toggleVal, setToggleVal] = useState(0);

  const userPricePoint: MinimalAuctionOrder | undefined = useMemo(() => {
    if (sellAmount && pricePerToken) {
      if (!isNaN(Number(sellAmount)) && !isNaN(Number(pricePerToken))) {
        return {
          price: new BigNumber(pricePerToken),
          sellAmount: new BigNumber(sellAmount).times(Math.pow(10, 18)),
          buyAmount: new BigNumber(sellAmount)
            .times(Math.pow(10, 18))
            .div(pricePerToken),
          auctionUser: { id: '0' },
        };
      }
    }
  }, [sellAmount, pricePerToken]);

  return (
    <Card
      sx={{
        flex: '1',
        minWidth: '312px',
        maxWidth: '100%',
        gap: '12px',
        position: 'relative',
        justifyContent: 'space-between',
        maxHeight: '515px',
      }}
    >
      <Box
        width="150px"
        sx={{
          position: 'absolute',
          right: '0',
          top: '0',
          transform: 'translate(-12px,12px)',
        }}
      >
        <ToggleButton
          sx={{ height: '30px' }}
          value={toggleVal}
          setValue={setToggleVal}
          values={[0, 1]}
          renderedOption={(value) => icons[value]}
          isSelected={(val, curr) => val === curr}
        />
      </Box>
      <Typography variant="title-small-bold" color="#F4F4F4">
        Order Book
      </Typography>
      {toggleVal === 0 ? (
        <>
          <ParentSize style={{ padding: '0', marginBottom: -40 }}>
            {(parent) => (
              <AuctionChart
                userPricePoint={userPricePoint}
                width={parent.width}
                height={300}
                compact={false}
              />
            )}
          </ParentSize>
          <Box display="flex" flexDirection="row" flexWrap="wrap" gap="12px">
            <Box display="flex" flexDirection="row" gap="6px">
              <svg width={15} height={15}>
                <rect
                  x={0}
                  y={0}
                  width={15}
                  height={20}
                  fill="white"
                  opacity={0.25}
                />
                <line // vertical line
                  x1={0}
                  x2={15}
                  y1={0}
                  y2={0}
                  stroke="white"
                  strokeWidth={1.5}
                  strokeDasharray={2}
                />
              </svg>
              <Typography color="white" variant="body-small-regular">
                Clearing price
              </Typography>
            </Box>
            <Box display="flex" flexDirection="row" gap="6px">
              <svg width={15} height={15}>
                <rect
                  x={0}
                  y={0}
                  width={15}
                  height={20}
                  fill="red"
                  opacity={0.25}
                />
                <line // vertical line
                  x1={0}
                  x2={15}
                  y1={0}
                  y2={0}
                  stroke="red"
                  strokeWidth={1.5}
                  strokeDasharray={2}
                />
              </svg>
              <Typography color="white" variant="body-small-regular">
                Losing Range
              </Typography>
            </Box>
            <Box display="flex" flexDirection="row" gap="6px">
              <svg width={15} height={15}>
                <rect
                  x={0}
                  y={0}
                  width={15}
                  height={20}
                  fill="green"
                  opacity={0.25}
                />
                <line // vertical line
                  x1={0}
                  x2={15}
                  y1={0}
                  y2={0}
                  stroke="green"
                  strokeWidth={1.5}
                  strokeDasharray={2}
                />
              </svg>
              <Typography color="white" variant="body-small-regular">
                Winning Range
              </Typography>
            </Box>
            <Box display="flex" flexDirection="row" gap="6px">
              <Close
                sx={{
                  color: 'white',
                  margin: '0',
                  padding: '0',
                  marginTop: '-5px',
                  width: '20px',
                  marginRight: '-5px',
                }}
              />
              <Typography color="white" variant="body-small-regular">
                Your pending bid
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography
              color={theme.palette.neutrals[10]}
              variant="body-tiny-medium"
            >
              * Note : The chart shows bid information irrespective of the
              minimum threshold being reached
            </Typography>
            <br />
            <Typography
              color={theme.palette.neutrals[10]}
              variant="body-tiny-medium"
            >
              ** Note : The clearing price will change throughout the auction,
              so your order might not win even though it might currently be a
              winning bid
            </Typography>
          </Box>
        </>
      ) : (
        <OrderBookTable />
      )}
    </Card>
  );
}

export default OrderBook;
