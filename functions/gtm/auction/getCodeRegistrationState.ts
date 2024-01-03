import { getAuctionReferralContract } from '@constants/contracts';
import { assetSWRConfig } from '@constants/swr';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import useSWR from 'swr';
import { ZERO_ADDRESS } from '@constants/index';
import { useDebounce } from 'use-debounce';

export function useCodeRegistered(code: string | undefined) {
  const { chainId, web3, account } = useActiveWeb3React();

  const [debounced] = useDebounce(code, 1000);

  const swrResult = useSWR(
    chainId && web3 && account && debounced
      ? ['is-auction-code-registered', chainId, account, debounced]
      : null,
    async () => {
      const referralContract = getAuctionReferralContract(web3, chainId);
      let referralCodeAddress: string = await referralContract.methods
        .codeToAddress(debounced as string)
        .call();

      return referralCodeAddress !== ZERO_ADDRESS;
    },
    assetSWRConfig,
  );

  return swrResult;
}
