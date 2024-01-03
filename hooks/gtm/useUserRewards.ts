import { assetSWRConfig } from '@constants/swr';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import useSWR from 'swr';

export const useUserRewards = () => {
  const { account, wrongChain, web3 } = useActiveWeb3React();
  const {
    data,
    isValidating: isValidatingUserRewards,
    mutate: mutateRewards,
  } = useSWR(
    account && !wrongChain && web3 ? ['userRewards', account] : null,
    async () => {
      try {
        const response: any = await fetch(`/api/rewards?address=${account}`);
        const json = await response.json();
        return json.rewards;
      } catch (error) {
        return [];
      }
    },
    assetSWRConfig,
  );

  return {
    userRewards: data,
    isValidatingUserRewards,
    mutateRewards,
  };
};
