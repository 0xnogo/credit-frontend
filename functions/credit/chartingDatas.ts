import { assetSWRConfig } from '@constants/swr';
import { getLendHourDatas } from '@graph/core/fetchers/credit';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import useSWR from 'swr';

/////////////////////////////////////// HOOKS /////////////////////////////////////////////////////
export function useLentPositionsHourData(
  pairAddress: string | undefined,
  maturity: string | number,
) {
  const { account, chainId } = useActiveWeb3React();

  const lentPositionsData = useSWR(
    account && chainId && pairAddress && maturity
      ? ['lent-hour-datas', chainId, account, pairAddress, maturity]
      : null,
    async () => {
      return getLendHourDatas(chainId, pairAddress as string, maturity);
    },
    assetSWRConfig,
  );

  return lentPositionsData;
}
