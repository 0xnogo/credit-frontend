import { CreditPair } from 'types/credit';

export function newestFirst(pairs: CreditPair[]) {
  const newestPoolMapping = pairs
    .map((pair, index) => {
      let newestMaturity = 99999999999999999999;
      const pools = pair.pools;
      pools.forEach(({ dateCreated }) => {
        if (Number(dateCreated) < newestMaturity) {
          newestMaturity = Number(dateCreated);
        }
      });
      return { newestMaturity, index };
    })
    .sort((a, b) => a.newestMaturity - b.newestMaturity);

  return newestPoolMapping.map(({ index }) => pairs[index]);
}
