import SubCard from '@components/componentLibrary/Card/SubCard';
import { SlotItem } from '@components/gtm/spin/SlotContainer/SlotItem';
import { REWARDS, slotPaddingProperties } from '@constants/gtm';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useUserRewards } from 'hooks/gtm/useUserRewards';

function MyRewards() {
  const { userRewards = [], isValidatingUserRewards } = useUserRewards();

  return (
    <Box minHeight="200px" sx={{ overflowX: 'auto', paddingBottom: '12px' }}>
      <Box
        marginTop="20px"
        sx={{ width: 'max-content' }}
        margin="auto"
        height="100%"
      >
        {isValidatingUserRewards ? (
          <LinearProgress
            color="inherit"
            sx={{
              color: 'white',
            }}
          />
        ) : userRewards.length > 0 ? (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent={'center'}
            gap="20px"
            sx={{ overflow: 'auto' }}
          >
            {userRewards.map((reward: any, index: number) => (
              <SubCard key={index}>
                <SlotItem
                  width={150}
                  height={150}
                  item={REWARDS[reward.rewardIndex]}
                  index={index}
                  paddingProperties={{}}
                />
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography color="white">
                    {REWARDS[reward.rewardIndex].name}
                  </Typography>
                  <Typography color="white">
                    {REWARDS[reward.rewardIndex].description}
                  </Typography>
                </Box>
              </SubCard>
            ))}
          </Box>
        ) : (
          <Box margin="auto">
            <Typography color="white" margin="auto">
              You don&apos;t have any rewards yet!
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MyRewards;
