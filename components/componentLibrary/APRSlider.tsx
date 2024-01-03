import { Box, Slider, Tooltip, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import SubCard from './Card/SubCard';

const lendText = {
  Safe: (
    <Box>
      <Typography variant="body-small-numeric">{`APR > 30%`}</Typography>
    </Box>
  ),
  Moderate: (
    <Box>
      <Typography variant="body-small-numeric">
        {`APR <= 30% && APR >= 10%`}
      </Typography>
    </Box>
  ),
  Risky: (
    <Box>
      <Typography variant="body-small-numeric">{`APR < 10%`}</Typography>
    </Box>
  ),
};

const borrowText = {
  Safe: (
    <Box display="flex" flexDirection="column">
      <Typography variant="body-small-numeric">{`APR < 10%`}</Typography>
      <Typography variant="body-small-numeric">{`CDP >= 100%`}</Typography>
    </Box>
  ),
  Moderate: (
    <Box display="flex" flexDirection="column">
      <Typography variant="body-small-numeric">
        {`APR >= 10% && APR <= 15%`}
      </Typography>
    </Box>
  ),
  Risky: (
    <Box display="flex" flexDirection="column">
      <Typography variant="body-small-numeric">{`APR > 15%`}</Typography>
      <Typography variant="body-small-numeric">{`APR < 100%`}</Typography>
    </Box>
  ),
};

const texts = {
  lend: lendText,
  borrow: borrowText,
};

function valuetext(value: number) {
  return `${value}%`;
}

interface APRSliderProps {
  color: 'lend' | 'borrow' | 'liquidity';
  apr: number;
  setAPR: (val: number) => void;
  status?: 'Safe' | 'Moderate' | 'Risky';
}

const TooltipText = ({
  type,
}: {
  status: 'Safe' | 'Moderate' | 'Risky';
  type: 'lend' | 'borrow';
}) => {
  return (
    <Box display="flex" flexDirection="column" gap="6px">
      <SubCard header="Safe" padding="10px">
        {texts[type].Safe}
      </SubCard>
      <SubCard header="Moderate" padding="10px">
        {texts[type].Moderate}
      </SubCard>
      <SubCard header="Risky" padding="10px">
        {texts[type].Risky}
      </SubCard>
    </Box>
  );
};

export function APRSlider({
  color,
  apr,
  setAPR,
  status = 'Safe',
}: APRSliderProps) {
  const theme = useTheme();

  const sliderColor = useMemo(() => {
    return color === 'lend'
      ? theme.palette.brand.accent.normal
      : color === 'borrow'
      ? theme.palette.brand.yellow.normal
      : theme.palette.brand.pink.normal;
  }, [theme, color]);

  const statusColor = useMemo(
    () =>
      status === 'Safe'
        ? theme.palette.brand.green
        : status === 'Moderate'
        ? theme.palette.warning.main
        : theme.palette.error.main,
    [status, theme],
  );

  return (
    <Box display="flex" flexDirection="column" width="100%" gap="6px">
      <Box
        display="flex"
        flexDirection="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center" gap="6px">
          <Typography
            variant="body-small-regular"
            color={theme.palette.neutrals[15]}
            sx={{
              borderBottom: `1px dashed ${theme.palette.neutrals[15]}`,
              lineHeight: '1.5',
            }}
          >
            Adjust Risk Parameters
          </Typography>
          <RestartAltIcon
            onClick={() => setAPR(50)}
            sx={{ color: theme.palette.neutrals[15], cursor: 'pointer' }}
          />
        </Box>
        <Box display="flex" flexDirection="row" gap="3px" alignItems="center">
          <Typography
            color={theme.palette.neutrals[15]}
            variant="body-small-regular"
          >
            Levels:
          </Typography>
          <Box display="flex" alignItems="center" gap="3px">
            <Typography variant="body-small-regular" color={statusColor}>
              {status}
            </Typography>
            {/*@ts-ignore */}
            <Tooltip title={<TooltipText type={color} />}>
              <InfoIcon
                sx={{ fontSize: '15px', cursor: 'pointer', color: statusColor }}
              />
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <Slider
        value={apr}
        //@ts-ignore
        onChange={(e) => setAPR(e.target.value)}
        defaultValue={0.00000005}
        getAriaValueText={valuetext}
        valueLabelFormat={valuetext}
        step={1}
        marks={[{ value: 0 }, { value: 33 }, { value: 66 }, { value: 99 }]}
        min={0}
        max={100}
        valueLabelDisplay="auto"
        sx={{
          ['& .MuiSlider-rail']: {
            height: '8px',
          },
          ['& .MuiSlider-track']: {
            height: '8px',
            color: sliderColor,
          },
          ['& .MuiSlider-thumb']: {
            color: sliderColor,
          },
          ['& .MuiSlider-mark']: {
            height: '8px',
            width: '8px',
            borderRadius: '100%',
            color: theme.palette.neutrals[15],
          },
        }}
      />
    </Box>
  );
}
