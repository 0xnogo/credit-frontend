import Multicall from './';

export const multicallSplitOnOverflow = async (
  multicallData: any[],
  multicall: Multicall,
  options?: {
    maxCallsPerBatch: number;
  },
): Promise<any[]> => {
  const maxCalls = options?.maxCallsPerBatch ?? 300;
  const calls = [];
  while (multicallData.length > 0) {
    calls.push(multicall.aggregate(multicallData.splice(0, maxCalls)), {
      blockNumber: 'latest',
    });
  }
  const splitResults = await Promise.all(calls);
  return splitResults.flatMap((value) => value);
};

export const tryMulticallSplitOnOverflow = async (
  multicallData: any[],
  multicall: Multicall,
  options?: {
    maxCallsPerBatch: number;
  },
): Promise<any[]> => {
  const maxCalls = options?.maxCallsPerBatch ?? 300;
  const calls = [];
  while (multicallData.length > 0) {
    const data = multicallData.splice(0, maxCalls);
    calls.push(multicall.tryAggregate(false, data));
  }
  const splitResults = await Promise.all(calls);
  return splitResults.flatMap((value) => value);
};

export const multicallDataSplitOnOverflow = async (
  multicallData: any[],
  multicall: Multicall,
  options?: {
    maxCallsPerBatch: number;
  },
): Promise<any[]> => {
  const maxCalls = options?.maxCallsPerBatch ?? 300;
  const calls = [];
  while (multicallData.length > 0) {
    calls.push(multicall.aggregateCallData(multicallData.splice(0, maxCalls)));
  }
  const splitResults = await Promise.all(calls);
  return splitResults.flatMap((value) => value);
};

export const tryMulticallDataSplitOnOverflow = async (
  multicallData: any[],
  multicall: Multicall,
  options?: {
    maxCallsPerBatch: number;
  },
): Promise<any[]> => {
  const maxCalls = options?.maxCallsPerBatch ?? 300;
  const calls = [];
  while (multicallData.length > 0) {
    calls.push(
      multicall.tryAggregateCallData(false, multicallData.splice(0, maxCalls)),
    );
  }
  const splitResults = await Promise.all(calls);
  return splitResults.flatMap((value) => value);
};
