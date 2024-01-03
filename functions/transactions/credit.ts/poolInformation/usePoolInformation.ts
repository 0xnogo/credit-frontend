import { CreditTransactionsQuery } from "@graph/core/types";
import BigNumber from "bignumber.js";
import { atom, useRecoilState } from "recoil";
import { getRecoil, setRecoil } from "recoil-nexus";

interface PoolInformation {
    X:BigNumber;
    Y:BigNumber;
    Z:BigNumber;
    assetReserve:BigNumber;
    collateralReserve:BigNumber;
    feeStored:BigNumber;
    totalClaims:{
        loanPrincipal: BigNumber;
        loanInterest: BigNumber;
        coveragePrincipal: BigNumber;
        coverageInterest: BigNumber;
    };
    totalLiquidity:BigNumber;
    transactions:CreditTransactionsQuery[];
    lastPage:boolean;
}

interface PushCreditTransactions { 
    poolId:string;
    lastPage:boolean;
    transactions:CreditTransactionsQuery[]
}

interface AddPool {
    poolId:string;
    poolInformation:PoolInformation;
}

interface UpdatePool {
    poolId:string;
    poolInformation:{    
        X?:BigNumber;
        Y?:BigNumber;
        Z?:BigNumber;
        assetReserve?:BigNumber;
        collateralReserve?:BigNumber;
        feeStored?:BigNumber;
        totalClaims?:{
            loanPrincipal: BigNumber;
            loanInterest: BigNumber;
            coveragePrincipal: BigNumber;
            coverageInterest: BigNumber;
        };
        totalLiquidity?:BigNumber;
        lastPage?:boolean;
    };
    transactions?:CreditTransactionsQuery[]
}

const initialState: {
    [poolId:string]:PoolInformation
} = {
  
};
  
export const poolInformationState = atom({
    key: 'poolInformation',
    default: initialState,
});

export const pushCreditTransactions = (payload: PushCreditTransactions) => {
    const { poolId,transactions,lastPage } = payload
    const transactionInfo = getRecoil(poolInformationState);
    setRecoil(poolInformationState, {
        ...transactionInfo,
        [poolId]:{
        ...transactionInfo[poolId],
        lastPage,
        transactions:[...(transactionInfo[poolId]?.transactions ?? []),...transactions]
        }
    });
};


export const addPool = (payload: AddPool) =>{
    const { poolId,poolInformation } = payload
    const transactionInfo = getRecoil(poolInformationState);
    setRecoil(poolInformationState, {
        ...transactionInfo,
        [poolId]:poolInformation
    });
}

export const updatePool = (payload: UpdatePool) =>{
    const { poolId,poolInformation,transactions } = payload
    const transactionInfo = getRecoil(poolInformationState);
    setRecoil(poolInformationState, {
        ...transactionInfo,
        [poolId]:{
            ...transactionInfo[poolId],
            ...poolInformation,
            transactions:[...(transactions??[]),...(transactionInfo[poolId]?.transactions ?? [])]
        }
    });
}

export const resetState = () => {
    setRecoil(poolInformationState, initialState);
};
  
export function useAllPoolInformation(pairAddress:string | undefined,maturity:number | undefined) {

    const [allPoolInformation] = useRecoilState(poolInformationState);

    const key =  pairAddress ? pairAddress?.toLowerCase() + "-" + maturity : '-'

    const poolObject = allPoolInformation?.[key]

    return {
        poolInfo:poolObject,
        addPool,
        updatePool,
        resetState,
    };
}
  