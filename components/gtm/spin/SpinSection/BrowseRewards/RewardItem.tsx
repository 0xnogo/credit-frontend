import SubCard from '@components/componentLibrary/Card/SubCard';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';

// imgURI: '/tokens/ARB.png',
// name: 'reward0',
// description: 'reward 0 description',
// style: {
//   boxShadow: '0 0 10px 5px #0b121a inset',
//   border: '2px #0b121a solid',
//   borderLeft: '10px #0b121a solid',

//   borderRight: '10px #0b121a solid',
// },
// imageProps: {
//   ...IMG_PROPS,
//   style: { boxShadow: '0 0 100px 10px #0ff' },
// },

function RewardItem({ reward, paddingProperties }: any) {
  const theme = useTheme();
  return (
    <Box
      height="156px"
      position="relative"
      sx={{
        borderRadius: '12px',
        background: '#1D1E1F',
        width: '259px',
      }}
      display="flex"
      flexDirection="row"
    >
      <Box style={{ height: '100%', padding: '16px' }}>
        <Box display="flex" flexDirection="row">
          <Box
            style={{
              background: theme.palette.neutrals[40],
              width: '124px',
              height: '124px',
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            <Image
              style={{
                top: '50%',
                left: '50%',
                position: 'absolute',
                transform: 'translate(-50%,-50%)',
              }}
              src={reward.imgURI}
              width={reward.imageProps.imageWidth}
              height={reward.imageProps.imageHeight}
              alt={reward.name}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ paddingY: '16px' }}>
        <Typography variant="body-moderate-medium" color="white">
          {reward.name}
        </Typography>
        <Typography
          variant="body-small-regular"
          color={theme.palette.neutrals[15]}
        >
          {reward.description}
        </Typography>
      </Box>
    </Box>
  );
}

export default RewardItem;
