import { CreditPair } from 'types/credit';

export function lowTVL(pairs: CreditPair[]) {
  const aprMapping = pairs
    .map((pair, index) => {
      const tvl = pair.pools.reduce(
        (prev, curr) =>
          prev +
          curr.assetReserveUSD.toNumber() +
          curr.collateralReserveUSD.toNumber(),
        0,
      );
      return { tvl, index };
    })
    .sort((a, b) => a.tvl - b.tvl);

  return aprMapping.map(({ index }) => pairs[index]);
}
