//@ts-nocheck
import { createTheme } from '@mui/material/styles';
import coreTheme from './coreTheme';
import colors from './style-dictionary/build/color.json';
import gradientsJson from './style-dictionary/build/gradients.json';
import shadows from './style-dictionary/build/shadows.json';

// Create a theme instance.
const theme = createTheme({
  ...coreTheme,
  palette: {
    ...coreTheme.palette,
    neutrals: {
      ...coreTheme.palette.neutrals,
    },
    brand: {
      ...coreTheme.palette.brand,
    },
    black: '#000000',
    white: '#ffffff',
    mode: 'light' as any,

    primary: {
      main: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#98ffff',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    secondary: {
      main: '#ffffff',
    },
    alert: {
      main: '#ffffff',
    },
    success: {
      main: '#ffffff',
    },
    accordionBorder: {
      borderRadius: '2px 2px 0px 0px',
    },
  },
});

export default theme;
