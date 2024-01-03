import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { css, keyframes, styled } from '@mui/material/styles';
import React, { memo, useMemo } from 'react';

const BUTTON_HEIGHTS: { [key: string]: string } = {
  m: '48px',
  s: '38px',
  auto: 'auto',
};

const BUTTON_ORIENTATION = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center',
};

const Container = (
  type: string,
  disabled: boolean,
  hover: any,
  borderRadius: string | undefined,
  baseColorProperties: any,
  activeProperties: any,
  rounded: boolean,
  size: string,
) => {
  return styled(Box)(
    ({ theme }: any) => `
    background:${baseColorProperties.backgroundColor};
    border:${baseColorProperties.border};
    width:${
      rounded
        ? BUTTON_HEIGHTS[size]
        : type === 'filled'
        ? '100%'
        : 'max-content'
    };
    height:${BUTTON_HEIGHTS[size]};
    border-radius:${borderRadius ?? `8px`};
    cursor:pointer;
    position:relative;
    opacity:${disabled ? '0.5' : '1'};
    pointer-events:none;
    box-sizing:border-box;
    & .MuiTypography-root,& .MuiIcon-root,& svg path	{
      color:${baseColorProperties.color} !important;
      fill:${baseColorProperties.color} !important;
    }
    & .MuiCircularProgress-circle	{
      color:${baseColorProperties.color} !important;
    }
    &:hover .MuiTypography-root,&:hover .MuiIcon-root,&:hover svg path	{
      color:${hover.color} !important;
      fill:${hover.color} !important;
    }
    &:active .MuiTypography-root,&:active .MuiIcon-root,&:active svg path	{
      color:${activeProperties.color} !important;
      fill:${activeProperties.color} !important;
    }
    &:hover{
        border:${hover.border} !important;
        transition: all 0.2s;
    }
    &:active{
      border:${activeProperties.border} !important;
      transition: all 0.2s;
    }
`,
  );
};

const LoadingAnimation = (baseColorProperties: any) => keyframes`
  0% {
    box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 10001px 0 0 0 ${baseColorProperties.color}, 10008px 0 0 0 ${baseColorProperties.color};
  }
  16.667% {
    box-shadow: 9994px -5px 0 0 ${baseColorProperties.color}, 10001px 0 0 0 ${baseColorProperties.color}, 10008px 0 0 0 ${baseColorProperties.color};
  }
  33.333% {
    box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 10001px 0 0 0 ${baseColorProperties.color}, 10008px 0 0 0 ${baseColorProperties.color};
  }
  50% {
    box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 10001px -5px 0 0 ${baseColorProperties.color}, 10008px 0 0 0 ${baseColorProperties.color};
  }
  66.667% {
    box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 10001px 0 0 0 ${baseColorProperties.color}, 10008px 0 0 0 ${baseColorProperties.color};
  }
  83.333% {
    box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 10001px 0 0 0 ${baseColorProperties.color}, 10008px -5px 0 0 ${baseColorProperties.color};
  }
  100% {
    box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 10001px 0 0 0 ${baseColorProperties.color}, 10008px 0 0 0 ${baseColorProperties.color};
  }
`;

const Dots = (baseColorProperties: any) => {
  return styled(Box)(
    ({ theme }: any) => `
    position: relative;
    left: -9999px;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    color: ${baseColorProperties.color};
    box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 9999px 0 0 0 ${baseColorProperties.color}, 10014px 0 0 0 ${baseColorProperties.color};
`,
  );
};

const ButtonRipple = styled(Box)();

const CustomRippleBg = (
  disabled: boolean,
  hover: any,
  activeProperties: any,
  borderRadius: string | undefined,
) => {
  return styled(Box)(
    ({ theme }: any) => `
    position:absolute;
    left:50%;
    top:0%;
    transform:translate(-50%);
    pointer-events:${disabled ? 'none' : 'auto'};
    width:100%;
    height:100%;
    box-sizing:border-box;
    border-radius:${borderRadius ?? `${theme.shape.borderRadius}px`};
    overflow:hidden;
    & ${ButtonRipple}{
      position:absolute;
      left:50%;
      top:40%;
      transform: scale(0) translate(-50%,-5px);
      width:10px;
      height:10px;
      box-sizing:border-box;
      border-radius:${borderRadius ?? `${theme.shape.borderRadius}px`};
      transform-origin:0 0;
    }
    &:hover ~ .MuiTypography-root,&:hover ~ .MuiIcon-root,&:hover ~ svg path	{
        color:${hover.color ? hover.color : 'initial'} !important;
        fill:${hover.color ? hover.color : 'initial'} !important;
    }
    &:hover ${ButtonRipple}{
      opacity:${disabled ? 0 : 1};
      transform: scale(100) translate(-50%,-5px);
      transition:opacity 1s,transform 1s;
      background-color:${hover.backgroundColor};
    }
    &:active ${ButtonRipple}{
      background-color:${activeProperties.backgroundColor} !important;
      opacity:${disabled ? 0 : 1};
      transform: scale(100) translate(-50%,-5px);
      transition:opacity 1s,transform 1s;
    }
`,
  );
};

type XCaliButtonProps = {
  type?: 'filled' | 'hugged';
  px?: number;
  py?: number;
  Component?: any;
  variant?: 'outline' | 'yellow' | 'neutral' | 'pink' | 'blue' | 'ghost';
  disabled?: boolean;
  color?: string;
  onClickFn?: any;
  style?: Record<string, any>;
  bgOverride?: Record<string, any>;
  borderOverride?: any;
  borderRadius?: string;
  width?: string;
  height?: string;
  size?: 'xs' | 'm' | 's' | 'icon';
  orientation?: 'left' | 'right' | 'center';
  StartIcon?: any;
  EndIcon?: any;
  columnGap?: string;
  textVariant?: any;
  showLoader?: boolean;
  rounded?: boolean;
  padding?: string;
  disconnectedText?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'none';
};

