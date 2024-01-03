import BigNumber from 'bignumber.js';

import { CP, Claims, Due } from 'types/credit';
import { divUp, shiftRightUp, mulDivUp, mulDiv } from './math';

const BASE = new BigNumber(1099511627776); // 0x10000000000

export function mint(
  maturity: BigNumber,
  state: CP,
  totalLiquidity: BigNumber,
  feeStored: BigNumber,
  xIncrease: BigNumber,
  yIncrease: BigNumber,
  zIncrease: BigNumber,
  now: BigNumber,
): {
  liquidityOut: BigNumber;
  dueOut: Due;
  feeStoredIncrease: BigNumber;
} {
  let liquidityOut = new BigNumber(0);
  let feeStoredIncrease = new BigNumber(0);

  if (totalLiquidity.eq(0)) {
    liquidityOut = xIncrease.times(Math.pow(2, 16));
  } else {
    const fromX = mulDiv(totalLiquidity, xIncrease, state.x);
    const fromY = mulDiv(totalLiquidity, yIncrease, state.y);
    const fromZ = mulDiv(totalLiquidity, zIncrease, state.z);

    if (!fromY.lte(fromX)) console.error('E214');
    if (!fromZ.lte(fromX)) console.error('E215');

    liquidityOut = fromY.lte(fromZ) ? fromY : fromZ;
    feeStoredIncrease = mulDivUp(feeStored, liquidityOut, totalLiquidity);
  }

  let debt = maturity.minus(now).times(yIncrease);
  debt = shiftRightUp(debt, 32).plus(xIncrease);

  let collateral = maturity.minus(now).times(zIncrease);
  collateral = shiftRightUp(collateral, 25).plus(zIncrease);

  return { liquidityOut, dueOut: { debt, collateral }, feeStoredIncrease };
}

export function getLiquidityClaims(
  assetReserve: BigNumber,
  collateralReserve: BigNumber,
  totalClaims: TotalClaims,
  liquidityIn: BigNumber,
  totalLiquidity: BigNumber,
  lpFeeStored: BigNumber,
) {
  let assetOut = new BigNumber(0);
  let collateralOut = new BigNumber(0);
  const totalAsset = assetReserve;
  const totalCollateral = collateralReserve;
  let totalLoan = totalClaims.loanPrincipal;
  totalLoan = totalLoan.plus(totalClaims.loanInterest);

  if (totalAsset.gte(totalLoan)) {
    let _assetOut = totalAsset;
    _assetOut = _assetOut.minus(totalLoan);
    _assetOut = mulDiv(_assetOut, liquidityIn, totalLiquidity);
    assetOut = _assetOut;

    // TODO: check if the removal of the debt for LP is going to change anything here
    // seems like LP are getting their collateral back here
    // But still need to check if LPs are getting back all what they should (even without the debt token)
    let _collateralOut = totalCollateral;
    _collateralOut = mulDiv(_collateralOut, liquidityIn, totalLiquidity);
    collateralOut = _collateralOut;
  } else {
    let deficit = totalLoan;
    deficit = deficit.minus(totalAsset);

    let totalCoverage = totalClaims.coveragePrincipal;
    totalCoverage = totalCoverage.plus(totalClaims.coverageInterest);

    if (totalCollateral.times(totalLoan).gt(deficit.times(totalCoverage))) {
      let _collateralOut = totalCollateral;
      let subtrahend = deficit;
      subtrahend = subtrahend.times(totalCoverage);
      subtrahend = divUp(subtrahend, totalLoan);
      _collateralOut = _collateralOut.minus(subtrahend);
      _collateralOut = mulDiv(_collateralOut, liquidityIn, totalLiquidity);
      collateralOut = _collateralOut;
    }
  }

  const lpFeeOut = mulDiv(lpFeeStored, liquidityIn, totalLiquidity);

  return {
    lpFeeOut,
    assetOut,
    collateralOut,
  };
}

export const lendGetFees = (
  maturity: BigNumber,
  xIncrease: BigNumber,
  fee: BigNumber,
  protocolFee: BigNumber,
  stakingFee: BigNumber,
  now: BigNumber,
) => {
  const totalFee = fee.plus(protocolFee).plus(stakingFee);

  const numerator = new BigNumber(maturity)
    .minus(now)
    .times(totalFee)
    .plus(BASE);
  let adjusted = xIncrease;
  adjusted = adjusted.times(numerator);
  adjusted = divUp(adjusted, BASE);
  let totalFeeStoredIncrease = adjusted.minus(xIncrease);
  return totalFeeStoredIncrease;
};

