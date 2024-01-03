import { Box } from '@mui/material';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import Modal from 'components/componentLibrary/ModalCard';
import { Inter } from 'next/font/google';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { CreditPair, CreditPool } from 'types/credit';
import { Type } from '../Pools';
import BorrowCard from './BorrowCard';
import LendCard from './LendCard';
import LpCard from './LpCard';

const inter = Inter({ subsets: ['latin'] });

type CreditActionCardProps = {
  type: Type;
  creditPair: CreditPair;
  modalOpen: boolean;
  handleCloseModal: any;
  maturity: number;
  setMaturity: Dispatch<SetStateAction<number>>;
};

const getCardByType = (
  type: Type,
  pair: CreditPair,
  maturity: number,
  setMaturity: Dispatch<SetStateAction<number>>,
  handleCloseModal: any,
  selectedPool: CreditPool,
): JSX.Element =>
  ({
    Lend: (
      <LendCard
        type={type}
        pair={pair}
        maturity={maturity}
        setMaturity={setMaturity}
        handleCloseModal={handleCloseModal}
        selectedPool={selectedPool}
      />
    ),
    Borrow: (
      <BorrowCard
        type={type}
        pair={pair}
        maturity={maturity}
        setMaturity={setMaturity}
        handleCloseModal={handleCloseModal}
        selectedPool={selectedPool}
      />
    ),
    'Provide Liquidity': (
      <LpCard
        type={type}
        pair={pair}
        maturity={maturity}
        setMaturity={setMaturity}
        handleCloseModal={handleCloseModal}
        selectedPool={selectedPool}
      />
    ),
  })[type];

function CreditActionCard({
  type,
  creditPair,
  modalOpen,
  handleCloseModal,
  maturity,
  setMaturity,
}: CreditActionCardProps) {
  const { chainId, account, wrongChain } = useActiveWeb3React();

  useEffect(() => {
    handleCloseModal();
  }, [chainId, account]);

  const poolsByMaturity = creditPair?.pools ?? [];

  const selectedPool = poolsByMaturity[maturity];

  return (
    <>
      {!wrongChain && (
        <Modal open={modalOpen && !wrongChain} onClose={handleCloseModal}>
          <Box
            width="480px"
            maxHeight={'100vh'}
            maxWidth="calc(100% - 48px)"
            sx={{ transform: 'translateX(-24px)' }}
            className={inter.className}
          >
            {getCardByType(
              type,
              creditPair as CreditPair,
              maturity,
              setMaturity,
              handleCloseModal,
              selectedPool,
            )}
          </Box>
        </Modal>
      )}
    </>
  );
}

export default CreditActionCard;