export const XCaliButton: React.FC<XCaliButtonProps> = memo(
  ({
    type = 'hugged',
    size = 'm',
    Component = '',
    StartIcon = null,
    EndIcon = null,
    variant = 'outline',
    disabled = false,
    showLoader = false,
    borderRadius = undefined,
    onClickFn = () => null,
    orientation = 'center',
    columnGap = '',
    textVariant = 'body-small-numeric',
    rounded = false,
    padding = '2px 24px 0px',
    disconnectedText = 'Wallet Disconnected',
    textTransform = 'uppercase',
    ...props
  }) => {
    const theme = useTheme();

    const hoverProperties = useMemo(() => {
      switch (variant) {
        case 'outline': {
          return {
            color: 'black',
            backgroundColor: '#FFFFFF',
          };
        }
        case 'pink': {
          return {
            backgroundColor: '#3E2533',
            boxShadow: '0px 4px 15px rgba(54, 37, 47, 0.5)',
          };
        }
        case 'neutral': {
          return {
            backgroundColor: '#D5D5D5',
            boxShadow: '0px 4px 15px rgba(141, 141, 141, 0.5)',
          };
        }
        case 'blue': {
          return {
            backgroundColor: '#142F2F',
            boxShadow: '0px 4px 15px rgba(37, 58, 58, 0.5)',
          };
        }
        case 'yellow': {
          return {
            backgroundColor: '#322813',
            boxShadow: '0px 4px 15px rgba(56, 49, 33, 0.5)',
          };
        }
        case 'ghost': {
          return {
            textDecoration: 'none',
          };
        }
        default: {
          return {
            color: 'white',
            backgroundColor: 'transparent',
            border: '2px transparent solid',
          };
        }
      }
    }, [variant]);

    const baseColorProperties = useMemo(() => {
      switch (variant) {
        case 'outline': {
          return {
            color: 'white',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.palette.neutrals.white}`,
          };
        }
        case 'pink': {
          return {
            color: theme.palette.brand.pink.normal,
            backgroundColor: theme.palette.brand.pink.dark,
          };
        }
        case 'neutral': {
          return {
            color: '#0F1011',
            backgroundColor: theme.palette.neutrals.white,
          };
        }
        case 'blue': {
          return {
            color: theme.palette.brand.accent.normal,
            backgroundColor: theme.palette.brand.accent.dark,
          };
        }
        case 'yellow': {
          return {
            color: theme.palette.brand.yellow.normal,
            backgroundColor: theme.palette.brand.yellow.dark,
          };
        }
        case 'ghost': {
          return {
            background: 'transparent',
          };
        }
        default: {
          return {
            color: 'white',
            backgroundColor: 'transparent',
          };
        }
      }
    }, [variant, theme]);

    const activeProperties = useMemo(() => {
      switch (variant) {
        case 'outline': {
          return {
            backgroundColor: 'white',
            color: 'black',
          };
        }
        case 'pink': {
          return {
            ...hoverProperties,
            color: 'white',
          };
        }
        case 'neutral': {
          return {
            ...hoverProperties,
            backgroundColor: 'white',
          };
        }
        case 'blue': {
          return {
            color: 'white',
            backgroundColor: 'transparent',
          };
        }
        case 'yellow': {
          return {
            color: 'white',
            backgroundColor: 'transparent',
          };
        }
        default: {
          return {
            ...hoverProperties,
            color: 'white',
          };
        }
      }
    }, [variant, hoverProperties]);

    const NewContainer = Container(
      type,
      disabled,
      hoverProperties,
      borderRadius,
      baseColorProperties,
      activeProperties,
      rounded,
      size,
    );

    const RippleContainer = CustomRippleBg(
      disabled,
      hoverProperties,
      activeProperties,
      borderRadius,
    );

    const Loading = Dots(baseColorProperties);

    return (
      <NewContainer
        className="xCaliButton"
        height={BUTTON_HEIGHTS[size]}
        {...props}
        sx={{
          padding,
          '&:hover': {
            backgroundColor: hoverProperties.backgroundColor,
            fill: hoverProperties.color,
            border: hoverProperties.border,
          },
        }}
      >
        <RippleContainer
          onClick={onClickFn}
          {...props}
          width="100%"
          height="100%"
        >
          <ButtonRipple />
        </RippleContainer>
        <Box
          sx={{
            pointerEvents: 'unset',
            position: 'relative',
          }}
        >
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            height={BUTTON_HEIGHTS[size]}
            justifyContent={BUTTON_ORIENTATION[orientation]}
            columnGap={columnGap}
            textAlign={'center'}
            sx={{
              whiteSpace: 'nowrap',
              '&:hover': {
                color: hoverProperties.color,
                fill: hoverProperties.color,
                border: hoverProperties.border,
              },
            }}
            marginTop="-2px"
          >
            {!showLoader ? (
              <>
                {StartIcon}
                <Typography
                  paddingY="0"
                  variant={textVariant}
                  textTransform={textTransform}
                >
                  {Component}
                </Typography>
                {EndIcon}
              </>
            ) : (
              <Loading
                sx={{
                  animation: `${LoadingAnimation(
                    baseColorProperties,
                  )} 1s infinite ease`,
                }}
              />
            )}
          </Box>
        </Box>
      </NewContainer>
    );
  },
);

XCaliButton.displayName = 'XCaliButton';
