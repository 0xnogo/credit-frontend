import { Box } from '@mui/material';
import { Token } from 'types/assets';
import { SvgContainer } from './SvgContainer';
import CurrencyLogo from '@components/componentLibrary/Logo/CurrencyLogo';
import { RotatedBox } from './CreditLogo';

interface AnimatedTokenLogoProps {
  token: Token;
  width: number;
  height: number;
  currencySize: number;
  stroke: string;
}

export const AnimatedCurrencyLogo = ({
  token,
  width,
  height,
  currencySize,
  stroke,
}: AnimatedTokenLogoProps) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: width,
        height: height,
      }}
    >
      <RotatedBox sx={{ background: '#0F0F0F', borderRadius: '100%' }}>
        <SvgContainer width={width} height={height} color="none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={263}
            height={263}
            viewBox="0 0 64 64"
            fill="none"
          >
            <g opacity="1" filter="url(#filter0_d_288_34827)">
              <path
                d="M60.1992 32.1992C60.1992 39.7894 57.1791 46.6742 52.275 51.7175M32.1992 60.1992C23.1123 60.1992 15.0363 55.8705 9.92092 49.1627C6.33105 44.4553 4.19922 38.5762 4.19922 32.1992M19.0167 7.49029C22.9452 5.39001 27.4332 4.19922 32.1992 4.19922C45.7742 4.19922 57.093 13.8597 59.6556 26.681M60.2005 32.1991C60.2005 39.7893 57.1804 46.6741 52.2763 51.7174"
                stroke={stroke}
                strokeLinecap="round"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_288_34827"
                x="0.699219"
                y="0.699219"
                width="63.0015"
                height="63"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="1.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.384314 0 0 0 0 0.494118 0 0 0 0 0.917647 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_288_34827"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_288_34827"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </SvgContainer>
      </RotatedBox>
      <Box
        position="absolute"
        top={'50%'}
        left={'50%'}
        sx={{ transform: 'translate(-50%,-50%)' }}
      >
        <CurrencyLogo size={currencySize} token={token} />
      </Box>
    </Box>
  );
};
