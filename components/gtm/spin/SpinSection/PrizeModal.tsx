import Card from '@components/componentLibrary/Card';
import Modal from '@components/componentLibrary/ModalCard';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';

function PrizeModal({ open, onClose, reward }: any) {
  const theme = useTheme();
  return (
    <Modal open={open} onClose={onClose}>
      <Box>
        <Card
          header={'Reward'}
          sx={{ width: '480px', maxWidth: '100%', gap: '12px' }}
          fontSize="l"
          onClose={onClose}
        >
          <Image
            alt="reward image"
            style={{ margin: 'auto' }}
            src={reward.imgURI}
            width={150}
            height={150}
          />
          <Typography variant="body-moderate-medium" color="white">
            {reward.name}
          </Typography>
          <Typography
            variant="body-small-regular"
            color={theme.palette.neutrals[15]}
            margin="auto"
          >
            {reward.description}
          </Typography>
        </Card>
      </Box>
    </Modal>
  );
}

export default PrizeModal;
