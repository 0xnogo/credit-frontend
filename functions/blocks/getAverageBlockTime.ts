import { ChainIds } from '@constants/chains';
import { getBlocks } from '@graph/core/fetchers/blocks';
import { getUnixTime, startOfHour, subHours } from 'date-fns';
import useSWR from 'swr';
import { assetSWRConfig } from 'constants/swr';

export const useAverageBlockTime = (chainId = ChainIds.ETHEREUM) => {
  return useSWR(
    chainId ? ['avg-block-time', chainId] : null,
    async () => {
      const now = startOfHour(Date.now());
      const blocks = await getBlocks(chainId, {
        where: {
          timestamp_gt: getUnixTime(subHours(now, 6)),
          timestamp_lt: getUnixTime(now),
        },
      });

      const averageBlockTime = blocks?.reduce(
        // @ts-ignore TYPE NEEDS FIXING
        (previousValue, currentValue, currentIndex) => {
          if (previousValue.timestamp) {
            const difference = previousValue.timestamp - currentValue.timestamp;

            previousValue.averageBlockTime =
              previousValue.averageBlockTime + difference;
          }

          previousValue.timestamp = currentValue.timestamp;

          if (currentIndex === blocks.length - 1) {
            return previousValue.averageBlockTime / blocks.length;
          }

          return previousValue;
        },
        { timestamp: null, averageBlockTime: 0 },
      );

      return averageBlockTime;
    },
    assetSWRConfig,
  );
};
