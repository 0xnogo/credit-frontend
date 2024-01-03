import { useMemo } from 'react';
import { CreditPair } from 'types/credit';
import { oldestFirst } from './oldestFirst';
import { newestFirst } from './newestFirst';
import { highYield } from './highYield';
import { lowYield } from './lowYield';
import { highTVL } from './highTVL';
import { lowTVL } from './lowTVL';

const filterFunction = [
  (pairs: CreditPair[]) => pairs,
  oldestFirst,
  newestFirst,
  highYield,
  lowYield,
  highTVL,
  lowTVL,
];

export function useMetricFilterdPairs(
  metricIndex: number,
  pairs: CreditPair[],
) {
  return useMemo(() => {
    return filterFunction[metricIndex](pairs);
  }, [metricIndex, pairs]);
}
