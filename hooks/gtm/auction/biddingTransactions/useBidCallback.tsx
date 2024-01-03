import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { getAuctionDepositContract } from 'constants/contracts';
import { getGasPrice } from 'functions/transactions/getGasPrice';
import { encodeOrder } from '@functions/gtm/auction/utils';
import { useAllBids } from '@functions/gtm/auction/getAllBids';
import { smallerThan } from '@functions/gtm/auction/orderBook/orderBookUtils';
import { useAuctionInfo } from '@functions/gtm/auction/getAuctionData';
import { AuctionSellOrder } from 'types/auction';

export default function useBidCallback(
  asset: Token,
  buyAmount: BigNumber,
  sellAmount: BigNumber,
  referralCode = '',
  bidCallback: (err?: any) => void,
  setTransactionStatus: any,
) {
  const { web3, account, chainId } = useActiveWeb3React();
  const callContractWait = useCallContractWait();
  const { data: bids } = useAllBids();
  const { data: auctionInfo } = useAuctionInfo();

  return useMemo(() => {
    return async (lendTXID: string) => {
      try {
        const buyAmountIn = buyAmount
          .times(Math.pow(10, asset?.decimals))
          .toFixed(0);

        const depositContract = getAuctionDepositContract(web3, chainId);

        let lastOrder =
          '0x0000000000000000000000000000000000000000000000000000000000000001';

        const sendValue = sellAmount.times(Math.pow(10, 18)).toFixed(0);
        const userSellOrder: AuctionSellOrder = {
          buyAmount: new BigNumber(buyAmountIn),
          sellAmount: new BigNumber(sendValue),
          timestamp: '0',
          referral: {
            id: '',
          },
          auctionUser: {
            id: auctionInfo.myUserId,
          },
          price: new BigNumber(0),
          cancelled: false,
          orderClaimed: false,
          winningAmount: new BigNumber(0),
        };

        const latestBid = bids
          .reverse()
          .find((bid) => smallerThan(bid, userSellOrder));
        if (latestBid) {
          lastOrder = encodeOrder({
            userId: latestBid.auctionUser.id,
            buyAmount: new BigNumber(latestBid.buyAmount),
            sellAmount: new BigNumber(latestBid.sellAmount),
          });
        }

        let func = 'depositAndPlaceOrder';
        let params: any[] = [
          [buyAmountIn], // minBuyAmounts: uint96[]
          [lastOrder], // prevSellOrders: bytes32[]
          referralCode, // referralCode: string
        ];

        const gasPrice = await getGasPrice(web3);
        callContractWait(
          depositContract,
          func,
          params,
          gasPrice,
          lendTXID,
          async (err: any) => {
            if (err) {
              return bidCallback(err);
            }
            bidCallback();
          },
          sendValue,
        );
      } catch (ex) {
        console.log(ex);
        bidCallback(ex);
      }
    };
  }, [
    asset,
    buyAmount,
    bidCallback,
    setTransactionStatus,
    callContractWait,
    web3,
    account,
    chainId,
    setTransactionStatus,
    referralCode,
    sellAmount,
    bids,
    auctionInfo,
  ]);
}
