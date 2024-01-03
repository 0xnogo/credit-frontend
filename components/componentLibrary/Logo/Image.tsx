import { Box } from '@mui/material';
import { cloudinaryLoader } from 'functions/cloudinary';
import { uriToHttp } from 'functions/uriToHttp';
import NextImage from 'next/image';
import { UNKNOWN_ICON } from './Logo';

type ImageProps = {
  src?: string;
  width: number;
  height: number;
  onError: any;
  alt?: string;
  layout: string;
  className?: string;
};

const Image = ({
  src,
  width,
  height,
  alt = 'alt image',
  onError,
  layout,
  className,
}: ImageProps) => {
  /* Only remote images get routed to Cloudinary */
  const loader =
    typeof src === 'string' && src.includes('http')
      ? cloudinaryLoader
      : undefined;
  return (
    <Box sx={{ width, height }} overflow="hidden" borderRadius="100%">
      <NextImage
        alt={alt}
        onError={onError}
        placeholder="empty"
        loader={loader}
        src={src ? uriToHttp(src)[0] : UNKNOWN_ICON}
        width={width}
        height={height}
        layout={layout}
        className={className}
      />
    </Box>
  );
};

export default Image;
