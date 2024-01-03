import Web3 from 'web3';
import SPIN_PURCHASER_ABI from '../contracts/ABIs/spinPurchaser.json';
import ERC_721_ABI from '../contracts/ABIs/erc721.json';
import FAUCET_ABI from '../contracts/ABIs/faucet.json';
import { Erc721, Faucet, SpinPurchaser } from 'types/web3Typings';
import { Token } from 'types/assets';
import BigNumber from 'bignumber.js';

// NFT 0x4b968571AA8521Efe6485200b46e374be4422535
// Token 0xa6a3262e2524CCfFD02d954b43D36F9Bf2229D15
// Purchaser 0xb03775c4e265378003c0d08f072fc1C5577F5ff4
// Faucet 0xf3BCD708577DA8A397acb1207C4dbdca66cBCeE6

export const AUCTION_REFERRAL_LINK = 'localhost:3000/gtm/auction';

export const NFT_CONTRACT_ADDRESS =
  '0x4b968571AA8521Efe6485200b46e374be4422535';

export const FAUCET_ADDRESS = '0xf3BCD708577DA8A397acb1207C4dbdca66cBCeE6';

export const SPIN_PURCHASER_ADDRESS =
  '0xb03775c4e265378003c0d08f072fc1C5577F5ff4';

export const PURCHASE_TOKEN: Token = {
  symbol: 'ETH',
  address: '0xa6a3262e2524CCfFD02d954b43D36F9Bf2229D15',
  decimals: 18,
  name: 'Ether',
  derivedETH: new BigNumber(0),
  price: new BigNumber(0),
};

export const AUCTION_END_TIMESTAMP = 1689903328;
export const AUCTION_START_TIMESTAMP = 1689338848;

export const amountPerSpin = '1000000000000000000';

export const getFaucetContract = (web3: Web3): Faucet =>
  new web3.eth.Contract(FAUCET_ABI as any[], FAUCET_ADDRESS) as any;

export const getNFTContract = (web3: Web3, address: string): Erc721 =>
  new web3.eth.Contract(ERC_721_ABI as any[], address) as any;

export const getSpinPurchaserContract = (web3: Web3): SpinPurchaser => {
  return new web3.eth.Contract(
    SPIN_PURCHASER_ABI as any[],
    SPIN_PURCHASER_ADDRESS,
  ) as any;
};

export const standardSpinCost = 0.1;
export const passHolderSpinCost = 0.01;

const IMG_PROPS = {
  imageWidth: 50,
  imageHeight: 50,
};

export const REWARDS = [
  {
    imgURI: '/tokens/ARB.png',
    name: 'reward0',
    description: 'reward 0 description',
    style: {
      boxShadow: '0 0 10px 5px #0b121a inset',
      border: '2px #0b121a solid',
      borderLeft: '10px #0b121a solid',

      borderRight: '10px #0b121a solid',
    },
    imageProps: {
      ...IMG_PROPS,
      style: { boxShadow: '0 0 100px 10px #0ff' },
    },
  },
  {
    imgURI: '/tokens/MIM.png',
    name: 'reward1',
    description: 'reward 1 description',
    style: {
      boxShadow: '0 0 10px 5px #0b121a inset',

      border: '2px #0b121a solid',
      borderLeft: '10px #0b121a solid',
      borderRight: '10px #0b121a solid',
    },
    imageProps: {
      ...IMG_PROPS,
      style: { boxShadow: '0 0 100px 10px #4ced82' },
    },
  },
  {
    imgURI: '/tokens/USDs.png',
    name: 'reward2',
    description: 'reward 2 description',
    style: {
      boxShadow: '0 0 10px 5px #0b121a inset',

      border: '2px #0b121a solid',
      borderLeft: '10px #0b121a solid',
      borderRight: '10px #0b121a solid',
    },
    imageProps: {
      ...IMG_PROPS,
      style: { boxShadow: '0 0 100px 10px #a84bcc' },
    },
  },
  {
    imgURI: '/tokens/PLS.png',
    name: 'reward3',
    description: 'reward 3 description',
    style: {
      boxShadow: '0 0 10px 5px #0b121a inset',

      border: '2px #0b121a solid',
      borderLeft: '10px #0b121a solid',
      borderRight: '10px #0b121a solid',
    },
    imageProps: {
      ...IMG_PROPS,
      style: { boxShadow: '0 0 100px 10px #f50031' },
    },
  },
  {
    imgURI: '/tokens/wstETH.png',
    name: 'reward4',
    description: 'reward 4 description',
    style: {
      boxShadow: '0 0 10px 5px #0b121a inset',
      border: '2px #0b121a solid',

      borderLeft: '10px #0b121a solid',
      borderRight: '10px #0b121a solid',
    },
    imageProps: {
      ...IMG_PROPS,
      style: { boxShadow: '0 0 100px 10px #1fffc7' },
    },
  },
  {
    imgURI: '/tokens/XCAL.png',
    name: 'reward5',
    description: 'reward 5 description',
    style: {
      boxShadow: '0 0 10px 5px #0b121a inset',
      border: '2px #0b121a solid',

      borderLeft: '10px #0b121a solid',
      borderRight: '10px #0b121a solid',
    },
    imageProps: {
      ...IMG_PROPS,
      style: { boxShadow: '0 0 100px 10px #eb8c34' },
    },
  },
  {
    imgURI: '/tokens/REDX.webp',
    name: 'You havent won',
    description: 'Better luck next time',
    style: {
      boxShadow: '0 0 10px 5px #0b121a inset',
      border: '2px #0b121a solid',
      borderLeft: '10px #0b121a solid',

      borderRight: '10px #0b121a solid',
    },
    imageProps: {
      ...IMG_PROPS,
      style: { boxShadow: '0 0 100px 10px #ff0000' },
    },
  },
];

export const returnRandomReward = () =>
  REWARDS[Math.floor(Math.random() * REWARDS.length)];

export const PROBABILITES = [14.28, 14.28, 14.28, 14.28, 14.28, 14.28, 14.28];

export const slotPaddingProperties: Record<number, any> = {
  0: {
    padding: '5px',
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  768: {
    padding: '16px',
    paddingLeft: '17.5px',
    paddingRight: '17.5px',
  },
};

export const slotQueries = [0, 768];
