import { XCaliButton } from '@components/componentLibrary/Button/XCaliButton';
import { PROBABILITES, REWARDS, slotQueries } from '@constants/gtm';
import { Box, Typography, useTheme } from '@mui/material';
import { useLootboxModule } from 'hooks/gtm/useLootboxModule';
import { useUserRewards } from 'hooks/gtm/useUserRewards';
import { useUserSpinInfo } from 'hooks/gtm/useUserSpinInfo';
import { useState } from 'react';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { GameInfo } from 'types/gtm';
import PrizeModal from './PrizeModal';

function Spin() {
  const [loading, setLoading] = useState(false);

  const [reward, setReward] = useState<any>(false);

  const { account } = useActiveWeb3React();

  const { data, isValidatingUserData, mutateUserData } = useUserSpinInfo();

  const { mutateRewards } = useUserRewards();

  const { userHasNFT, spinInfo, tokenId } = data as GameInfo;

  const canUserSpin = spinInfo.remainingSpins > 0;

  const spinsRemaining = spinInfo.remainingSpins;

  const spinTheWheel = async () => {
    setLoading(true);
    try {
      const fn = tokenId
        ? `/api/play/defaultSpin?address=${account}&nftId=${tokenId}`
        : `/api/play/paidSpin?address=${account}`;
      const response = await fetch(fn);
      const result = await response.json();
      if (result.success) {
        const { rewardIndex } = result.reward;
        const reward = REWARDS[rewardIndex];
        reset();
        startAnimation(reward);
      } else {
        const reward = REWARDS[REWARDS.length - 1];
        reset();
        startAnimation(reward);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const { component, startAnimation, containerRef, reset, isRunning } =
    useLootboxModule({
      queries: slotQueries,
      slotWidths: { 0: 100, 768: 159.2 },
      slotHeights: { 0: 90, 768: 124.203 },
      probabilities: PROBABILITES,
      rewards: REWARDS,
      slotSpacing: 0,
      selectorProperties: {
        imgURI: '',
        position: 'across',
        width: 0,
        heights: { 0: 96, 768: 155 },
        style: {
          border: `2px #48FFFF solid`,
        },
      },
      onCompleteHandler: (reward: any) => {
        if (reward) {
          mutateRewards();
          setReward(reward);
          mutateUserData();
        }
      },
      soundURL: '/sounds/slotSound.mp3',
    });

  const theme = useTheme();

  return (
    <Box ref={containerRef} sx={{ width: '100%', position: 'relative' }}>
      <PrizeModal
        open={Boolean(reward)}
        onClose={() => setReward(false)}
        reward={reward}
      />
      <Box marginBottom="70px">{component}</Box>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap="20px"
        flexWrap="wrap"
      >
        <XCaliButton
          Component="Spin the wheel"
          variant="blue"
          onClickFn={() => spinTheWheel()}
          type="hugged"
          disabled={
            isRunning ||
            isValidatingUserData ||
            !canUserSpin ||
            loading ||
            !userHasNFT
          }
          showLoader={isValidatingUserData || loading}
          style={{ width: '243px' }}
        />

        <Box display="flex" alignItems="center">
          <Typography
            variant="body-moderate-regular"
            color={theme.palette.neutrals[15]}
          >
            Spins Remaining:
          </Typography>
          <Typography
            variant="body-moderate-numeric"
            color="white"
            marginLeft="2px"
          >
            {spinsRemaining}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Spin;
