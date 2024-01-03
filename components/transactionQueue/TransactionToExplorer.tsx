import { Typography, Link, Box } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useState } from 'react';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { ETHERSCAN_URL } from 'constants/';
import { useThemeContext } from 'theme/themeContext';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { TransactionState } from 'types/transactions';

export const TransactionToExplorer = () => {
  const { theme } = useThemeContext();
  const { chainId } = useActiveWeb3React();
  const { transactionInfo: txState } = useCurrentTransactions();
  const [state, setState] = useState<TransactionState>();

  //we store the txState in the state variable(only once), ensures that even when the tx Queue is cleared, the snackbar doesnt reset immediately until timeout
  useDeepCompareEffect(() => {
    if (txState && !state) {
      setState(txState);
    }
  }, [{ txState, state }]);

  return (
    <Box width="100%">
      {state?.transactions &&
        state?.transactions.length > 0 &&
        state?.transactions
          ?.filter((tx) => {
            return tx.txHash != null;
          })
          ?.map((tx, idx) => {
            return (
              <Box
                borderBottom={`thin ${theme.palette.brand.accent.normal} solid`}
                key={`tx_key_${idx}`}
              >
                <Link
                  href={`${ETHERSCAN_URL[chainId]}/tx/${tx?.txHash}`}
                  target="_blank"
                  color="primary.20"
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ textDecoration: 'none' }}
                >
                  <Typography
                    variant="body-small-regular"
                    color="primary.20"
                    width="100%"
                  >
                    {tx && tx.description ? tx.description : 'View in Explorer'}{' '}
                  </Typography>
                  <OpenInNewIcon
                    sx={{ width: '15px' }}
                    color={theme.palette.brand.accent.normal}
                  />
                </Link>
              </Box>
            );
          })}
    </Box>
  );
};