export const borrowGetFees = (
  maturity: BigNumber,
  xDecrease: BigNumber,
  fee: BigNumber,
  protocolFee: BigNumber,
  stakingFee: BigNumber,
  now: BigNumber,
) => {
  const totalFee = fee.plus(protocolFee).plus(stakingFee);

  const denominator = maturity.minus(now).times(totalFee).plus(BASE);
  const adjusted = xDecrease.times(BASE).div(denominator);
  const totalFeeStoredIncrease = xDecrease.minus(adjusted);
  return totalFeeStoredIncrease;
};

export function lend(
  maturity: BigNumber,
  state: CP,
  xIncrease: BigNumber,
  yDecrease: BigNumber,
  zDecrease: BigNumber,
  fee: BigNumber,
  protocolFee: BigNumber,
  stakingFee: BigNumber,
  now: BigNumber,
): {
  claimsOut: Claims;
  lendFees: BigNumber;
} {
  const loanPrincipal = xIncrease;
  const loanInterest = getBondInterest(maturity, yDecrease, now);
  const coveragePrincipal = getInsurancePrincipal(state, xIncrease);
  const coverageInterest = getInsuranceInterest(maturity, zDecrease, now);

  const lendFees = lendGetFees(
    maturity,
    xIncrease,
    fee,
    protocolFee,
    stakingFee,
    now,
  );

  return {
    claimsOut: {
      loanPrincipal,
      loanInterest,
      coveragePrincipal,
      coverageInterest,
    },
    lendFees,
  };
}

export function borrow(
  maturity: BigNumber,
  state: CP,
  xDecrease: BigNumber,
  yIncrease: BigNumber,
  zIncrease: BigNumber,
  fee: BigNumber,
  protocolFee: BigNumber,
  stakingFee: BigNumber,
  now: BigNumber,
): {
  dueOut: Due;
  borrowFees: BigNumber;
} {
  borrowCheck(state, xDecrease, yIncrease, zIncrease);

  const debt = getDebt(maturity, xDecrease, yIncrease, now);
  const collateral = getCollateral(maturity, state, xDecrease, zIncrease, now);

  const borrowFees = borrowGetFees(
    maturity,
    xDecrease,
    fee,
    protocolFee,
    stakingFee,
    now,
  );

  return {
    dueOut: { debt, collateral },
    borrowFees,
  };
}

export function getDebt(
  maturity: BigNumber,
  xDecrease: BigNumber,
  yIncrease: BigNumber,
  now: BigNumber,
): BigNumber {
  let debtIn = maturity.minus(now).times(yIncrease);
  debtIn = shiftRightUp(debtIn, 32).plus(xDecrease);
  return debtIn;
}

function getCollateral(
  maturity: BigNumber,
  state: CP,
  xDecrease: BigNumber,
  zIncrease: BigNumber,
  now: BigNumber,
): BigNumber {
  let collateralIn = maturity.minus(now).times(zIncrease);
  collateralIn = shiftRightUp(collateralIn, 25);

  let minimum = state.z.times(xDecrease);
  const denominator = state.x.minus(xDecrease);
  minimum = divUp(minimum, denominator);

  collateralIn = collateralIn.plus(minimum);
  return collateralIn;
}

export function getInsurancePrincipal(
  state: CP,
  xIncrease: BigNumber,
): BigNumber {
  let _coveragePrincipalOut = state.z;
  _coveragePrincipalOut = _coveragePrincipalOut.times(xIncrease);
  let denominator = state.x;
  denominator = denominator.plus(xIncrease);
  _coveragePrincipalOut = _coveragePrincipalOut.div(denominator);
  return _coveragePrincipalOut;
}

export function getBondInterest(
  maturity: BigNumber,
  yDecrease: BigNumber,
  now: BigNumber,
): BigNumber {
  return maturity.minus(now).times(yDecrease).div(Math.pow(2, 32));
}

export function getInsuranceInterest(
  maturity: BigNumber,
  zDecrease: BigNumber,
  now: BigNumber,
): BigNumber {
  return maturity.minus(now).times(zDecrease).div(Math.pow(2, 25));
}

