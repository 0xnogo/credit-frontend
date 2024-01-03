//@ts-nocheck
import { createTheme } from '@mui/material/styles';
import coreTheme from './coreTheme';
// Create a theme instance.
const theme = createTheme({
  ...coreTheme,
  palette: {
    ...coreTheme.palette,
    mode: 'dark' as any,
    black: '#000000',
    white: '#ffffff',
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
    neutrals: {
      ...coreTheme.palette.neutrals,
    },
    brand: {
      ...coreTheme.palette.brand,
    },
  },
});

export default theme;
