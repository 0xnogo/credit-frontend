import { getMerkleProof } from "@/lib/database";
import { assetSWRConfig } from "@constants/swr";
import { useActiveWeb3React } from "@services/web3/useActiveWeb3React";
import useSWR from "swr";

export const useUserMerkleProof = (fetchProof: boolean) => {
  const { account, web3 } = useActiveWeb3React();

  return useSWR(
    account && fetchProof ? ["user-whitelist-merkle-proof", account] : null,
    async () => {
      try {
        const proof: string[] = await getMerkleProof(
          "2",
          web3.utils.toChecksumAddress(account as string)
        );
        return proof;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    assetSWRConfig
  );
};
