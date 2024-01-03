import * as React from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import { useEffect, useState, useRef } from 'react';

interface TimedCircularProgressWithLabelProps extends CircularProgressProps {
  header: string;
  endTimestamp: number;
  startTimestamp: number;
}

function dateDiffToString(b: number, a: number) {
  let diff = a - b;

  if (diff < 0) return '00:00:00:00';

  const ms = diff % 1000;
  diff = (diff - ms) / 1000;
  const ss = diff % 60;
  diff = (diff - ss) / 60;
  const mm = diff % 60;
  diff = (diff - mm) / 60;
  const hh = diff % 24;
  const days = (diff - hh) / 24;

  return days + ':' + hh + ':' + mm + ':' + ss;
}

const endedTimestamp = '0:0:0:0';
function TimedCircularProgressWithLabel({
  header,
  endTimestamp,
  startTimestamp,
}: TimedCircularProgressWithLabelProps) {
  const intervalHandler = useRef<NodeJS.Timer>();
  const [todaysDate, setTodaysDate] = useState(0);

  useEffect(() => {
    intervalHandler.current = setInterval(() => {
      setTodaysDate(Date.now());
    }, 1000);
    return () => {
      if (intervalHandler.current) clearInterval(intervalHandler.current);
    };
  }, []);

  endTimestamp = endTimestamp * 1000;

  useEffect(() => {
    if (endTimestamp - todaysDate < 0) {
      setTodaysDate(endTimestamp);
      if (intervalHandler.current) clearInterval(intervalHandler.current);
    }
  }, [endTimestamp, todaysDate, intervalHandler]);

  const formattedTimestamp = dateDiffToString(todaysDate, endTimestamp);

  let progress = React.useMemo(() => {
    const msStartTimestamp = startTimestamp * 1000;
    let progress =
      ((endTimestamp - todaysDate) / (endTimestamp - msStartTimestamp)) * 100;

    if (progress < 0) progress = 0;

    return 100 - progress;
  }, [endTimestamp, todaysDate, startTimestamp]);

  const theme = useTheme();
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Box position="relative">
        <Box position="relative">
          <CircularProgress
            sx={{
              color: '#253A3A',
            }}
            size="150px"
            variant="determinate"
            value={100}
          />
        </Box>
        <Box position="absolute" top="0">
          <CircularProgress
            sx={{
              color: '#48FFFF',
            }}
            size="150px"
            variant="determinate"
            value={progress}
          />
        </Box>
      </Box>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="body-large-numeric"
          textTransform="uppercase"
          color={theme.palette.neutrals.white}
        >
          {formattedTimestamp === endedTimestamp ? 'AUCTION' : header}
        </Typography>
        <Typography
          variant="body-large-numeric"
          textTransform="uppercase"
          color={theme.palette.neutrals.white}
        >
          {formattedTimestamp === endedTimestamp ? 'ENDED' : formattedTimestamp}
        </Typography>
      </Box>
    </Box>
  );
}

export default TimedCircularProgressWithLabel;
