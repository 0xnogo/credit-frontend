import { XCaliButton } from '@components/componentLibrary/Button/XCaliButton';
import Logo from '@components/componentLibrary/Logo/Logo';
import { ARB_ADDRESS, USDC_ADDRESS } from '@constants/contracts/addresses';
import { ZERO_ADDRESS } from '@constants/index';
import { useFaucetDetails } from '@functions/useFaucetDetails';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Popover, Skeleton, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { shortenAddress } from '@utils/index';
import { useFaucetMintTransactions } from 'hooks/faucet/useFaucetMintTransactions';
import { Inter } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';
import Jazzicon from 'react-jazzicon/dist/Jazzicon';
import { walletImageURLs } from 'store/Wallet';
import { ChainPopover } from './ChainPopover';

export const MenuItem = styled(Box)(
  ({ theme }: any) => `
  min-width:150px;
  display:flex;
  flex-direction:row;
  justify-content:center;
  border-bottom:thin #161718 solid;
  padding:4px 4px 4px 4px;
  cursor:pointer;
`,
);

const inter = Inter({ subsets: ['latin'] });

export function AccountCenter() {
  const { account, chainId, wrongChain, connect, label, disconnect } =
    useActiveWeb3React();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setAnchorEl(null);
  }, [account, chainId]);

  const AccountButton = () => {
    return (
      <Box>
        {account
          ? wrongChain
            ? 'Wrong Chain'
            : shortenAddress(account)
          : 'Connect'}
      </Box>
    );
  };

  const theme = useTheme();
  const anchorRef = useRef<HTMLElement>();

  const { data, isValidating } = useFaucetDetails();

  const faucetMintCallbackUSDC = useFaucetMintTransactions(
    USDC_ADDRESS[chainId],
    'USDC',
    data?.['USDC']?.amount,
  );
  const faucetMintCallbackARB = useFaucetMintTransactions(
    ARB_ADDRESS[chainId],
    'ARB',
    data?.['ARB']?.amount,
  );
  const faucetMintCallbackEth = useFaucetMintTransactions(
    '0x0000000000000000000000000000000000000000',
    'ETH',
    data?.['ETH']?.amount,
  );

  return (
    <Box ref={anchorRef}>
      <XCaliButton
        variant="ghost"
        color="white"
        aria-haspopup="true"
        aria-describedby={'popover-button'}
        onClickFn={(e: React.MouseEvent<HTMLButtonElement>) =>
          setAnchorEl(anchorRef.current as HTMLElement)
        }
        Component={
          <Box display="flex" flexDirection="row" alignItems="center" gap="6px">
            <Jazzicon
              diameter={20}
              seed={parseInt((account ?? ZERO_ADDRESS).slice(2, 10), 16)}
            />
            <AccountButton />
            <KeyboardArrowDownIcon />
          </Box>
        }
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        keepMounted
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        className={inter.className}
      >
        <Box padding="12px" sx={{ background: '#0F0F0F' }}>
          <MenuItem onClick={() => connect()} gap="12px" alignItems="center">
            <Logo
              src={walletImageURLs[label as string]}
              width={20}
              height={20}
            />
            <Typography color="white" variant="body-moderate-medium">
              {label}
            </Typography>
          </MenuItem>
          <ChainPopover />
          {isValidating ? (
            <Skeleton variant="rounded" width="100%" />
          ) : (
            <>
              <MenuItem
                sx={{
                  opacity: data?.['USDC']?.claimed ? 0.5 : 1,
                  pointerEvents: data?.['USDC']?.claimed ? 'none' : 'auto',
                  alignItems: 'center',
                  gap: '5px',
                }}
                onClick={() => faucetMintCallbackUSDC()}
              >
                <Typography color="white" variant="body-moderate-medium">
                  Faucet: USDC
                </Typography>
                <Logo src={'/tokens/USDC.png'} width={20} height={20} />
              </MenuItem>
              <MenuItem
                sx={{
                  opacity: data?.['ARB']?.claimed ? 0.5 : 1,
                  pointerEvents: data?.['ARB']?.claimed ? 'none' : 'auto',
                  alignItems: 'center',
                  gap: '5px',
                }}
                onClick={() => faucetMintCallbackARB()}
              >
                <Typography color="white" variant="body-moderate-medium">
                  Faucet: ARB
                </Typography>
                <Logo src={'/tokens/ARB.png'} width={20} height={20} />
              </MenuItem>
              <MenuItem
                sx={{
                  opacity: data?.['ETH']?.claimed ? 0.5 : 1,
                  pointerEvents: data?.['ETH']?.claimed ? 'none' : 'auto',
                  alignItems: 'center',
                  gap: '5px',
                }}
                onClick={() => faucetMintCallbackEth()}
              >
                <Typography color="white" variant="body-moderate-medium">
                  Faucet: ETH
                </Typography>
                <Logo src={'/tokens/ETH.png'} width={20} height={20} />
              </MenuItem>
            </>
          )}
          <MenuItem onClick={() => disconnect({ label: label as string })}>
            <Typography
              color={theme.palette.error.main}
              variant="body-moderate-medium"
            >
              Disconnect
            </Typography>
          </MenuItem>
        </Box>
      </Popover>
    </Box>
  );
}
