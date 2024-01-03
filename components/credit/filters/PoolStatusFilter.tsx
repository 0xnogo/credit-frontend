import {
  CustomSelect,
  StyledOption,
} from '@components/componentLibrary/XCaliSelect';
import { Box } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

interface PoolStatusFilter {
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
}

export function PoolStatusFilter({ isActive, setIsActive }: PoolStatusFilter) {
  return (
    <Box sx={{ width: '135px' }}>
      <CustomSelect
        value={isActive}
        style={{ height: '48px', background: '#0F0F0F' }}
      >
        <StyledOption value={true} onClick={() => setIsActive(true)}>
          Active Pools
        </StyledOption>
        <StyledOption value={false} onClick={() => setIsActive(false)}>
          Expired Pools
        </StyledOption>
      </CustomSelect>
    </Box>
  );
}
