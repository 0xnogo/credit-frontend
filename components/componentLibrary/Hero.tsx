import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Stats from './Stats';

export default function Hero() {
  const theme = useTheme();
  const media605 = useMediaQuery('(max-width:605px)');
  return (
    <Box
      sx={{
        paddingTop: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '48px',
        paddingX: '20px',
        marginBottom: '48px',
      }}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="title-extra-large"
          fontSize={media605?'36px':undefined}
          color={theme.palette.neutrals.white}
          textAlign="center"
        >
          Fixed Isolated
        </Typography>
        <Typography
          variant="title-extra-large"
          fontSize={media605?'36px':undefined}
          color={theme.palette.neutrals.white}
          textAlign="center"
        >
          LENDING & BORROWING
        </Typography>
      </Box>
      <Stats />
    </Box>
  );
}
