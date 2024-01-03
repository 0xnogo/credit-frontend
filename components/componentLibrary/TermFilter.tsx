import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import ToggleButton from './ToggleButton';

const loanTerms = ['All', '< 1 Month', '> 1 Month'];

interface TermFilterProps {
  value: number;
  setValue: (newValue: number) => void;
}

export default function TermFilter({ value, setValue }: TermFilterProps) {
  const theme = useTheme();
  const media451 = useMediaQuery('(max-width:451px)');
  return (
    <ToggleButton
      header={!media451 ? 'Loan Term:' : ''}
      value={loanTerms[value]}
      setValue={(val: string) => setValue(loanTerms.indexOf(val))}
      isSelected={(data, val) => data === val}
      values={loanTerms}
      toggleButtonSx={{
        padding: '0px 8px !important',
        height: '32px',
        width: '115px',
      }}
      sx={{ padding: '8px' }}
      renderedOption={(value: string, isSelected: boolean) => (
        <Box display="flex" flexDirection="column">
          <Typography
            fontWeight={isSelected ? 500 : 400}
            fontSize="12px"
            color={isSelected ? 'white' : theme.palette.neutrals[15]}
          >
            {value}
          </Typography>
        </Box>
      )}
      horizontal
    />
  );
}
