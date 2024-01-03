import Web3 from 'web3';
import { getMulticallContract } from 'constants/contracts';
import { MULTICALL_ADDRESS } from 'constants/contracts/addresses';

interface ConstructorArgs {
  chainId?: number;
  provider: Web3;
  defaultBlock?: number | 'latest';
  multicallAddress?: string;
}

type Result = {
  success: boolean;
  returnData: string;
};

export default class Multicall {
  web3: Web3;
  multicall: any;

  constructor({
    chainId,
    provider,
    multicallAddress,
    defaultBlock,
  }: ConstructorArgs) {
    this.web3 = provider;

    const _multicallAddress = multicallAddress
      ? multicallAddress
      : chainId
      ? MULTICALL_ADDRESS[chainId]
      : undefined;

    if (!_multicallAddress) {
      throw new Error(
        'No address found via chainId. Please specify multicallAddress.',
      );
    }

    this.multicall = getMulticallContract(this.web3, _multicallAddress);

    if (defaultBlock) this.multicall.defaultBlock = defaultBlock;
  }

  async aggregate(calls: any[], parameters = {}) {
    const callRequests = calls.map((call) => {
      const callData = call.encodeABI();
      return {
        target: call._parent._address,
        callData,
      };
    });

    const { returnData } = await this.multicall.methods
      .aggregate(callRequests)
      .call(parameters, this.multicall.defaultBlock ?? 'latest');

    return returnData.map((hex: string, index: number) => {
      const types = calls[index]._method.outputs.map((o: any) =>
        o.internalType !== o.type && o.internalType !== undefined ? o : o.type,
      );

      let result = this.web3.eth.abi.decodeParameters(types, hex);

      delete result.__length__;

      result = Object.values(result);

      return result.length === 1 ? result[0] : result;
    });
  }

  async aggregateCallData(calls: any[], parameters = {}) {
    const callRequests = calls.map((call) => {
      const callData = call.encodedABI;
      return {
        target: call.address,
        callData,
      };
    });

    const { returnData } = await this.multicall.methods
      .aggregate(callRequests)
      .call(parameters, this.multicall.defaultBlock ?? 'latest');

    return returnData.map((hex: string, index: number) => {
      const types = calls[index].method.outputs.map((o: any) =>
        o.internalType !== o.type && o.internalType !== undefined ? o : o.type,
      );

      let result = this.web3.eth.abi.decodeParameters(types, hex);

      delete result.__length__;

      result = Object.values(result);

      return result.length === 1 ? result[0] : result;
    });
  }

  async tryAggregate(requireSucess = false, calls: any[], parameters = {}) {
    const callRequests = calls.map((call) => {
      const callData = call.encodeABI();
      return {
        target: call._parent._address,
        callData,
      };
    });

    const returnData = await this.multicall.methods
      .tryAggregate(requireSucess, callRequests)
      .call(parameters, this.multicall.defaultBlock ?? 'latest');

    return returnData.flatMap((data: Result, index: number) => {
      const types = calls[index]._method.outputs.map((o: any) =>
        o.internalType !== o.type && o.internalType !== undefined ? o : o.type,
      );
      let result = data.success
        ? this.web3.eth.abi.decodeParameters(types, data.returnData)
        : [];

      delete result.__length__;

      result = Object.values(result);

      return {
        success: data.success,
        result: result.length === 1 ? result[0] : result,
      };
    });
  }

  async tryAggregateCallData(
    requireSucess = false,
    calls: any[],
    parameters = {},
  ) {
    const callRequests = calls.map((call) => {
      const callData = call.encodedABI;
      return {
        target: call.address,
        callData,
      };
    });

    const returnData = await this.multicall.methods
      .tryAggregate(requireSucess, callRequests)
      .call(parameters, this.multicall.defaultBlock ?? 'latest');

    return returnData.map(
      ({ success, returnData: hex }: Result, index: number) => {
        const types = calls[index].method.outputs.map((o: any) =>
          o.internalType !== o.type && o.internalType !== undefined
            ? o
            : o.type,
        );

        let result = success
          ? this.web3.eth.abi.decodeParameters(types, hex)
          : [];

        delete result.__length__;

        result = Object.values(result);

        return {
          success: success,
          result: result.length === 1 ? result[0] : result,
        };
      },
    );
  }

  getEthBalance(address: string) {
    return this.multicall.methods.getEthBalance(address);
  }

  getBlockHash(blockNumber: string | number) {
    return this.multicall.methods.getBlockHash(blockNumber);
  }

  getLastBlockHash() {
    return this.multicall.methods.getLastBlockHash();
  }

  getCurrentBlockTimestamp() {
    return this.multicall.methods.getCurrentBlockTimestamp();
  }

  getCurrentBlockDifficulty() {
    return this.multicall.methods.getCurrentBlockDifficulty();
  }

  getCurrentBlockGasLimit() {
    return this.multicall.methods.getCurrentBlockGasLimit();
  }

  getCurrentBlockCoinbase() {
    return this.multicall.methods.getCurrentBlockCoinbase();
  }

  getBlockNumber() {
    return this.multicall.methods.getBlockNumber();
  }
}
