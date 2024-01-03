import { assetSWRConfig } from '@constants/swr';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import useSWR from 'swr';
import { fetchAllBids } from '@graph/core/fetchers/auction';
import BigNumber from 'bignumber.js';
import { AuctionSellOrder } from 'types/auction';

export function useAllBids() {
  const { chainId, web3, account } = useActiveWeb3React();

  const swrResult = useSWR<AuctionSellOrder[]>(
    chainId && web3 && account ? ['auction-all-bids', chainId, account] : null,
    async () => {
      try {
        const allBidsInfo = await fetchAllBids(chainId);
        if (!allBidsInfo) return [];

        return allBidsInfo
          .map((order) => ({
            ...order,
            buyAmount: new BigNumber(order.buyAmount),
            sellAmount: new BigNumber(order.sellAmount),
            winningAmount: new BigNumber(order.winningAmount),
            price: new BigNumber(order.price),
          }))
          .filter((order) => order.auctionUser.id !== '0');
      } catch (error) {
        return [];
      }
    },
    assetSWRConfig,
  );

  return { ...swrResult, data: swrResult.data || [] };
}
