import useSWR from 'swr';
import { assetSWRConfig } from 'constants/swr';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { getFaucetContract } from '@constants/contracts';
import { ChainMapping } from 'types/web3';
import { ChainIds } from '@constants/chains';
import { ZERO_ADDRESS } from '@constants/index';
import BigNumber from 'bignumber.js';

const FAUCET_TOKENS:ChainMapping = {
    [ChainIds.ARBITRUM_GOERLI]:{
        ["USDC"]:{
            address:'0x96244E2ae03B8edA8c1035F75948667777D3ac52',
            decimals:6
        },
        ["ETH"]:{
            address:'0x0000000000000000000000000000000000000000',
            decimals:18
        },
        ["ARB"]:{
            address:'0x2C085310719Bf846A135ff80c059aaBc96320A49',
            decimals:18
        }
    }
}

export function useFaucetDetails() {
  
  const { account,chainId,web3 } = useActiveWeb3React();

  return useSWR(
    account && chainId && web3
      ? ['faucet-details', chainId, account]
      : null,
    async () => {
      if (!account) return [];
      const faucetContract = getFaucetContract(web3,chainId);
      //@ts-ignore
      const currentEpoch = await faucetContract.methods.currentEpoch().call()
      const temp = FAUCET_TOKENS[chainId]
      const keys = Object.keys(temp)
      for(const key of keys){
        let amount = new BigNumber(0)
        if(temp[key].address === ZERO_ADDRESS){
          amount = new BigNumber(await faucetContract.methods.maxEthWithdrawable(currentEpoch).call()).div(Math.pow(10,temp[key].decimals))
        }
        else{
          amount = new BigNumber(await faucetContract.methods.maxErc20Withdrawable(currentEpoch).call()).div(Math.pow(10,temp[key].decimals))
        }
        const claimed = await faucetContract.methods.claimed(currentEpoch,account as string,temp[key].address).call()
        temp[key] = {...temp[key],claimed,amount}
      }
      return temp
    },
    assetSWRConfig,
  );

}
