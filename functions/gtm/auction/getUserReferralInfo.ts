import { getAuctionReferralContract } from '@constants/contracts';
import { assetSWRConfig } from '@constants/swr';
import { fetchUserReferralInfo } from '@graph/core/fetchers/auction';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { UserReferralInfo } from 'types/auction';
import BigNumber from 'bignumber.js';
import useSWR from 'swr';

const userReferralDefaultObj: UserReferralInfo = {
  referralCode: null,
  ordersReferredCount: new BigNumber(0),
  ordersWonCount: new BigNumber(0),
  totalWinningSellAmount: new BigNumber(0),
  rewardBalance: new BigNumber(0),
  totalRewards: new BigNumber(0),
  totalSellAmount: new BigNumber(0),
  totalCreditWinningsForReferredOrders: new BigNumber(0),
};

export function useUserReferralInfo() {
  const { chainId, web3, account } = useActiveWeb3React();

  const swrResult = useSWR<UserReferralInfo>(
    chainId && web3 && account
      ? ['auction-referral-info', chainId, account]
      : null,
    async () => {
      try {
        const referralContract = getAuctionReferralContract(web3, chainId);
        let referralCode: string | undefined = await referralContract.methods
          .addressToCode(account as string)
          .call();

        if (referralCode === '') {
          return userReferralDefaultObj;
        } else {
          const referralInfo = await fetchUserReferralInfo(chainId, {
            id: referralCode,
          });
          return {
            referralCode,
            ordersReferredCount: new BigNumber(
              referralInfo.ordersReferredCount,
            ),
            ordersWonCount: new BigNumber(referralInfo.ordersWonCount),
            totalWinningSellAmount: new BigNumber(
              referralInfo.totalWinningSellAmount,
            ),
            rewardBalance: new BigNumber(referralInfo.rewardBalance),
            totalRewards: new BigNumber(referralInfo.totalRewards),
            totalSellAmount: new BigNumber(referralInfo.totalSellAmount),
            totalCreditWinningsForReferredOrders: new BigNumber(
              referralInfo.totalCreditWinningsForReferredOrders,
            ),
          };
        }
      } catch (error) {
        console.log(error);
        return userReferralDefaultObj;
      }
    },
    assetSWRConfig,
  );

  return {
    ...swrResult,
    data: swrResult.data || userReferralDefaultObj,
  };
}
