/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from "bn.js";
import type { ContractOptions } from "web3-eth-contract";
import type { EventLog } from "web3-core";
import type { EventEmitter } from "events";
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export interface Faucet extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): Faucet;
  clone(): Faucet;
  methods: {
    ETH_ADDRESS(): NonPayableTransactionObject<string>;

    addToken(
      _epoch: number | string | BN,
      _tokenAddresses: string
    ): NonPayableTransactionObject<void>;

    admin(): NonPayableTransactionObject<string>;

    claimed(
      arg0: number | string | BN,
      arg1: string,
      arg2: string
    ): NonPayableTransactionObject<boolean>;

    initNextEpoch(
      _tokenAddresses: string[],
      _merkleRoot: string | number[],
      _maxEthWithdrawable: number | string | BN,
      _maxErc20Withdrawable: number | string | BN
    ): NonPayableTransactionObject<void>;

    maxErc20Withdrawable(
      arg0: number | string | BN
    ): NonPayableTransactionObject<string>;

    maxEthWithdrawable(
      arg0: number | string | BN
    ): NonPayableTransactionObject<string>;

    merkleRoots(
      arg0: number | string | BN
    ): NonPayableTransactionObject<string>;

    mint(
      _merkleProof: (string | number[])[],
      _tokenAddress: string
    ): NonPayableTransactionObject<void>;

    mintAdmin(
      _tokenAddress: string,
      _amount: number | string | BN,
      _to: string
    ): NonPayableTransactionObject<void>;

    modifyMaxWithdrawable(
      _epoch: number | string | BN,
      _ethAmount: number | string | BN,
      _ercAmount: number | string | BN
    ): NonPayableTransactionObject<void>;

    modifyRoot(
      _epoch: number | string | BN,
      _merkleRoot: string | number[]
    ): NonPayableTransactionObject<void>;

    removeToken(
      _epoch: number | string | BN,
      _tokenAddresses: string
    ): NonPayableTransactionObject<void>;

    tokenAddresses(
      arg0: number | string | BN,
      arg1: string
    ): NonPayableTransactionObject<boolean>;

    withdraw(
      _tokenAddress: string,
      _amount: number | string | BN,
      _to: string
    ): NonPayableTransactionObject<void>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}
