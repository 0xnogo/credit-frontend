import {
  TransactionState,
  AddTransaction,
  SetTransactionPending,
  SetTransactionSubmitted,
  SetTransactionConfirmed,
  SetTransactionRejected,
  SetTransactionStatus,
} from 'types/transactions';
import { atom, useRecoilState } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { useEffect } from 'react';

const initialState: TransactionState = {
  open: false,
  transactions: [],
  queueLength: 0,
  viewedAfterComplete: false,
  type: '',
  action: '',
  purpose: '',
  transactionComponent: null,
  txType: 'lend',
};

const transactionState = atom({
  key: 'currentTransactions', // unique ID (with respect to other atoms/selectors)
  default: initialState, // default value (aka initial value)
});

const addTransaction = (payload: AddTransaction) => {
  const transactionInfo = getRecoil(transactionState);
  setRecoil(transactionState, {
    ...transactionInfo,
    purpose: payload.title,
    open: true,
    type: payload.type,
    txType: payload.txType,
    action: payload.verb,
    transactions: [...payload.transactions],
    queueLength: payload.transactions.length,
    viewedAfterComplete: false,
    transactionComponent: payload.transactionComponent,
  });
};

const setTransactionPending = (payload: SetTransactionPending) => {
  const transactionInfo = getRecoil(transactionState);
  setRecoil(transactionState, {
    ...transactionInfo,
    transactions: transactionInfo.transactions.map((tx) => {
      if (tx.uuid === payload.uuid) {
        tx.status = 'PENDING';
        tx.description = payload.description
          ? payload.description
          : tx.description;
      }
      return tx;
    }),
  });
};

const setTransactionSubmitted = (payload: SetTransactionSubmitted) => {
  const transactionInfo = getRecoil(transactionState);
  setRecoil(transactionState, {
    ...transactionInfo,
    transactions: transactionInfo.transactions.map((tx) => {
      if (tx.uuid === payload.uuid) {
        tx.status = 'SUBMITTED';
        tx.txHash = payload.txHash;
        tx.description = payload.description
          ? payload.description
          : tx.description;
      }
      return tx;
    }),
  });
};

const setTransactionConfirmed = (payload: SetTransactionConfirmed) => {
  const transactionInfo = getRecoil(transactionState);
  setRecoil(transactionState, {
    ...transactionInfo,
    transactions: transactionInfo.transactions.map((tx) => {
      if (tx.uuid === payload.uuid) {
        tx.status = 'CONFIRMED';
        tx.txHash = payload.txHash;
        tx.description = payload.description
          ? payload.description
          : tx.description;
      }
      return tx;
    }),
  });
};

const setTransactionRejected = (payload: SetTransactionRejected) => {
  const transactionInfo = getRecoil(transactionState);
  setRecoil(transactionState, {
    ...transactionInfo,
    transactions: transactionInfo.transactions.map((tx) => {
      if (tx.uuid === payload.uuid) {
        tx.status = 'REJECTED';
        tx.description = payload.description
          ? payload.description
          : tx.description;
        tx.error = payload.error;
      }
      return tx;
    }),
  });
};

const setTransactionStatus = async (payload: SetTransactionStatus) => {
  const transactionInfo = getRecoil(transactionState);
  await setRecoil(transactionState, {
    ...transactionInfo,
    transactions: transactionInfo.transactions.map((tx) => {
      if (tx.uuid === payload.uuid) {
        tx.status = payload.status ? payload.status : tx.status;
        tx.description = payload.description
          ? payload.description
          : tx.description;
      }
      return tx;
    }),
  });
};

const clearTransactions = () => {
  const transactionInfo = getRecoil(transactionState);
  setRecoil(transactionState, {
    ...transactionInfo,
    transactions: [],
    queueLength: 0,
    transactionComponent: null,
  });
};

const openQueue = () => {
  const transactionInfo = getRecoil(transactionState);
  setRecoil(transactionState, {
    ...transactionInfo,
    open: true,
  });
};

const closeQueue = () => {
  const transactionInfo = getRecoil(transactionState);
  setRecoil(transactionState, {
    ...transactionInfo,
    open: false,
  });
};

const changeQueueOpenState = (payload: boolean) => {
  const transactionInfo = getRecoil(transactionState);
  setRecoil(transactionState, {
    ...transactionInfo,
    open: payload,
  });
};

const setViewedAfterComplete = (payload: boolean) => {
  const transactionInfo = getRecoil(transactionState);
  setRecoil(transactionState, {
    ...transactionInfo,
    viewedAfterComplete: payload,
  });
};

const resetState = () => {
  setRecoil(transactionState, initialState);
};

export function useCurrentTransactions() {
  const { account, wrongChain } = useActiveWeb3React();

  const [transactionInfo] = useRecoilState(transactionState);

  useEffect(() => {
    if (!account || wrongChain) {
      if (transactionInfo.open) {
        closeQueue();
      }
    }
  }, [account, wrongChain, transactionInfo]);

  return {
    transactionInfo,
    openQueue,
    closeQueue,
    addTransaction,
    setTransactionPending,
    setTransactionSubmitted,
    setTransactionConfirmed,
    setTransactionRejected,
    setTransactionStatus,
    clearTransactions,
    changeQueueOpenState,
    setViewedAfterComplete,
    resetState,
  };
}
