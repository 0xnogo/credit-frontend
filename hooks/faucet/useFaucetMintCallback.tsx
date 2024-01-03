import { useMemo } from "react";
import { useCallContractWait } from "hooks/useCallContractWait";
import { useActiveWeb3React } from "services/web3/useActiveWeb3React";
import { getFaucetContract } from "constants/contracts";
import { Contract } from "types/web3";
import { getGasPrice } from "functions/transactions/getGasPrice";
import { useUserMerkleProof } from "hooks/whitelist/useMerkleProof";

const useFaucetMintCallback = (token: string, mutateFn?: any) => {
  const { web3, account, chainId } = useActiveWeb3React();
  const callContractWait = useCallContractWait(false);

  const proofSWR = useUserMerkleProof(true);
  return useMemo(() => {
    return async (txID: string) => {
      try {
        let func = "mint";
        let params: any = [proofSWR.data, token];
        let sendValue = "0";

        const faucetContract = getFaucetContract(web3, chainId);

        const gasPrice = await getGasPrice(web3);
        callContractWait(
          faucetContract as Contract,
          func,
          params,
          gasPrice,
          txID,
          async (err: any) => {
            if (!err) {
              mutateFn && mutateFn();
            }
          },
          sendValue
        );
      } catch (ex) {
        console.log(ex);
      }
    };
  }, [callContractWait, web3, account, chainId, token, proofSWR.data]);
};

export default useFaucetMintCallback;
