export enum ChainIds {
  ETHEREUM = 1,
  ARBITRUM = 42161,
  FANTOM = 250,
  ARBITRUM_RINKEBY = 421611,
  ARBITRUM_GOERLI = 421613,
  KOVAN = 42,
  GOERLI = 5,
  LOCALHOST = 31337,
  MELIORA_TEST = 3333
}

export const chainNames: Record<number, string> = {
  [ChainIds.ETHEREUM]: 'Ethereum',
  [ChainIds.ARBITRUM]: 'Arbitrum One',
  [ChainIds.ARBITRUM_GOERLI]: 'Arbitrum Goerli',
  [ChainIds.LOCALHOST]: 'LocalHost',
  [ChainIds.MELIORA_TEST]: "Meliora Testnet"
};

export const chainImages: Record<number, string> = {
  [ChainIds.ETHEREUM]: '/tokens/ETH.png',
  [ChainIds.ARBITRUM]: '/tokens/ARB.png',
  [ChainIds.ARBITRUM_GOERLI]: '/tokens/ARB.png',
  [ChainIds.LOCALHOST]: '',
  [ChainIds.MELIORA_TEST]: "/tokens/meliora.jpeg"
};

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export const melioraTest = {
  id: '0xD05',
  token: 'ETH',
  label: 'Meliora Testnet',
  rpcUrl: `https://volatilis-testnet.calderachain.xyz/http`,
}

export const arbitrumGoerliChain = {
  id: '0x66eed',
  token: 'AETH',
  label: 'Arbitrum Goerli',
  rpcUrl: `https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
};

export const arbitrumOneChain = {
  id: '0xa4b1',
  token: 'AETH',
  label: 'Arbitrum One',
  rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
};

export const localhostChain = {
  id: '0x7a69',
  token: 'ETH',
  label: 'Localhost',
  rpcUrl: 'http://localhost:8545',
};

const localChains = [arbitrumGoerliChain, arbitrumOneChain, localhostChain, melioraTest];

const productionChains = [arbitrumGoerliChain, 
  // melioraTest
];

export const chains =
  process.env.NODE_ENV === 'production' ? productionChains : localChains;

export const supportedChainIds = chains.map((chain) =>
  Number.parseInt(chain.id),
);
