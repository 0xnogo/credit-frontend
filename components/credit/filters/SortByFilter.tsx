import {
  CustomSelect,
  StyledOption,
} from '@components/componentLibrary/XCaliSelect';
import { Box } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

export const marketPageFilters = {
  Default: 0,
  'Newest First': 1,
  'Oldest First': 2,
  'Yield - High to Low': 3,
  'Yield - Low to High': 4,
  'Reserves - High to Low': 5,
  'Reserves - Low to High': 6,
};

interface SortByFilter {
  filter: number;
  setFilter: Dispatch<SetStateAction<number>>;
}

export function SortByFilter({ filter, setFilter }: SortByFilter) {
  return (
    <Box sx={{ width: '220px' }}>
      <CustomSelect
        value={filter}
        style={{ height: '48px', background: '#0F0F0F' }}
      >
        {Object.keys(marketPageFilters).map((value, index) => (
          <StyledOption
            key={index}
            value={index}
            onClick={() => setFilter(index)}
          >
            Sort By: {value}
          </StyledOption>
        ))}
      </CustomSelect>
    </Box>
  );
}
