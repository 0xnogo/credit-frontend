import BigNumber from 'bignumber.js';

export function mulDiv(
  a: BigNumber,
  b: BigNumber,
  denominator: BigNumber,
): BigNumber {
  let z = a.times(b);
  z = z.div(denominator);
  return z;
}

export function mulDivUp(
  a: BigNumber,
  b: BigNumber,
  denominator: BigNumber,
): BigNumber {
  let z = mulDiv(a, b, denominator);
  const mulmod = a.times(b).mod(denominator);
  if (mulmod.gt(0)) z = z.plus(1);
  return z;
}

export function sqrt(y: BigNumber): BigNumber {
  let z = new BigNumber(0);

  if (y.gt(3)) {
    z = y;
    let x = y.div(2).plus(1);
    while (x.lt(z)) {
      z = x;
      x = y.div(x).plus(x).div(2);
    }
  } else if (!y.eq(0)) {
    z = new BigNumber(1);
  }

  return z;
}

export function sqrtUp(y: BigNumber): BigNumber {
  let z = sqrt(y);
  if (z.mod(y).gt(0)) z = z.plus(1);
  return z;
}

export function min(x: BigNumber, y: BigNumber, z: BigNumber): BigNumber {
  if (x.lte(y) && x.lte(z)) {
    return x;
  } else if (y.lte(x) && y.lte(z)) {
    return y;
  } else {
    return z;
  }
}

export function divUp(x: BigNumber, y: BigNumber): BigNumber {
  let z = x.div(y);
  if (x.mod(y).gt(0)) z = z.plus(1);
  return z;
}

export function shiftRightUp(x: BigNumber, y: number): BigNumber {
  let z = x.div(Math.pow(2, y));
  if (!x.eq(z.times(Math.pow(2, y)))) z = z.plus(1);
  return z;
}
