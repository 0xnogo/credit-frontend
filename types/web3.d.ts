import Web3 from 'web3';
import { BaseContract } from './web3Typings/types';

export class Contract extends BaseContract {
  methods: any;
  // public _jsonInterface: any;
  // public _address: string;
}

declare global {
  interface Window {
    web3: Web3;
    ethereum: any;
  }
}

export type ChainMapping = { [chainId: number]: any };

export type GenericObject = { [key: string]: any };
