import { Due } from "types/credit";
import BigNumber from "bignumber.js";

export function givenMaxAssetsIn(
    dues:Due[],
    assetsIn:BigNumber[],
):BigNumber[] {
    const length = dues.length;
    let collateralsOut = new Array(length)

    for (var i=0; i < length;i++ ) {
        const due = dues[i]

        if (assetsIn[i].gt(due.debt)) assetsIn[i] = due.debt;
            let _collateralOut = due.collateral;
            if (!due.debt.eq(0)) {
                _collateralOut = _collateralOut.times(assetsIn[i]);
                _collateralOut = _collateralOut.div(due.debt);
            }
            collateralsOut[i] = _collateralOut
    }

    return collateralsOut
}