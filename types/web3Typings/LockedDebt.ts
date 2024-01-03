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

export type Approval = ContractEventLog<{
  owner: string;
  approved: string;
  tokenId: string;
  0: string;
  1: string;
  2: string;
}>;
export type ApprovalForAll = ContractEventLog<{
  owner: string;
  operator: string;
  approved: boolean;
  0: string;
  1: string;
  2: boolean;
}>;
export type Transfer = ContractEventLog<{
  from: string;
  to: string;
  tokenId: string;
  0: string;
  1: string;
  2: string;
}>;

export interface LockedDebt extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): LockedDebt;
  clone(): LockedDebt;
  methods: {
    DOMAIN_SEPARATOR(): NonPayableTransactionObject<string>;

    _PERMIT_TYPEHASH(): NonPayableTransactionObject<string>;

    approve(
      to: string,
      id: number | string | BN
    ): NonPayableTransactionObject<void>;

    assetDecimals(): NonPayableTransactionObject<string>;

    balanceOf(owner: string): NonPayableTransactionObject<string>;

    collateralDecimals(): NonPayableTransactionObject<string>;

    dueOf(
      id: number | string | BN
    ): NonPayableTransactionObject<[string, string, string]>;

    getApproved(id: number | string | BN): NonPayableTransactionObject<string>;

    isApprovedForAll(
      owner: string,
      operator: string
    ): NonPayableTransactionObject<boolean>;

    maturity(): NonPayableTransactionObject<string>;

    mint(
      to: string,
      id: number | string | BN
    ): NonPayableTransactionObject<void>;

    name(): NonPayableTransactionObject<string>;

    nonces(tokenId: number | string | BN): NonPayableTransactionObject<string>;

    ownerOf(id: number | string | BN): NonPayableTransactionObject<string>;

    pair(): NonPayableTransactionObject<string>;

    permit(
      spender: string,
      tokenId: number | string | BN,
      deadline: number | string | BN,
      v: number | string | BN,
      r: string | number[],
      s: string | number[]
    ): NonPayableTransactionObject<void>;

    router(): NonPayableTransactionObject<string>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      id: number | string | BN
    ): NonPayableTransactionObject<void>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      id: number | string | BN,
      data: string | number[]
    ): NonPayableTransactionObject<void>;

    setApprovalForAll(
      operator: string,
      approved: boolean
    ): NonPayableTransactionObject<void>;

    supportsInterface(
      interfaceID: string | number[]
    ): NonPayableTransactionObject<boolean>;

    symbol(): NonPayableTransactionObject<string>;

    tokenByIndex(id: number | string | BN): NonPayableTransactionObject<string>;

    tokenOfOwnerByIndex(
      owner: string,
      id: number | string | BN
    ): NonPayableTransactionObject<string>;

    tokenURI(id: number | string | BN): NonPayableTransactionObject<string>;

    totalSupply(): NonPayableTransactionObject<string>;

    transferFrom(
      from: string,
      to: string,
      id: number | string | BN
    ): NonPayableTransactionObject<void>;
  };
  events: {
    Approval(cb?: Callback<Approval>): EventEmitter;
    Approval(options?: EventOptions, cb?: Callback<Approval>): EventEmitter;

    ApprovalForAll(cb?: Callback<ApprovalForAll>): EventEmitter;
    ApprovalForAll(
      options?: EventOptions,
      cb?: Callback<ApprovalForAll>
    ): EventEmitter;

    Transfer(cb?: Callback<Transfer>): EventEmitter;
    Transfer(options?: EventOptions, cb?: Callback<Transfer>): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "Approval", cb: Callback<Approval>): void;
  once(event: "Approval", options: EventOptions, cb: Callback<Approval>): void;

  once(event: "ApprovalForAll", cb: Callback<ApprovalForAll>): void;
  once(
    event: "ApprovalForAll",
    options: EventOptions,
    cb: Callback<ApprovalForAll>
  ): void;

  once(event: "Transfer", cb: Callback<Transfer>): void;
  once(event: "Transfer", options: EventOptions, cb: Callback<Transfer>): void;
}
