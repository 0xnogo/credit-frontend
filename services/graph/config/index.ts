import { ChainIds } from 'constants/chains';
import { ChainMapping } from 'types/web3';

export const XCAL_EXCHANGE_URI: ChainMapping = {
  [ChainIds.ARBITRUM_GOERLI]:
    'https://api.goldsky.com/api/public/project_clm5qt3p4rajs38v85owch1oh/subgraphs/credit-repay/1.0.9/gn',
  [ChainIds.ARBITRUM]:
    'https://api.thegraph.com/subgraphs/name/revolver0cel0t/3xcalibur-arbitrum',
  [ChainIds.LOCALHOST]: 'http://localhost:8000/subgraphs/name/3six9/Credit',
  [ChainIds.MELIORA_TEST]:
    'https://api.goldsky.com/api/public/project_clm5qt3p4rajs38v85owch1oh/subgraphs/credit-repay/1.0.4/gn',
};
