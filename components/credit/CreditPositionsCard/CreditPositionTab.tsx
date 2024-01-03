import TabsUnstyled from '@mui/base/Tabs';
import TabsListUnstyled from '@mui/base/TabsList';
import { Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import * as React from 'react';

const TabBox = styled(Box)();

interface TabProps {
  children: React.ReactNode;
  onClick: (arg: number) => void;
  value: number;
}

const CustomTab = ({ children, onClick, value }: TabProps) => {
  const TabElem = styled(TabsUnstyled)(
    `
    cursor: pointer;
    width: 100%;
    display: flex;
    justify-content: center;
    border-radius: 12px;
    background-color: transparent;
    border: none;
    text-align: center;

    & .MuiBox-root {
      transition: transform 0.3s;
    }
    
    &:hover {
      & > .MuiBox-root > .MuiBox-root {
        transform: translateY(-42px);
        background-color: white;
      }
    }
  `,
  );

  return (
    <TabElem onClick={onClick} value={value}>
      {children}
    </TabElem>
  );
};

const TabsList = styled(TabsListUnstyled)(
  `
    background-color:transparent;
    display: flex;
    align-items: baseline;
    justify-content: center;
    width: 100%;
  `,
);

interface CreditPositionTabProps {
  labels: string[];
  selectedIndex: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
}

export function CreditPositionTab({
  labels,
  selectedIndex,
  setSelected,
}: CreditPositionTabProps) {
  const theme = useTheme();
  const handleChange = (value: number) => {
    setSelected(value);
  };

  const colors = React.useMemo(
    () => [
      theme.palette.brand.accent.normal,
      theme.palette.brand.yellow.normal,
      theme.palette.brand.pink.normal,
    ],
    [theme],
  );

  return (
    <TabsUnstyled value={selectedIndex}>
      <TabsList sx={{ columnGap: '1rem' }}>
        {labels.map((label, index) => (
          <CustomTab
            onClick={() => handleChange(index)}
            value={index}
            key={index}
          >
            <Box
              width="100%"
              display="flex"
              flexDirection="column-reverse"
              gap="8px"
            >
              <TabBox
                border={
                  index !== selectedIndex
                    ? `1px solid ${theme.palette.neutrals[15]}`
                    : `1px solid ${colors[index]}`
                }
                sx={{
                  backgroundColor:
                    index !== selectedIndex
                      ? theme.palette.neutrals[15]
                      : `${colors[index]}`,
                }}
              />
              <Typography
                variant={
                  index === selectedIndex
                    ? 'body-moderate-medium'
                    : 'body-moderate-regular'
                }
                sx={{
                  color:
                    index !== selectedIndex
                      ? theme.palette.neutrals[15]
                      : colors[index],
                }}
              >
                {label}
              </Typography>
            </Box>
          </CustomTab>
        ))}
      </TabsList>
    </TabsUnstyled>
  );
}
