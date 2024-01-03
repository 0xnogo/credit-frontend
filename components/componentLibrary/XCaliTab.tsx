import {
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
  useTheme,
} from '@mui/material';

const StyledToggleButton = styled(ToggleButton)(({ selected, theme }) => ({
  display: 'flex',
  padding: '11.5px 20px',
  width: '100%',
  borderRadius: '6px',
  border: 'none',
  fontFamily: 'Inter, sans-serif',
  fontWeight: selected ? 700 : 400,
  fontSize: '14px',
  lineHeight: '150%',
  color: theme.palette.neutrals.white,
  background: selected
    ? theme.palette.neutrals[80]
    : theme.palette.neutrals[100],

  '&.Mui-selected, &:hover': {
    color: theme.palette.neutrals.white,
    borderRadius: '8px',
    background: theme.palette.neutrals[40],
  },
}));

interface XCaliTabProps {
  value?: number;
  setValue: (arg: any) => void;
  tabs?: string[];
}

export default function XCaliTab({
  value,
  setValue,
  tabs = [],
}: XCaliTabProps) {
  const onClick = (newValue: any) => {
    setValue(newValue);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={value}
      exclusive
      aria-label="Term"
      style={{
        background: '#0F0F0F',
        padding: '8px',
        gap: '10px',
        borderRadius: '8px',
      }}
    >
      {tabs.map((tab, index) => {
        return (
          <StyledToggleButton
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '8px 16px',
              borderRadius: '8px',
            }}
            value="Maturity1"
            selected={value === index}
            onClick={() => onClick(index)}
          >
            <Typography variant="body-small-regular">{tab}</Typography>
          </StyledToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
