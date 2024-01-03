import { Box, Typography } from '@mui/material';
import { Skeleton } from '@mui/material';
import { LinearGradient } from '@visx/gradient';
import { useState } from 'react';
import AreaChart from './AreaChart';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';

interface DataPoint {
  date: Date;
  value: number;
}

interface AreaControlledProps {
  height?: number;
  data: DataPoint[];
  fromColor?: string;
  toColor?: string;
  id?: string;
  loading?: boolean;
  name?: string;
}

export const AreaControlled = ({
  height = 500,
  data = [],
  fromColor = '#98FFFF',
  toColor = '#98FFFF',
  id = '',
  loading = false,
  name = '',
}: AreaControlledProps) => {
  const [timestamp, setTimeStamp] = useState({
    currentTarget: {
      value: 'ALL',
    },
  });
  return (
    <Box>
      <Box
        sx={{
          height: height,
          width: '100%',
          maxWidth: '100%',
          padding: '0',
          position: 'relative',
          marginTop: '0.5rem',
        }}
      >
        <Typography>{name}</Typography>
        <ParentSize>
          {({ width, height }) => (
            <Box position={'relative'}>
              <AreaChart
                timestamp={timestamp}
                data={data}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                tooltipDisabled
                width={width}
                height={height}
                overlayEnabled
                showTooltip={true}
                gradientHash={id}
                fromColor={fromColor}
                toColor={toColor}
              />
              {(!(data && data?.length > 0) || loading) && (
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  sx={{
                    width: width,
                    height: height + 20,
                    top: '-25px',
                  }}
                >
                  <Box
                    borderRadius="0"
                    width="100%"
                    height="100%"
                    position="relative"
                    sx={{
                      backdropFilter: 'blur(8px)',
                    }}
                  />
                  <Box
                    display="flex"
                    flexDirection={'row'}
                    alignItems="center"
                    position="absolute"
                    justifyContent={'center'}
                    top="0"
                    left="0"
                    width={'100%'}
                    height="100%"
                    marginTop={'0.5rem'}
                  >
                    <Typography variant="body-small-medium">
                      Insufficient Charting Data
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </ParentSize>
      </Box>
      {/* <Box display="flex" flexDirection={'row'} width="100%" marginTop="2rem">
        <Box style={{ width: '70px' }} marginRight="0.5rem">
          <XCaliButton
            size="s"
            onClickFn={() => {
              setTimeStamp({
                currentTarget: {
                  value: 'ALL',
                },
              });
            }}
            type="filled"
            Component="All"
            textVariant="body-small-medium"
          />
        </Box>
        <Box style={{ width: '70px' }} marginRight="0.5rem">
          <XCaliButton
            type="filled"
            onClickFn={() =>
              setTimeStamp({
                currentTarget: {
                  value: '1M',
                },
              })
            }
            Component="1m"
            size="s"
            textVariant="body-small-medium"
          />
        </Box>
        <Box style={{ width: '70px' }} marginRight="0.5rem">
          <XCaliButton
            type="filled"
            onClickFn={() =>
              setTimeStamp({
                currentTarget: {
                  value: '1W',
                },
              })
            }
            Component="1w"
            size="s"
            textVariant="body-small-medium"
          />
        </Box>
      </Box> */}
    </Box>
  );
};
