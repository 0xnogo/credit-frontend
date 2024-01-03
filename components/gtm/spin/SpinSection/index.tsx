import { Box, Typography } from '@mui/material';
import Spin from './Spin';
import Image from 'next/image';
import BrowseRewards from './BrowseRewards';

function SpinSection() {
  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap="24px"
        flexWrap="wrap"
        marginTop="58px"
        marginBottom="24px"
        overflow="hidden"
      >
        <Typography variant="title-moderate-bold" color="#F4F4F4">
          Spin to Win Rewards
        </Typography>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="5px"
          sx={{ cursor: 'pointer' }}
        >
          <Typography variant="body-small-numeric" color="white">
            SHARE ON TWITTER
          </Typography>
          <Image
            src="/socials/twitter.svg"
            alt="twitter"
            width={18}
            height={14.63}
          />
        </Box>
      </Box>
      <Spin />
      <Box marginTop="48px" />
      <BrowseRewards />
    </>
  );
}

export default SpinSection;
