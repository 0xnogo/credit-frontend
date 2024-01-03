import SubCard from '@components/componentLibrary/Card/SubCard';
import { UNKNOWN_ICON } from '@components/componentLibrary/Logo/Logo';
import ToggleButton from '@components/componentLibrary/ToggleButton';
import { AnimatedCurrencyLogo } from '@components/icons/svgs/AnimatedToken';
import { ETHERSCAN_URL } from '@constants/index';
import { useLendingPairsInfo } from '@functions/credit';
import { isPoolMatured } from '@functions/credit/utils';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Box,
  Link,
  Skeleton,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { formatCurrency, formatToDays } from '@utils/index';
import BigNumber from 'bignumber.js';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import ProgressBar from 'components/componentLibrary/Progress';
import { usePoolInfo } from 'hooks/credit/usePoolInfo';
import { useEffect, useState } from 'react';
import { CreditPair } from 'types/credit';
import { Type } from '.';

interface PoolsTopSectionProps {
  openModal: (arg: Type) => void;
  pair: CreditPair;
  isLoading: boolean;
  maturityIndex: number;
  selectMaturityIndex: any;
  checked: boolean;
  setChecked: (val: boolean) => void;
}

const defaultColor = '#141C3A';

function shadeColor(R: number, G: number, B: number, percent: number) {
  R = (R * (100 + percent)) / 100;
  G = (G * (100 + percent)) / 100;
  B = (B * (100 + percent)) / 100;

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  var RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
}

function get_average_rgb(imgEl: HTMLImageElement) {
  var blockSize = 5, // only visit every 5 pixels
    defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
    canvas = document.createElement('canvas'),
    context = canvas.getContext && canvas.getContext('2d'),
    data,
    width,
    height,
    i = -4,
    length,
    rgb = { r: 0, g: 0, b: 0 },
    count = 0;

  if (!context) {
    return defaultRGB;
  }

  height = canvas.height =
    imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

  context.drawImage(imgEl, 0, 0);

  try {
    data = context.getImageData(0, 0, width, height);
  } catch (e) {
    /* security error, img on diff domain */ alert('x');
    return defaultRGB;
  }

  length = data.data.length;

  while ((i += blockSize * 4) < length) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i + 1];
    rgb.b += data.data[i + 2];
  }

  // ~~ used to floor values
  rgb.r = ~~(rgb.r / count);
  rgb.g = ~~(rgb.g / count);
  rgb.b = ~~(rgb.b / count);

  return rgb;
}

