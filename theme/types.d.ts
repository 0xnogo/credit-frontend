import { Palette, Typography } from '@mui/material/styles/createPalette';

export interface PaletteColor extends Palette {
  primary: PrimaryColor;
  secondary: SecondaryColor;
  alert: AlertColor;
  success: SuccessColor;
  black: string;
  white: string;
  accordionBorder: { [name: string]: string };
  brand: BrandColor;
  neutrals: NeutralColors;
}

export interface NeutralColors {
  100: string;
  80: string;
  60: string;
  40: string;
  20: string;
  15: string;
  10: string;
  white: string;
}

export interface BrandColor {
  accent: {
    normal: string;
    dark: string;
    'dark-hover': string;
  };
  yellow: {
    normal: string;
    dark: string;
    'dark-hover': string;
  };
  pink: {
    normal: string;
    dark: string;
    'dark-hover': string;
  };
  green: string;
}

interface CustomTypography extends Typography {
  'body-large-medium': TypographyStyleOptions;
  'body-large-regular': TypographyStyleOptions;
  'body-large-numeric': TypographyStyleOptions;
  'body-moderate-medium': TypographyStyleOptions;
  'body-moderate-regular': TypographyStyleOptions;
  'body-moderate-numeric': TypographyStyleOptions;
  'body-small-medium': TypographyStyleOptions;
  'body-small-regular': TypographyStyleOptions;
  'body-small-numeric': TypographyStyleOptions;
  'body-tiny-medium': TypographyStyleOptions;
  'body-tiny-regular': TypographyStyleOptions;
  'title-extra-large': TypographyStyleOptions;
  'title-large-bold': TypographyStyleOptions;
  'title-large-semibold': TypographyStyleOptions;
  'title-moderate-bold': TypographyStyleOptions;
  'title-moderate-semibold': TypographyStyleOptions;
  'title-moderate-numeric': TypographyStyleOptions;
  'title-small-bold': TypographyStyleOptions;
  'title-small-semibold': TypographyStyleOptions;
  'title-small-numeric': TypographyStyleOptions;
}

type CustomPalette = PaletteColor;

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides extends CustomTypography {}
}

declare module '@mui/material/styles/createTheme' {
  interface CustomTheme extends Theme {
    typography: CustomTypography;
  }

  interface CustomBaseTheme extends BaseTheme {
    palette: CustomPalette;
  }

  interface CustomThemeOptions extends ThemeOptions {
    typography: CustomTypography;
    palette: CustomPalette;
  }
}

declare module '@mui/material' {
  interface TypeBrand extends BrandColor {}
}

declare module '@mui/material/styles/createTypography' {
  interface Typography extends CustomTypography {}
  interface TypographyOptions extends CustomTypography {}
}

declare module '@mui/material/styles/createPalette' {
  interface Palette extends CustomPalette {
    brand: BrandColor;
    neutrals: NeutralColors;
  }
  interface PaletteOptions extends CustomPalette {}
}
