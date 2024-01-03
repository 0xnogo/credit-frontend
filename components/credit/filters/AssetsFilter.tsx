import CurrencyLogo from '@components/componentLibrary/Logo/CurrencyLogo';
import {
  CustomSelect,
  StyledOption,
} from '@components/componentLibrary/XCaliSelect';
import { Box } from '@mui/material';
import { Token } from 'types/assets';
import { useTokenMapping } from 'hooks/useTokenMapping';
import { Dispatch, SetStateAction, useMemo } from 'react';

interface AssetsFilter {
  token: Token;
  setToken: Dispatch<SetStateAction<Token | null>>;
  placeholder: string;
}

export function AssetsFilter({ token, setToken, placeholder }: AssetsFilter) {
  const { data: tokenMapping = {} } = useTokenMapping();

  const allTokens = useMemo(
    () => Object.keys(tokenMapping).map((key) => tokenMapping[key]),
    [tokenMapping],
  );

  return (
    <Box sx={{ width: '140px' }}>
      <CustomSelect
        placeholder={placeholder}
        value={!token ? 'None' : token}
        style={{ height: '48px', background: '#0F0F0F' }}
      >
        <StyledOption value={'None'} onClick={() => setToken(null)}>
          Select {placeholder}
        </StyledOption>
        {allTokens.map((value, index) => (
          <StyledOption
            value={value}
            key={index}
            onClick={() => setToken(value)}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <CurrencyLogo token={value} size={20} />
            {value.symbol}
          </StyledOption>
        ))}
      </CustomSelect>
    </Box>
  );
}