export default function PoolTopSection({
  openModal,
  pair: selectedPair,
  isLoading,
  maturityIndex,
  selectMaturityIndex,
  checked,
  setChecked,
}: PoolsTopSectionProps) {
  const { isValidating: isLoadingPair } = useLendingPairsInfo();

  const { chainId } = useActiveWeb3React();

  const [color, setColor] = useState(defaultColor);
  const [ellipseColor, setEllipseColor] = useState(defaultColor);

  const gradientColor = `linear-gradient(94deg, ${color} 14.71%, rgba(0, 0, 0, 0) 111.33%)`;

  const media935px = useMediaQuery('(max-width:935px)');

  const theme = useTheme();
  const { asset, collateral } = selectedPair || {};

  const { pools } = selectedPair || {};
  const maturities =
    pools?.map((pool) => pool.maturity - pool.dateCreated) ?? [];

  const hideImage = useMediaQuery('(max-width:714px)');

  let selectedPool = pools?.[maturityIndex];

  const creditPairInfo = usePoolInfo(
    selectedPair?.address,
    selectedPool?.maturity,
  );

  if (creditPairInfo && selectedPool) {
    selectedPool = { ...selectedPool, ...creditPairInfo };
  }

  const hasExpired = Number(selectedPool?.maturity) <= Date.now() / 1000;

  const tvl = formatCurrency(
    new BigNumber(selectedPool?.assetReserveUSD ?? 0)
      .plus(selectedPool?.collateralReserveUSD ?? 0)
      .toFixed(),
  );

  function getImageParams(e: any) {
    //@ts-ignore
    if (this.src === UNKNOWN_ICON) {
      setColor(defaultColor);
    } else {
      //@ts-ignore
      const color = get_average_rgb(this);
      setColor(shadeColor(color.r, color.g, color.b, -70));
      setEllipseColor(shadeColor(color.r, color.g, color.b, 40));
    }
  }

  useEffect(() => {
    const image = new Image(100, 100);
    image.setAttribute('crossOrigin', '');
    if (asset) {
      image.src = asset?.logoURI ?? UNKNOWN_ICON;
    } else {
      image.src = UNKNOWN_ICON;
    }
    image.addEventListener('load', getImageParams);
    return () => {
      image.removeEventListener('load', getImageParams);
    };
  }, [asset]);

  return (
    <Box
      sx={{
        background: gradientColor,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        paddingTop: '20px',
        justifyContent: 'space-between',
        paddingX: media935px ? '20px' : '0px',
      }}
    >
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          width: '100%',
          flex: 1,
        }}
      >
        <Box display="flex" alignItems={'center'} flex={3}>
          <Box
            sx={{
              transform: 'translateX(-20%)',
              display: hideImage ? 'none' : 'initial',
              position: 'relative',
            }}
          >
            <AnimatedCurrencyLogo
              stroke={ellipseColor}
              width={263}
              height={263}
              token={asset}
              currencySize={180.813}
            />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            padding="0"
            flex={3}
            flexWrap="wrap"
          >
            <Box
              display="flex"
              flexDirection="column"
              gap="16px"
              justifyContent="center"
            >
              <Box
                display="flex"
                flexDirection="column"
                gap="2px"
                maxWidth="100%"
                whiteSpace="nowrap"
              >
                <Box display="flex" alignItems="center" color="white">
                  <Typography variant="body-small-numeric">Expired</Typography>
                  <Switch
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                  />
                  <Typography variant="body-small-numeric">Active</Typography>
                </Box>
                <Box display="flex" gap="8px" alignItems="center">
                  <Typography
                    variant="title-small-semibold"
                    color={theme.palette.neutrals[15]}
                  >
                    Collateral:
                  </Typography>
                  {isLoadingPair ? (
                    <Skeleton
                      animation="wave"
                      variant="rectangular"
                      sx={{ width: '150px' }}
                    />
                  ) : (
                    <Link
                      sx={{ textDecoration: 'none' }}
                      href={`${ETHERSCAN_URL[chainId]}/address/${collateral?.address}`}
                      target="_blank"
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      gap="6px"
                    >
                      <Typography
                        variant="title-small-semibold"
                        color="#F4F4F4"
                      >
                        {collateral?.symbol}
                      </Typography>
                      <OpenInNewIcon
                        sx={{ color: 'white', fontSize: '22px' }}
                      />
                    </Link>
                  )}
                </Box>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap="12px"
                >
                  <Box display="flex" gap="8px" alignItems="center">
                    <Typography variant="title-large-semibold" color="#F4F4F4">
                      Borrow
                    </Typography>
                    {isLoadingPair ? (
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        sx={{ width: '150px', height: '30px' }}
                      />
                    ) : (
                      <Link
                        sx={{ textDecoration: 'none' }}
                        href={`${ETHERSCAN_URL[chainId]}/address/${asset?.address}`}
                        target="_blank"
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        gap="6px"
                      >
                        <Typography
                          variant="title-large-semibold"
                          color="#F4F4F4"
                        >
                          {asset?.symbol}
                        </Typography>
                        <OpenInNewIcon
                          sx={{ color: 'white', fontSize: '22px' }}
                        />
                      </Link>
                    )}
                  </Box>
                  <SubCard
                    padding="4px 8px 4px 8px"
                    style={{
                      borderRadius: '8px',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      width="6.67px"
                      height="6.67px"
                      borderRadius={'100%'}
                      borderColor="transparent"
                      sx={{ background: hasExpired ? 'red' : '#16E08B' }}
                    />
                    {isLoadingPair ? (
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        sx={{ width: '70px' }}
                      />
                    ) : (
                      <Typography variant="body-small-numeric">
                        {hasExpired ? 'INACTIVE' : 'ACTIVE'}
                      </Typography>
                    )}
                  </SubCard>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                gap="10px"
                maxWidth="650px"
              >
                <HorizontalInfo
                  type="medium"
                  header={'Utilization Rate'}
                  value={
                    (isPoolMatured(selectedPool?.maturity ?? 0)
                      ? '0'
                      : formatCurrency(selectedPool?.utilRate ?? 0)) + '%'
                  }
                  isLoading={isLoadingPair}
                  toolTipText="Percentage of Supplied Assets Borrowed"
                />

                <ProgressBar value={selectedPool?.utilRate ?? 0} />
                <HorizontalInfo
                  type="medium"
                  header={'Total Reserves Value'}
                  value={`$${tvl}`}
                  isLoading={isLoadingPair}
                  toolTipText="Total Value of Assets and Collateral in the Pool"
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          gap="8px"
          alignItems="end"
          paddingBottom="54px"
          minWidth="300px"
          width="100%"
          justifyContent="center"
          flex={2}
        >
          <XCaliButton
            variant="blue"
            Component="Lend"
            showLoader={isLoading}
            disabled={isLoading || !selectedPair || !checked}
            size="s"
            onClickFn={() => openModal('Lend')}
          />
          <XCaliButton
            variant="yellow"
            Component="Borrow"
            showLoader={isLoading}
            disabled={isLoading || !selectedPair || !checked}
            size="s"
            onClickFn={() => openModal('Borrow')}
          />
          <XCaliButton
            variant="pink"
            Component="Provide Liquidity"
            showLoader={isLoading}
            disabled={isLoading || !selectedPair || !checked}
            size="s"
            onClickFn={() => openModal('Provide Liquidity')}
          />
        </Box>
      </Box>
      <Box
        sx={{
          position: 'relative',
          width: '1200px',
          maxWidth: '100%',
          margin: '0px auto 0px auto',
          transform: 'translateX(-20px)',
        }}
      >
        <ToggleButton
          sx={{
            backgroundColor: 'transparent',
            padding: '0 !important',
            gap: '0 !important',
          }}
          value={maturityIndex}
          setValue={(val: any) => selectMaturityIndex(val)}
          values={maturities.map((_, index) => index)}
          isSelected={(val, currentVal) => val === currentVal}
          toggleButtonSx={{
            padding: '0px !important',
            background: 'transparent',
            marginRight: '6px',
            height: '44px !important',
            width: '150px',
            borderBottomLeftRadius: '0',
            borderBottomRightRadius: '0',
          }}
          renderedOption={(
            value: number,
            isSelected: boolean,
            index: number,
          ) => (
            <Box
              sx={{
                borderRadius: '8px 8px 0px 0px !important',
                gap: '8px !important',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isSelected
                  ? `${theme.palette.neutrals[100]} !important`
                  : 'transparent',
                width: '150px !important',
                height: '50px',
                marginBottom: '-12px',
                marginTop: '-10px',
                paddingTop: '0px',
                color: isSelected ? theme.palette.neutrals.white : '#A6A6A6',
              }}
            >
              <AccessTimeIcon
                sx={{
                  fontSize: '15px',
                }}
              />{' '}
              <Typography fontWeight={isSelected ? 600 : 400}>
                {pools[index].matured
                  ? 'Expired'
                  : formatToDays([pools?.[value].maturity ?? 0])}
              </Typography>
            </Box>
          )}
        />
      </Box>
    </Box>
  );
}
