import { NFT_CONTRACT_ADDRESS, getNFTContract } from '@constants/gtm';
import { assetSWRConfig } from '@constants/swr';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import useSWR from 'swr';
import { GameInfo } from 'types/gtm';

const defaultObject = {
  userHasNFT: false,
  spinInfo: {
    remainingSpins: 0,
    spinsBought: 0,
    totalSpins: 0,
  },
  tokenId: undefined,
};

export const useUserSpinInfo = () => {
  const { account, wrongChain, web3 } = useActiveWeb3React();
  const {
    data,
    isValidating: isValidatingUserData,
    mutate: mutateUserData,
    error,
  } = useSWR<GameInfo>(
    account && !wrongChain && web3 ? ['hasClaimedSpins', account] : null,
    async () => {
      try {
        let userHasNFT = true;
        let tokenId;
        try {
          const nftContract = getNFTContract(web3, NFT_CONTRACT_ADDRESS);
          tokenId = await nftContract.methods
            .tokenOfOwnerByIndex(account as string, 0)
            .call();
        } catch (error) {
          tokenId = undefined;
          userHasNFT = false;
        }

        const spinInfoResponse = await fetch(
          `/api/user/getSpinInformation?address=${account}${
            tokenId ? `&nft=${tokenId}` : ''
          }`,
        );
        const spinInfoResult = await spinInfoResponse.json();
        return {
          userHasNFT,
          ...spinInfoResult,
          tokenId,
        };
      } catch (error) {
        return defaultObject;
      }
    },
    assetSWRConfig,
  );

  return {
    data: data ?? defaultObject,
    isValidatingUserData,
    mutateUserData,
    error,
  };
};
