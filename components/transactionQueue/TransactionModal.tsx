import Card from 'components/componentLibrary/Card';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import { useMemo } from 'react';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { TransactionQueue, txColors, txTextColors } from './TransactionQueue';
import { Box, Dialog, Link, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import Modal from '@components/componentLibrary/ModalCard';
import { ETHERSCAN_URL } from '@constants/index';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';

export default function TransactionModal() {
  const {
    closeQueue,
    transactionInfo: {
      open,
      transactions,
      transactionComponent,
      purpose,
      txType,
    },
  } = useCurrentTransactions();

  const [isWaiting, nextPendingTransactionIndex, isFailed] = useMemo(() => {
    for (let index = 0; index < transactions.length; index++) {
      const tx = transactions[index];
      if (
        tx.status === 'WAITING' ||
        tx.status === 'PENDING' ||
        tx.status === 'SUBMITTED' ||
        tx.status === 'REJECTED'
      ) {
        return [tx.status === 'WAITING', index, tx.status === 'REJECTED'];
      }
    }
    return [true, 0, false];
  }, [transactions]);

  const currentTx = transactions[nextPendingTransactionIndex] ?? undefined;

  const currentLoadingState = !isWaiting && !isFailed;

  const isTxConfirmed =
    transactions[transactions.length - 1]?.status === 'CONFIRMED';

  const txHash = transactions[transactions.length - 1]?.txHash;

  const { chainId } = useActiveWeb3React();

  return (
    <Modal open={open} onClose={closeQueue}>
      <Box
        width="480px"
        maxHeight={'100vh'}
        maxWidth="calc(100% - 48px)"
        sx={{ transform: 'translateX(-24px)' }}
      >
        <Card
          fontSize="l"
          header={isTxConfirmed ? 'Completed' : purpose}
          onClose={closeQueue}
          width="448px"
          maxHeight="100vh"
        >
          {isTxConfirmed ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="12px"
            >
              <Box
                width="48px"
                height="48px"
                borderRadius="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ background: txColors[txType] }}
              >
                <CheckIcon
                  sx={{
                    color: txTextColors[txType],
                    margin: 'auto',
                    fontSize: '26.128px',
                  }}
                />
              </Box>
              <Typography
                variant="body-large-medium"
                color={txTextColors[txType]}
              >
                Transaction Successful
              </Typography>
            </Box>
          ) : (
            <>
              <TransactionQueue
                nextTx={nextPendingTransactionIndex}
                type={txType}
                isFailed={isFailed}
              />{' '}
              {transactionComponent}
            </>
          )}
          {isTxConfirmed ? (
            <Box>
              <XCaliButton
                Component={'Close'}
                onClickFn={closeQueue}
                type="filled"
                variant="neutral"
                style={{ marginBottom: '12px' }}
              />
              <Link
                href={`${ETHERSCAN_URL[chainId]}/tx/${txHash}`}
                target="_blank"
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ textDecoration: 'none' }}
              >
                <XCaliButton
                  Component={'view on explorer'}
                  type="filled"
                  variant="outline"
                />
              </Link>
            </Box>
          ) : (
            <XCaliButton
              Component={
                isFailed ? 'Transaction failed' : currentTx?.actionName
              }
              showLoader={currentLoadingState}
              disabled={isFailed || currentLoadingState}
              onClickFn={currentTx?.action}
              type="filled"
              variant="neutral"
            />
          )}
        </Card>
      </Box>
    </Modal>
  );
}
