import { Box, keyframes, styled } from '@mui/material';
import { SvgContainer } from './SvgContainer';
import CurrencyLogo from '@components/componentLibrary/Logo/CurrencyLogo';
import { Token } from 'types/assets';

const spin = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
`;

export const RotatedBox = styled(Box)({
  animation: `${spin} 5s infinite linear`,
});

const Ellipse = ({ width = '252px', height = '252px' }) => {
  return (
    <SvgContainer width={width} height={height} color="none">
      <>
        <g opacity="0.5" filter="url(#filter0_d_983_36776)">
          <path
            d="M237.512 127.268C237.512 157.154 225.62 184.263 206.31 204.121M127.262 237.518C91.4818 237.518 59.6828 220.473 39.5409 194.061C25.4058 175.526 17.0117 152.377 17.0117 127.268M75.3557 29.9762C90.8242 21.7063 108.495 17.0176 127.262 17.0176C180.713 17.0176 225.281 55.0558 235.371 105.539M237.517 127.267C237.517 157.154 225.625 184.262 206.315 204.12"
            stroke="#0F1011"
            stroke-width="3.9375"
            strokeLinecap="round"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_983_36776"
            x="3.23047"
            y="3.23633"
            width="248.066"
            height="248.062"
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
            <feGaussianBlur stdDeviation="5.90625" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.429167 0 0 0 0 0.429167 0 0 0 0 0.429167 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_983_36776"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_983_36776"
              result="shape"
            />
          </filter>
        </defs>
      </>
    </SvgContainer>
  );
};

export const CreditLogo = ({ width = '252px', height = '252px' }) => {
  return (
    <SvgContainer width={width} height={height} color="none">
      <>
        <rect width={width} height={height} rx="126" fill="#0F0F0F" />

        <rect x="30" y="25" width="203" height="203" rx="101.5" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M121.549 33.3585C111.448 34.4581 99.2274 38.152 89.5037 43.045C82.6085 46.515 72.6919 53.2295 69.4216 56.6433L67.4688 58.6814L76.2025 67.4341L84.9355 76.1868L87.6794 73.9687C112.996 53.4954 147.717 52.6679 173.052 71.9339L178.542 76.1083L187.262 67.3333L195.983 58.5589L192.601 55.4659C182.556 46.2788 166.698 38.399 151.323 34.9561C145.306 33.6096 127.85 32.6724 121.549 33.3585ZM119.862 77.3371C114.498 78.5091 104.249 83.4623 100.573 86.6602L97.866 89.0144L106.558 97.7576L115.25 106.501L120.017 104.058C124.609 101.706 124.587 101.133 131.501 101.133C136.101 101.133 139.257 101.68 143.615 104.088L148.088 106.561L156.81 97.788L165.533 89.0144L162.826 86.6602C159.288 83.5834 149.135 78.706 143.402 77.3304C137.812 75.9885 126.018 75.9919 119.862 77.3371ZM91.0864 96.3575C79.7036 111.265 77.8657 132.485 86.4716 149.656C87.8587 152.425 90.133 155.994 91.5256 157.588L94.057 160.486L102.901 151.682L111.745 142.879L110.128 140.499C105.002 132.956 105.001 120.351 110.125 112.81L111.74 110.434L103.121 101.796C98.3809 97.0444 94.283 93.1576 94.0157 93.1576C93.7485 93.1576 92.4303 94.5975 91.0864 96.3575ZM125.563 119.717C121.216 123.71 121.221 129.814 125.575 133.637C129.719 137.275 134.637 137.077 138.429 133.12C142.111 129.277 141.85 123.405 137.835 119.717C135.737 117.79 134.978 117.518 131.699 117.518C128.42 117.518 127.662 117.79 125.563 119.717ZM146.586 147.731C144.35 149.462 139.767 151.239 135.588 151.997C130.508 152.919 125.03 151.949 119.331 149.12L115.082 147.011L106.643 155.43C102.002 160.06 98.2043 164.173 98.2043 164.57C98.2043 165.369 107.343 171.489 111.082 173.192C120.938 177.683 135.076 178.617 145.641 175.475C153.442 173.156 165.087 166.632 165.168 164.536C165.182 164.159 161.312 159.987 156.567 155.267C148.365 147.108 147.872 146.736 146.586 147.731ZM174.547 180.352C150.917 199.923 115.071 200.362 90.1601 181.383C87.5312 179.38 85.1399 177.741 84.8462 177.741C84.5526 177.741 80.5223 181.54 75.8905 186.183L67.4694 194.624L69.4724 196.74C75.3296 202.926 91.3822 212.272 102.291 215.846C112.795 219.287 117.95 220.018 131.699 220.018C145.449 220.018 150.606 219.286 161.107 215.845C172.074 212.251 184.888 204.917 193.499 197.306L196.245 194.88L187.405 185.972C182.544 181.073 178.527 177.088 178.478 177.117C178.429 177.146 176.66 178.602 174.547 180.352Z"
          fill="#F4F4F4"
        />
        <path
          d="M38.9492 112.106C41.5341 95.7848 49.4389 78.5413 59.8792 66.4486C61.6595 64.3861 63.322 62.6992 63.5744 62.6992C64.1834 62.6992 80.6312 79.1219 80.6312 79.7302C80.6312 79.9908 78.9544 82.4308 76.9055 85.1537C71.0279 92.9645 67.4409 100.434 64.6192 110.743C62.7232 117.669 62.9059 136.21 64.946 143.899C66.9118 151.309 72.8624 163.368 77.2181 168.77C79.0951 171.098 80.6312 173.234 80.6312 173.517C80.6312 173.8 76.8297 177.823 72.1837 182.458L63.7362 190.886L60.9801 188.2C52.5285 179.966 43.1811 161.292 39.6333 145.556C37.966 138.159 37.6067 120.585 38.9492 112.106Z"
          fill="#F4F4F4"
        />
        <path
          d="M168.375 92.3303L174.748 85.9899C178.252 82.5023 181.475 79.6414 181.908 79.6319C183.568 79.5961 190.734 89.7068 194.372 97.2165C206.015 121.252 202.001 151.81 184.641 171.303L182.23 174.01L175.754 167.595C172.193 164.067 169.278 160.921 169.278 160.604C169.278 160.287 170.296 158.759 171.54 157.207C177.969 149.189 182.114 137.188 182.13 126.549C182.144 116.797 176.929 102.254 170.915 95.2771L168.375 92.3303Z"
          fill="#F4F4F4"
        />
        <defs>
          <filter
            id="filter0_d_983_36776"
            x="3.23047"
            y="3.23633"
            width="248.066"
            height="248.062"
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
            <feGaussianBlur stdDeviation="5.90625" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.429167 0 0 0 0 0.429167 0 0 0 0 0.429167 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_983_36776"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_983_36776"
              result="shape"
            />
          </filter>
        </defs>
      </>
    </SvgContainer>
  );
};

export const AnimatedCreditLogo = () => {
  return (
    <Box position="relative">
      <RotatedBox width="fit-content" position="absolute" top="0" left="0">
        <Ellipse />
      </RotatedBox>
      <CreditLogo />
    </Box>
  );
};

export const AnimatedTokenLogo = ({ token }: { token: Token }) => {
  return (
    <Box position="relative" minWidth="10px">
      <Box width="fit-content" position="absolute" top="0" left="0">
        <Ellipse />
      </Box>
      <Box position="relative" sx={{ transform: 'translate(35px,30px)' }}>
        <CurrencyLogo token={token} size={180.81} />
      </Box>
    </Box>
  );
};
