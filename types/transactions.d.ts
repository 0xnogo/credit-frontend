import { ReactNode } from 'react';

export type TxType = 'lend' | 'liquidity' | 'borrow';

export type TransactionStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SUBMITTED'
  | 'REJECTED'
  | 'WAITING'
  | 'DONE';

export type Transaction = {
  uuid: string;
  status: TransactionStatus;
  description: string;
  action: (...params: any[]) => any;
  actionName: string;
  error?: string;
  txHash?: string;
};

export type AddTransaction = {
  title: string;
  type: string;
  verb: string;
  txType: TxType;
  transactions: Transaction[];
  transactionComponent: ReactNode;
};
export type SetTransactionPending = { uuid: string; description?: string };
export type SetTransactionSubmitted = {
  uuid: string;
  txHash: string;
  description?: string;
};
export type SetTransactionConfirmed = {
  uuid: string;
  txHash: string;
  description?: string;
};
export type SetTransactionRejected = {
  uuid: string;
  error: string;
  description?: string;
};
export type SetTransactionStatus = {
  uuid: string;
  status?: TransactionStatus;
  description?: string;
};

export type TransactionState = {
  open: boolean;
  txType: TxType;
  transactions: Transaction[];
  queueLength: number;
  purpose: string;
  type: string;
  action: string;
  viewedAfterComplete: boolean;
  transactionComponent: ReactNode;
};
