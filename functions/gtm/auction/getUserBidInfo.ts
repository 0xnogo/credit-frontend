import { assetSWRConfig } from '@constants/swr';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import useSWR from 'swr';
import { fetchUserBidsInfo } from '@graph/core/fetchers/auction';
import BigNumber from 'bignumber.js';
import { UserBidInfo } from 'types/auction';

const defaultUserBidInfo: UserBidInfo = {
  auctionSellOrders: [],
  id: '',
  sumAuctioningTokenAmount: new BigNumber(0),
};

export function useUserBidInfo() {
  const { chainId, web3, account } = useActiveWeb3React();

  const swrResult = useSWR<UserBidInfo>(
    chainId && web3 && account ? ['auction-user-bids', chainId, account] : null,
    async () => {
      try {
        const userBidInfo = await fetchUserBidsInfo(chainId, {
          id: (account as string).toLowerCase(),
        });
        if (!userBidInfo) return defaultUserBidInfo;

        return {
          auctionSellOrders: userBidInfo.auctionSellOrders.map((order) => ({
            ...order,
            buyAmount: new BigNumber(order.buyAmount),
            sellAmount: new BigNumber(order.sellAmount),
            winningAmount: new BigNumber(order.winningAmount),
            price: new BigNumber(order.price),
            auctionUser: {
              id: order.auctionUser.id,
            },
          })),
          id: userBidInfo.id,
          sumAuctioningTokenAmount: new BigNumber(
            userBidInfo.sumAuctioningTokenAmount,
          ),
        };
      } catch (error) {
        return defaultUserBidInfo;
      }
    },
    assetSWRConfig,
  );

  return { ...swrResult, data: swrResult.data || defaultUserBidInfo };
}
