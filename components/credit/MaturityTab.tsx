import { Box, Typography, useTheme } from '@mui/material';
import { formatCurrency, formatTimestampToDate } from '@utils/index';
import {
  CreditPair as CreditPairMath,
  useActiveLendingPoolsByMaturity,
} from 'functions/credit';
import { CreditPair } from 'types/credit';
import { Type } from './Pools';
import ToggleButton from '@components/componentLibrary/ToggleButton';

interface TermFilterProps {
  value: any;
  setValue: (newValue: any) => void;
  pair: CreditPair;
  type: Type;
}

export default function MaturityTab({
  value,
  setValue,
  pair,
  type,
}: TermFilterProps) {
  const theme = useTheme();
  const poolsByMaturity = pair?.pools ?? [];
  const maturities = poolsByMaturity.map((val) => Number(val.maturity));

  const setValueAsNum = (maturity: number, index?: number) => {
    const val = index;
    setValue(val ?? 0);
  };

  return (
    <ToggleButton
      header={'Select an expiry date'}
      value={maturities[value]}
      setValue={setValueAsNum}
      isSelected={(data, val) => data === val}
      values={maturities}
      sx={{ background: theme.palette.neutrals[100] }}
      renderedOption={(value: number, _: boolean, index: number) => (
        <Box display="flex" flexDirection="column">
          <Typography variant="body-small-regular">
            {formatTimestampToDate(value * 1000)
              .split(' ')
              .slice(1, 4)
              .reduce((prev, curr) => prev + ' ' + curr, '')}
          </Typography>
          <Typography variant="title-small-numeric">
            {type !== 'Provide Liquidity'
              ? formatCurrency(
                  poolsByMaturity[index]
                    ? poolsByMaturity[index].maxAPR?.toFixed()
                    : '0',
                )
              : formatCurrency(
                  CreditPairMath.calculateApr(
                    poolsByMaturity[index].X,
                    poolsByMaturity[index].Y,
                  )
                    .times(100)
                    .toFixed(),
                )}
            % APR
          </Typography>
        </Box>
      )}
    />
  );
}
