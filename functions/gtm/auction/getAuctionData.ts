import { assetSWRConfig } from '@constants/swr';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import useSWR from 'swr';
import BigNumber from 'bignumber.js';
import { AuctionInfo, AuctionSellOrder } from 'types/auction';
import { getAuctionContract } from '@constants/contracts';
import { getAuctionInfo } from '@graph/core/fetchers/auction';

const defaultAuctionInfo: AuctionInfo = {
  orderCancellationEndData: 0,
  auctionEndDate: 0,
  minFundingThreshold: new BigNumber(0),
  minFundingThresholdNotReached: true,
  initialAuctionOrder: null,
  minimumBiddingAmountPerOrder: new BigNumber(0),
  myUserId: '0',
  auctionSettled: false,
  auctionStartDate: 0,
};

export function useAuctionInfo() {
  const { chainId, web3, account } = useActiveWeb3React();

  const swrResult = useSWR<AuctionInfo>(
    chainId && web3 && account ? ['auction-info', chainId, account] : null,
    async () => {
      const auctionContract = getAuctionContract(web3, chainId);
      const auctionInfo = await auctionContract.methods.auctionData().call();

      const myUserId = await auctionContract.methods
        .getUserId(account as string)
        .call();

      const {
        initialAuctionOrder: initOrderMinimal,
        auctionSettled,
        auctionStartDate,
      } = await getAuctionInfo(chainId);

      const initialAuctionOrder: AuctionSellOrder = {
        auctionUser: {
          id: initOrderMinimal.auctionUser.id,
        },
        referral: {
          id: '',
        },
        buyAmount: initOrderMinimal.buyAmount,
        sellAmount: initOrderMinimal.sellAmount,
        timestamp: (Date.now() / 1000).toString(),
        price: initOrderMinimal.price,
        cancelled: false,
        orderClaimed: false,
        winningAmount: new BigNumber(0),
      };

      return {
        orderCancellationEndData: Number(auctionInfo.orderCancellationEndDate),
        auctionEndDate: Number(auctionInfo.auctionEndDate),
        minFundingThreshold: new BigNumber(auctionInfo.minFundingThreshold),
        minFundingThresholdNotReached:
          auctionInfo.minFundingThresholdNotReached,
        initialAuctionOrder,
        minimumBiddingAmountPerOrder: new BigNumber(
          auctionInfo.minimumBiddingAmountPerOrder,
        ),
        myUserId,
        auctionSettled,
        auctionStartDate: Number(auctionStartDate),
      };
    },
    assetSWRConfig,
  );

  return { ...swrResult, data: swrResult.data || defaultAuctionInfo };
}
