import SubCard from '@components/componentLibrary/Card/SubCard';
import { Box, useTheme } from '@mui/material';
import Image from 'next/image';
import { Reward } from 'types/gtm';

type SlotItemProps = {
  width: number;
  height: number;
  item: Reward;
  index: number;
  paddingProperties: Record<string, any>;
};
export function SlotItem({
  width,
  height,
  item,
  index,
  paddingProperties,
}: SlotItemProps) {
  const theme = useTheme();
  return (
    <SubCard
      key={item.name + index}
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: '0',
        ...paddingProperties,
      }}
    >
      <Box
        sx={{
          background: theme.palette.neutrals[40],
          width: '100%',
          height: '100%',
          borderRadius: '12px',
        }}
      >
        <Image
          alt={item.name}
          width={item.imageProps.imageWidth}
          height={item.imageProps.imageHeight}
          src={item.imgURI}
          style={{
            margin: 'auto',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        />
      </Box>
    </SubCard>
  );
}
