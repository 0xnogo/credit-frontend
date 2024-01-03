import Multicall from '@/lib/multicall';
import { getCreditPairContract } from '@constants/contracts';
import { fastSWRConfig } from '@constants/swr';
import { useLendingPair } from '@functions/credit';
import { useAllPoolInformation } from '@functions/transactions/credit.ts/poolInformation/usePoolInformation';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import BigNumber from 'bignumber.js';
import { getAddress } from 'ethers/lib/utils';
import { useMultiCall } from 'hooks/useMulticall';
import { useTokenMapping } from 'hooks/useTokenMapping';
import useSWR from 'swr';
import Web3 from 'web3';

export async function getPoolInfo(pairAddress:string,maturity:number,web3:Web3,multicall:Multicall,tokenMapping:Record<string,any>){
  try {
    const creditPairContract = getCreditPairContract(
      web3,
      pairAddress as string,
    );

    const calls = [
      creditPairContract.methods.constantProduct(maturity as number),
      creditPairContract.methods.totalReserves(maturity as number),
      creditPairContract.methods.asset(),
      creditPairContract.methods.collateral(),
      creditPairContract.methods.lpFeeStored(maturity as number),
      creditPairContract.methods.totalClaims(maturity as number),
      creditPairContract.methods.totalLiquidity(maturity as number),
    ];

    const [
      constantProduct,
      reserves,
      asset,
      collateral,
      lpFeeStored,
      totalClaims,
      totalLiquidity,
    ] = await multicall?.aggregate(calls);
    // @TODO: hide pairs expired for longer than 2 weeks (TBD)
    return {
      X: new BigNumber(constantProduct[0]),
      Y: new BigNumber(constantProduct[1]),
      Z: new BigNumber(constantProduct[2]),
      assetReserve: new BigNumber(reserves[0]).div(
        Math.pow(10, tokenMapping[getAddress(asset)]?.decimals ?? 18),
      ),
      collateralReserve: new BigNumber(reserves[1]).div(
        Math.pow(10, tokenMapping[getAddress(collateral)]?.decimals ?? 18),
      ),
      feeStored: new BigNumber(lpFeeStored),
      totalClaims: {
        loanPrincipal: new BigNumber(totalClaims[0]),
        loanInterest: new BigNumber(totalClaims[1]),
        coveragePrincipal: new BigNumber(totalClaims[2]),
        coverageInterest: new BigNumber(totalClaims[3]),
      },
      totalLiquidity: new BigNumber(totalLiquidity),
    };
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

// export function usePoolInfo(pairAddress?: string, maturity?: number) {
//   const { web3, chainId } = useActiveWeb3React();
//   const multicall = useMultiCall();

//   const { data: tokenMapping = {} } = useTokenMapping();

//   return useSWR(
//     chainId && web3 && multicall && pairAddress && maturity
//       ? ['pool-essential-info', chainId, pairAddress, maturity, tokenMapping]
//       : null,
//     async () => {
//       return await getPoolInfo(pairAddress as string,maturity as number,web3,multicall as Multicall,tokenMapping)
//     },
//     fastSWRConfig,
//   );
// }

export function usePoolInfo(pairAddress?: string, maturity?: number) {

  const { poolInfo } = useAllPoolInformation(pairAddress,maturity)

  let data = undefined;
  if(poolInfo){
    const { transactions, ...poolParams } = poolInfo;
    data = poolParams
  }


  return data
}
