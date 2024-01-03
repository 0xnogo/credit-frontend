import { CreditPair } from 'types/credit';

export function oldestFirst(pairs: CreditPair[]) {
  const oldestPoolMapping = pairs
    .map((pair, index) => {
      let oldestMaturity = 0;
      const pools = pair.pools;
      pools.forEach(({ dateCreated }) => {
        if (Number(dateCreated) > oldestMaturity) {
          oldestMaturity = Number(dateCreated);
        }
      });
      return { oldestMaturity, index };
    })
    .sort((a, b) => b.oldestMaturity - a.oldestMaturity);

  return oldestPoolMapping.map(({ index }) => pairs[index]);
}
