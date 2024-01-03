import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import Web3 from 'web3';
import { ChainIds, supportedChainIds } from 'constants/chains';
import { useEffect, useMemo, useState } from 'react';

export function useActiveWeb3React() {
  const [triedConnect, setTriedConnect] = useState(false);

  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  useEffect(() => {
    if (!triedConnect) {
      if (connecting) {
        setTriedConnect(true);
      }
    }
  }, [connecting]);

  const account = wallet?.accounts?.[0]?.address;
  const chainId = wallet?.chains?.[0]
    ? parseInt(wallet?.chains?.[0]?.id)
    : 0;

  const [_, setChain] = useSetChain(wallet?.label);

  const wrongChain = !supportedChainIds.includes(chainId ??0);

  const web3 = useMemo(()=>new Web3(wallet?.provider as any),[wallet]);

  return {
    account,
    chainId,
    connecting,
    connect,
    disconnect,
    web3,
    wrongChain,
    label: wallet ? wallet.label : null,
    setChain,
    triedConnect,
  };
}