function borrowCheck(
  state: CP,
  xDecrease: BigNumber,
  yIncrease: BigNumber,
  zIncrease: BigNumber,
) {
  const xReserve = state.x.minus(xDecrease);
  const yReserve = state.y.plus(yIncrease);
  const zReserve = state.z.plus(zIncrease);
  checkConstantProduct(state, xReserve, yReserve, zReserve);

  let yMax = xDecrease.times(state.y);
  yMax = divUp(yMax, xReserve);
  if (yIncrease.gt(yMax)) throw new Error('E214');

  let zMax = xDecrease.times(state.z);
  zMax = divUp(zMax, xReserve);
  if (zIncrease.gt(zMax)) throw new Error('E215');

  let yMin = yMax;
  yMin = shiftRightUp(yMin, 4);
  if (yMin.gt(yIncrease)) throw new Error('E217');
}

export function checkConstantProduct(
  state: CP,
  xReserve: BigNumber,
  yAdjusted: BigNumber,
  zAdjusted: BigNumber,
) {
  const newProd = yAdjusted.times(zAdjusted).times(xReserve);
  const oldProd = state.y.times(state.z).times(state.x);
  if (newProd.lt(oldProd)) throw new Error('E301');
}

interface TotalClaims {
  loanPrincipal: BigNumber;
  loanInterest: BigNumber;
  coveragePrincipal: BigNumber;
  coverageInterest: BigNumber;
}

export function withdraw(
  assetReserve: BigNumber,
  collateralReserve: BigNumber,
  totalClaims: TotalClaims,
  claimsIn: TotalClaims,
) {
  let assetOut = new BigNumber(0);
  let collateralOut = new BigNumber(0);
  let totalAsset = assetReserve;
  let totalLoanPrincipal = totalClaims.loanPrincipal;
  let totalLoanInterest = totalClaims.loanInterest;
  let totalLoan = totalLoanPrincipal;
  totalLoan = totalLoan.plus(totalLoanInterest);

  if (totalAsset.gte(totalLoan)) {
    assetOut = claimsIn.loanPrincipal;
    assetOut = assetOut.plus(claimsIn.loanInterest);
  } else {
    if (totalAsset.gte(totalLoanPrincipal)) {
      let remaining = totalAsset;
      remaining = remaining.minus(totalLoanPrincipal);
      let _assetOut = claimsIn.loanInterest;
      _assetOut = assetOut.times(remaining);
      _assetOut = _assetOut.div(totalLoanInterest);
      _assetOut = _assetOut.plus(claimsIn.loanPrincipal);
      assetOut = _assetOut;
    } else {
      let _assetOut = claimsIn.loanPrincipal;
      _assetOut = _assetOut.times(totalAsset);
      _assetOut = _assetOut.div(totalLoanPrincipal);
      assetOut = _assetOut;
    }

    let deficit = totalLoan;
    deficit = deficit.minus(totalAsset);

    let totalCoveragePrincipal = totalClaims.coveragePrincipal;
    totalCoveragePrincipal = totalCoveragePrincipal.times(deficit);
    let totalCoverageInterest = totalClaims.coverageInterest;
    totalCoverageInterest = totalCoverageInterest.times(deficit);
    let totalCoverage = totalCoveragePrincipal;
    totalCoverage = totalCoverage.plus(totalCoverageInterest);

    let totalCollateral = collateralReserve;
    totalCollateral = totalCollateral.times(totalLoan);

    if (totalCollateral.gte(totalCoverage)) {
      let _collateralOut = claimsIn.coveragePrincipal;
      _collateralOut = _collateralOut.plus(claimsIn.coverageInterest);
      _collateralOut = _collateralOut.times(deficit);
      _collateralOut = _collateralOut.div(totalLoan);
      collateralOut = _collateralOut;
    } else if (totalCollateral.gte(totalCoveragePrincipal)) {
      let remaining = totalCollateral;
      remaining = remaining.minus(totalCoveragePrincipal);
      let _collateralOut = claimsIn.coverageInterest;
      _collateralOut = _collateralOut.times(deficit);
      let denominator = totalCoverageInterest;
      denominator = denominator.times(totalLoan);
      _collateralOut = mulDiv(_collateralOut, remaining, denominator);
      let addend = claimsIn.coveragePrincipal;
      addend = addend.times(deficit);
      addend = addend.div(totalLoan);
      _collateralOut = _collateralOut.plus(addend);
      collateralOut = _collateralOut;
    } else {
      let _collateralOut = claimsIn.coveragePrincipal;
      _collateralOut = _collateralOut.times(deficit);
      let denominator = totalCoveragePrincipal;
      denominator = denominator.times(totalLoan);
      _collateralOut = mulDiv(_collateralOut, totalCollateral, denominator);
      collateralOut = _collateralOut;
    }
  }

  return { assetOut, collateralOut };
}
