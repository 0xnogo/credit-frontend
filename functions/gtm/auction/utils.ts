import BN from 'bignumber.js';
import { BigNumber, ethers } from 'ethers';

type Order = {
  userId: string;
  buyAmount: BN;
  sellAmount: BN;
};

export function encodeOrder({ userId, buyAmount, sellAmount }: Order): string {
  return (
    '0x' +
    BigNumber.from(userId).toHexString().slice(2).padStart(16, '0') +
    BigNumber.from(buyAmount.toFixed(0))
      .toHexString()
      .slice(2)
      .padStart(24, '0') +
    BigNumber.from(sellAmount.toFixed(0))
      .toHexString()
      .slice(2)
      .padStart(24, '0')
  );
}

export function decodeOrder(orderData: string) {
  const userId = ethers.utils.defaultAbiCoder
    .decode(['uint64'], ethers.utils.hexZeroPad(orderData.slice(0, 18), 32))
    .toString();
  const buyAmount = ethers.utils.defaultAbiCoder
    .decode(
      ['uint96'],
      ethers.utils.hexZeroPad('0x' + orderData.slice(18, 42), 32),
    )
    .toString();
  const sellAmount = ethers.utils.defaultAbiCoder
    .decode(
      ['uint96'],
      ethers.utils.hexZeroPad('0x' + orderData.slice(42, 68), 32),
    )
    .toString();

  return {
    userId: userId,
    buyAmount: buyAmount,
    sellAmount: sellAmount,
  };
}
