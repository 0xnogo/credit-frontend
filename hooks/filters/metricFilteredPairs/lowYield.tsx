import BigNumber from 'bignumber.js';
import { CreditPair } from 'types/credit';

export function lowYield(pairs: CreditPair[]) {
  const aprMapping = pairs
    .map((pair, index) => {
      const maxAPR = pair.pools.reduce(
        (prev, curr) => prev + new BigNumber(curr.maxAPR ?? 0).toNumber(),
        0,
      );
      return { maxAPR, index };
    })
    .sort((a, b) => a.maxAPR - b.maxAPR);

  return aprMapping.map(({ index }) => pairs[index]);
}
