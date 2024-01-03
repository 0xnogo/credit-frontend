import { Box, Popover, Typography } from '@mui/material';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { useEffect, useRef, useState } from 'react';
import Logo from '@components/componentLibrary/Logo/Logo';
import { getChainImage, getChainName } from 'store/Wallet';
import { MenuItem } from '.';
import { chains } from '@constants/chains';

export function ChainPopover() {
  const { account, chainId, setChain } = useActiveWeb3React();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setAnchorEl(null);
  }, [account, chainId]);

  const anchorRef = useRef<HTMLElement>();

  return (
    <Box ref={anchorRef}>
      <MenuItem
        gap="12px"
        aria-haspopup="true"
        aria-describedby={'popover-text'}
        onClick={() => setAnchorEl(anchorRef.current as HTMLElement)}
      >
        <Logo src={getChainImage(chainId)} width={20} height={20} />
        <Typography color="white" variant="body-moderate-medium">
          {getChainName(chainId)}
        </Typography>
      </MenuItem>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        keepMounted
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          horizontal: 180,
          vertical: -40,
        }}
      >
        <Box padding="12px" sx={{ background: '#0F0F0F' }}>
          {chains.map((chain) => (
            <MenuItem
              key={chain.id}
              gap="12px"
              onClick={() => setChain({ chainId: chain.id })}
            >
              <Logo
                src={getChainImage(parseInt(chain.id, 16))}
                width={20}
                height={20}
              />
              <Typography color="white" variant="body-moderate-medium">
                {getChainName(parseInt(chain.id, 16))}
              </Typography>
            </MenuItem>
          ))}
        </Box>
      </Popover>
    </Box>
  );
}
