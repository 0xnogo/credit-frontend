import { Box } from '@mui/material';

type SvgContainerProps = {
  height: string | number;
  width: string | number;
  color?: string;
  viewBox?: string;
  sx?: Record<string, any>;
  children: JSX.Element;
};

export const SvgContainer = ({
  height = '20px',
  width = '20px',
  color,
  viewBox,
  children,
  sx = {},
}: SvgContainerProps) => (
  <Box
    component="svg"
    width={width}
    height={height}
    {...{
      viewBox:
        viewBox ||
        `0 0 ${typeof width === 'string' ? width.split('px')[0] : width} ${
          typeof height === 'string' ? height.split('px')[0] : height
        }`,
    }}
    {...{ fill: color }}
    {...{ xmlns: 'http://www.w3.org/2000/svg' }}
    sx={sx}
  >
    {children}
  </Box>
);
