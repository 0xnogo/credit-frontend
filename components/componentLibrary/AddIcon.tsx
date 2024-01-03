import { Box } from '@mui/material';

interface XCaliAddIconProps {
  outerColor?: string;
  innerColor?: string;
}

export default function XCaliAddIcon({
  outerColor = 'white',
  innerColor = 'black',
}: XCaliAddIconProps) {
  return (
    <Box
      style={{
        backgroundColor: outerColor,
        height: '36px',
        width: '36px',
        borderRadius: '50%',
        position: 'relative',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '18px',
          height: '3px',
          backgroundColor: innerColor,
        }}
      />
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '3px',
          height: '18px',
          backgroundColor: innerColor,
        }}
      />
    </Box>
  );
}
