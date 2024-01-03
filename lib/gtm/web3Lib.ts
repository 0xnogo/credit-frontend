import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import dotenv from 'dotenv';
import path from 'path';
import {
  NFT_CONTRACT_ADDRESS,
  getNFTContract,
  getSpinPurchaserContract,
} from '@constants/gtm';
import Web3 from 'web3';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export const getPassContract = () => {
  const web3 = createAlchemyWeb3(
    `https://arb-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  );
  //@ts-ignore
  return getNFTContract(web3, NFT_CONTRACT_ADDRESS);
};

export const getSpinPurchaser = () => {
  const web3 = createAlchemyWeb3(
    `https://arb-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  );
  //@ts-ignore
  return getSpinPurchaserContract(web3);
};
