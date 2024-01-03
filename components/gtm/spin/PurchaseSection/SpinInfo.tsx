import Card from '@components/componentLibrary/Card';
import { Box, Divider, Theme, Typography, useTheme } from '@mui/material';
import { useUserRewards } from 'hooks/gtm/useUserRewards';
import { useUserSpinInfo } from 'hooks/gtm/useUserSpinInfo';

const infoItem = (header: string, info: number, theme: Theme) => (
  <Box display="flex" flexDirection="column" width="33.3%">
    <Typography
      variant="body-moderate-regular"
      color={theme.palette.neutrals[15]}
    >
      {header}
    </Typography>
    <Typography
      variant="title-small-numeric"
      color={theme.palette.neutrals[15]}
    >
      {info}
    </Typography>
  </Box>
);

function SpinInfo() {
  const { data } = useUserSpinInfo();
  const { userRewards = [] } = useUserRewards();
  const theme = useTheme();

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: '24px',
        paddingRight: '24px',
        marginTop: '24px',
        width: '100%',
        gap: '10px',
      }}
    >
      {infoItem('Spins Remaining', data.spinInfo.remainingSpins, theme)}
      <Divider flexItem={true} orientation="vertical" />
      {infoItem('My Rewards', userRewards.length, theme)}
      <Divider flexItem={true} orientation="vertical" />
      {infoItem('Total Spins', data.spinInfo.totalSpins, theme)}
    </Card>
  );
}
export default SpinInfo;
