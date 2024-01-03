import BigNumber from 'bignumber.js';
import { CP, Due, Claims } from 'types/credit';
import { divUp } from './math';
import * as CreditMath from './CreditMath';

export function givenNew(
  maturity: BigNumber,
  assetIn: BigNumber,
  debtIn: BigNumber,
  collateralIn: BigNumber,
  now: BigNumber,
): LiquidityResult {
  const xIncrease = assetIn;
  const duration = maturity.minus(now);

  const yIncrease = debtIn.minus(assetIn).times(Math.pow(2, 32)).div(duration);
  const zIncrease = collateralIn
    .times(Math.pow(2, 25))
    .div(duration.plus(0x2000000));

  return { xIncrease, yIncrease, zIncrease };
}

export function givenAsset(
  cp: CP,
  assetIn: BigNumber,
  feeStored: BigNumber,
): LiquidityResult {
  let xIncrease = assetIn.times(cp.x);
  const denominator = cp.x.plus(feeStored);
  xIncrease = xIncrease.div(denominator);

  const yIncrease = cp.y.times(xIncrease).div(cp.x);

  const zIncrease = cp.z.times(xIncrease).div(cp.x);

  return { xIncrease, yIncrease, zIncrease };
}

export function givenCollateral(
  cp: CP,
  maturity: BigNumber,
  collateralIn: BigNumber,
  now: BigNumber,
): LiquidityResult {
  let zIncrease = collateralIn.times(Math.pow(2, 25));
  const denominator = maturity.minus(now).plus(0x2000000);
  zIncrease = zIncrease.div(denominator);

  let xIncrease = cp.x.times(zIncrease);
  xIncrease = divUp(xIncrease, cp.z);

  const yIncrease = cp.y.times(zIncrease).div(cp.z);

  return { xIncrease, yIncrease, zIncrease };
}

export function mint(
  feeStored: BigNumber,
  state: CP,
  totalLiquidity: BigNumber,
  maturity: BigNumber,
  xIncrease: BigNumber,
  yIncrease: BigNumber,
  zIncrease: BigNumber,
  now: BigNumber,
): {
  assetIn: BigNumber;
  liquidityOut: BigNumber;
  dueOut: Due;
} {
  const { liquidityOut, dueOut, feeStoredIncrease } = CreditMath.mint(
    maturity,
    state,
    totalLiquidity,
    feeStored,
    xIncrease,
    yIncrease,
    zIncrease,
    now,
  );

  const assetIn = xIncrease.plus(feeStoredIncrease);

  return { assetIn, liquidityOut, dueOut };
}

interface LiquidityResult {
  xIncrease: BigNumber;
  yIncrease: BigNumber;
  zIncrease: BigNumber;
}

export default {
  givenNew,
  givenAsset,
  givenCollateral,
  mint,
};
