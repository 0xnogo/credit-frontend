export type Reward = {
  imgURI: string;
  name: string;
  description: string;
  style?: any;
  imageProps: {
    imageWidth: number;
    imageHeight: number;
    style?: any;
  };
};

type SelectorPosition = 'across' | 'top' | 'bottom';

export type SelectorProperties = {
  imgURI: string;
  position: SelectorPosition;
  width: number;
  heights: Record<any, any>;
  style: any;
};

export type GameInfo = {
  canDefaultSpin: boolean;
  userHasNFT: boolean;
  spinInfo: {
    remainingSpins: number;
    spinsBought: number;
    totalSpins: number;
  };
  tokenId: string;
};
