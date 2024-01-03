import { init } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import coinbaseWalletModule from '@web3-onboard/coinbase';
import {
  chainImages,
  chainNames,
  chains,
  supportedChainIds,
} from 'constants/chains';

export const getChainName = (chainId: number): string => {
  if (supportedChainIds.includes(chainId)) {
    return chainNames[chainId];
  }
  return 'Wrong Chain';
};

export const getChainImage = (chainId: number): string => {
  if (supportedChainIds.includes(chainId)) {
    return chainImages[chainId];
  }
  return '';
};

export const walletImageURLs: Record<string, string> = {
  MetaMask: '/images/metamask.png',
  Coinbase: '/images/coinbase.svg',
};

const wallets = [injectedModule(), coinbaseWalletModule({ darkMode: true })];

export const web3Onboard = init({
  wallets,
  chains,
  theme: 'dark',
  connect: {
    autoConnectLastWallet: true,
  },
});
