import { Box } from '@mui/material';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import TransactionModal from 'components/transactionQueue/TransactionModal';
import { Inter } from 'next/font/google';
import { Nav } from './navbar';

const inter = Inter({ subsets: ['latin'] });

export function Layout({ children }: { children: JSX.Element }) {
  const { account, wrongChain } = useActiveWeb3React();

  return (
    <Box
      sx={{
        padding: '0',
        margin: '0',
      }}
    >
      <Nav />
      <Box paddingTop="79px" position="relative" className={inter.className}>
          {children}
      </Box>
      {!account || wrongChain ? <></> : <TransactionModal />}
    </Box>
  );
}
