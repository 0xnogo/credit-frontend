import Unauthorized from '@components/Unauthorized';
import { ENABLE_WHITELIST } from '@constants/index';
import { Box, CircularProgress } from '@mui/material';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import TransactionModal from 'components/transactionQueue/TransactionModal';
import { useUserMerkleProof } from 'hooks/whitelist/useMerkleProof';
import { Inter } from 'next/font/google';
import { Nav } from './navbar';

const inter = Inter({ subsets: ['latin'] });

export function Layout({ children }: { children: JSX.Element }) {
  const { account, wrongChain } = useActiveWeb3React();

  const proofSWR = useUserMerkleProof(ENABLE_WHITELIST);

  return (
    <Box
      sx={{
        padding: '0',
        margin: '0',
      }}
    >
      <Nav />
      <Box paddingTop="79px" position="relative" className={inter.className}>
        {proofSWR.isValidating ? (
          <Box
            width="100vw"
            height="calc(100vh - 79px)"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress />
          </Box>
        ) : proofSWR.data ? (
          children
        ) : (
          <Unauthorized />
        )}
      </Box>
      {!account || wrongChain ? <></> : <TransactionModal />}
    </Box>
  );
}
