import { Box, useMediaQuery } from '@mui/material';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import { CreditIcon } from 'components/icons/svgs/Credit';
import { useWindowSize } from 'hooks/useWindowSize';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { CoreProtocolLinks } from './links/coreProtocolLinks';
import { AccountCenter } from './AccountCenter';

// shorten the input address to have 0x + 4 characters at start and end
function shortenAddress(address: string, chars = 4) {
  try {
    return `${address.substring(0, chars + 2)}...${address.substring(
      42 - chars,
    )}`;
  } catch (error) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
}

const hitQueries = [0, 768];

const cssProperties: any = {
  0: {
    paddingLeft: '12px',
    paddingRight: '12px',
    width: 'calc(100% - 24px)',
  },
  768: {
    paddingLeft: '80px',
    paddingRight: '80px',
    width: 'calc(100% - 160px)',
  },
};

export function Nav() {
  const { account, chainId, connect, wrongChain, connecting, triedConnect } =
    useActiveWeb3React();

  const router = useRouter();

  useEffect(() => {
    if (connecting || !triedConnect) return;
    if (wrongChain || !account) {
      if (router.pathname !== '/credit') {
        router.push('/credit');
      }
    }
  }, [wrongChain, router, account, connecting, triedConnect]);

  const [width] = useWindowSize();

  const media585 = useMediaQuery('(max-width:585px)');

  const currentHitQuery = useMemo(() => {
    let query = 0;
    hitQueries.forEach((currentQuery) => {
      if (width >= currentQuery) {
        query = currentQuery;
      }
    });
    return query;
  }, [width]);

  const currentProperties = cssProperties[currentHitQuery];

  const web3Function = () => connect();

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

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0',
        justifyContent: 'space-between',
        position: 'fixed',
        top: '0',
        left: '0',
        height: '79px',
        zIndex: '1',
        borderBottom: `thin #1D1E1F solid`,
        ...currentProperties,
      }}
    >
      <Box
        sx={{
          backdropFilter: 'blur(16px)',

          alignItems: 'center',
        }}
        width="100%"
        height="100%"
        position="absolute"
        top="0"
        left="0"
        zIndex="-1"
      />
      <Box
        sx={{ cursor: 'pointer' }}
        onClick={() => router.push('/credit')}
        width="135.98px"
        height="80%"
      >
        <CreditIcon width="135.98px" height="50px" />
      </Box>
      {!media585 && <CoreProtocolLinks />}
      <Box display="flex" flexDirection="row" gap="10px" alignItems="center">
        {/* <Points /> */}
        <XCaliButton
          variant="outline"
          onClickFn={() => router.push('/credit/dashboard')}
          Component={'Dashboard'}
        />
        {account && chainId ? (
          <AccountCenter />
        ) : (
          <XCaliButton
            variant="blue"
            onClickFn={web3Function}
            Component={<AccountButton />}
          />
        )}
      </Box>
    </nav>
  );
}
