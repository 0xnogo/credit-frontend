import { Box, Typography, styled, useTheme } from '@mui/material';
import Toggle from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const StyledContainer = styled(Box)`
  display: flex;
  padding: 0px;
  gap: 8px;
`;

const StyledToggleButton = styled<any>(Toggle)(
  ({ theme }: any) =>
    `
    display: flex;
    padding: 11.5px 20px;
    width: 100%;
  
    border-radius: 6px;
    border: none;
  
    font-family: 'DM Sans', 'sans-serif';
    font-weight: ${({ selected }: { selected: number }) =>
      selected ? 700 : 400};
    font-size: 14px;
    line-height: 150%;
    &:hover {
      background: ${theme.palette.neutrals[40]} !important;
    }
  `,
);

type Options<T> = {
  header?: string;
  value: T;
  setValue: (val: T, index?: number) => any;
  values: T[];
  isSelected: (val: T, currentVal: T) => boolean;
  renderedOption: (value: T, isSelected: boolean, index: number) => JSX.Element;
  sx?: Record<string, any>;
  toggleButtonSx?: Record<string, any>;
  horizontal?: boolean;
};

export default function ToggleButton<T>({
  header,
  value,
  setValue,
  renderedOption,
  values,
  isSelected,
  sx = {},
  toggleButtonSx = {},
  horizontal = false,
}: Options<T>) {
  const theme = useTheme();

  const handleChange = (_: any, newValue: T, index: number) => {
    if (newValue !== value) {
      setValue(newValue, index);
    }
  };

  return (
    <StyledContainer
      flexDirection={horizontal ? 'row' : 'column'}
      alignItems={horizontal ? 'center' : 'initial'}
    >
      {header && (
        <Typography
          variant="body-moderate-regular"
          color={theme.palette.neutrals[15]}
        >
          {header}
        </Typography>
      )}
      <ToggleButtonGroup
        color="primary"
        value={value}
        exclusive
        aria-label="Term"
        sx={{
          background: theme.palette.neutrals[80],
          padding: '8px',
          gap: '10px',
          borderRadius: '8px',
          ...sx,
        }}
      >
        {values.map((data: T, index) => (
          <StyledToggleButton
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '8px 16px',
              borderRadius: '8px',
              background: isSelected(data, value)
                ? theme.palette.neutrals[40]
                : 'initial',
              ...toggleButtonSx,
            }}
            value={data}
            selected={isSelected(data, value)}
            onClick={() => handleChange('', data, index)}
            key={data}
          >
            {renderedOption(data, isSelected(data, value), index)}
          </StyledToggleButton>
        ))}
      </ToggleButtonGroup>
    </StyledContainer>
  );
}
