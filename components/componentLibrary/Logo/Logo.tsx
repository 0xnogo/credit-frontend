import { Box } from '@mui/material';
import React, { FC, memo, useState } from 'react';
import Image from './Image';

export const UNKNOWN_ICON =
  'https://raw.githubusercontent.com/sushiswap/icons/master/token/unknown.png';

type LogoProps = {
  src?: string;
  width: number;
  height: number;
  alt?: string;
  className?: string;
  style?: any;
};

const Logo: FC<LogoProps> = memo(
  ({ src, width, height, alt = '', className, style }: LogoProps) => {
    const [refresh, setRefresh] = useState(false);
    return (
      <Box width="100%" borderRadius="100%" sx={{ width, height, ...style }}>
        <Image
          src={!refresh ? src ?? UNKNOWN_ICON : UNKNOWN_ICON}
          onError={() => {
            if (!refresh) {
              setRefresh(true);
            }
          }}
          width={width}
          height={height}
          alt={alt}
          layout="fixed"
          className={'rounded-full ' + className}
        />
      </Box>
    );
  },
);

Logo.displayName = 'Logo';

export default Logo;
