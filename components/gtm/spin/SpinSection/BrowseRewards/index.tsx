import { REWARDS, slotPaddingProperties, slotQueries } from '@constants/gtm';
import { Box, Typography } from '@mui/material';
import RewardItem from './RewardItem';
import { useWindowSize } from 'hooks/useWindowSize';
import { useMemo } from 'react';

function BrowseRewards() {
  const [width] = useWindowSize();

  const currentHitQuery = useMemo(() => {
    let query = 0;
    slotQueries.forEach((currentQuery) => {
      if (width >= currentQuery) {
        query = currentQuery;
      }
    });
    return query;
  }, [width]);

  const paddingProperties = slotPaddingProperties[currentHitQuery];
  return (
    <Box padding="24px">
      <Typography
        variant="title-small-bold"
        textAlign="center"
        marginBottom="24px"
        color="#F4F4F4"
      >{`Browse Rewards (${REWARDS.length - 1})`}</Typography>
      <Box
        display="flex"
        flexDirection="row"
        columnGap="24px"
        justifyContent="center"
        sx={{ overflowX: 'auto', overflowY: 'hidden' }}
      >
        {REWARDS.slice(0, REWARDS.length - 1).map((reward, index) => (
          <>
            {(index === 0 || index % 2 === 0) && (
              <Box paddingY="24px" key={index}>
                <RewardItem
                  key={reward.name}
                  reward={reward}
                  paddingProperties={paddingProperties}
                />
                <Box marginBottom="24px" />
                {index != REWARDS.length - 2 && (
                  <RewardItem
                    key={REWARDS[index + 1].name}
                    reward={REWARDS[index + 1]}
                    paddingProperties={paddingProperties}
                  />
                )}
              </Box>
            )}
          </>
        ))}
      </Box>
    </Box>
  );
}
export default BrowseRewards;
