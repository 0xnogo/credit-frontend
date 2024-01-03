import { assetSWRConfig } from 'constants/swr';
import { CreditToken } from 'types/credit';
import useSWR, { SWRResponse } from 'swr';
import { useMultiCall } from 'hooks/useMulticall';
import { getCreditPositionContract } from 'constants/contracts';
import { multicallSplitOnOverflow } from 'lib/multicall/helpers';
import { CreditPosition as CreditPositionContract } from 'types/web3Typings/CreditPosition';
import Multicall from 'lib/multicall';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { useLendingPairs } from '@graph/core/hooks/credit';
import { CreditPairQuery } from '@graph/core/types';

export enum TokenType {
  BOND_PRINCIPAL,
  BOND_INTEREST,
  INSURANCE_PRINCIPAL,
  INSURANCE_INTEREST,
  LIQUIDITY,
  COLLATERAL_DEBT,
}

export enum PositionType {
  LIQUIDITY,
  CREDIT,
  DEBT,
  FARM,
}

type CreditPositionQuery = {
  pair:string;
  maturity:string;
  positionType:string;
  slot0:string;
  slot1:string;
  slot2:string;
  slot3:string;
}

export type CreditPosition = {
  positionType: PositionType;
  pair: string;
  maturity: string;
  CDT?: CreditToken;
  liquidityToken?: CreditToken;
  loanPrincipal?: CreditToken;
  loanInterest?: CreditToken;
  coveragePrincipal?: CreditToken;
  coverageInterest?: CreditToken;
  positionIndex: string;
};

export type AllPositions = {
  creditPositions: CreditPosition[];
  liquidityPositions: CreditPosition[];
  debtPositions: CreditPosition[];
};

async function getPositionIds(
  account: string,
  positionBalance: number,
  creditPositionsContract: CreditPositionContract,
  multicall: Multicall,
): Promise<string[]> {
  const positionIdCalls = new Array(positionBalance)
    .fill(null)
    .map((_, index) =>
      creditPositionsContract.methods.tokenOfOwnerByIndex(account, index),
    );
  const positionIds = await multicall.aggregate(positionIdCalls);

  return positionIds;
}

const formatDataIntoCreditToken = (assetContract:string,tokenId:string,totalAmount:string,tokenType:number): CreditToken => ({
  assetContract,
  tokenId,
  totalAmount: Number(totalAmount),
  tokenType: Number(tokenType),
});

function getPositionCalls(
  positionIds: string[],
  creditPositionsContract: CreditPositionContract,
) {
  return positionIds.flatMap((positionId, index) => [
    creditPositionsContract.methods.getPositions(positionId),
  ]);
}

async function getPositionData(
  pairs:CreditPairQuery[],
  positionIds: string[],
  creditPositionsContract: CreditPositionContract,
  multicall: Multicall,
): Promise<AllPositions> {
  const positionDataCalls = getPositionCalls(
    positionIds,
    creditPositionsContract,
  );

  const liquidityPositions = [];
  const creditPositions = [];
  const debtPositions = [];
  const positionData:CreditPositionQuery[] = (await multicallSplitOnOverflow(
    positionDataCalls,
    multicall,
    { maxCallsPerBatch: 500 },
  )).map((data)=>({
      pair:data[0],
      maturity:data[1],
      positionType:data[2],
      slot0:data[3],
      slot1:data[4],
      slot2:data[5],
      slot3:data[6]
    })).filter((data)=>data.pair)
  let index = 0;
  while (index < positionData.length) {
    let currentIndex = index++
    const positionQueryResult = positionData[currentIndex]
    const pairForPosition = pairs.find((pair)=>pair.address.toLowerCase() === positionQueryResult.pair.toLowerCase())
    if(!pairForPosition || !pairForPosition.pools) continue;
    const {pair} = positionQueryResult
    const positionType = positionQueryResult.positionType;
    
    let extraData = {};
    switch (Number(positionType)) {
      case PositionType.CREDIT: {

        const loanPrincipal = formatDataIntoCreditToken(
          pairForPosition.asset.address,
          positionIds[currentIndex],
          positionQueryResult.slot0,
          TokenType.BOND_PRINCIPAL
        );
        const loanInterest = formatDataIntoCreditToken(
          pairForPosition.asset.address,
          positionIds[currentIndex],
          positionQueryResult.slot1,
          TokenType.BOND_INTEREST
        );
        const coveragePrincipal = formatDataIntoCreditToken(
          pairForPosition.collateral.address,
          positionIds[currentIndex],
          positionQueryResult.slot2,
          TokenType.INSURANCE_PRINCIPAL
        );
        const coverageInterest = formatDataIntoCreditToken(
          pairForPosition.collateral.address,
          positionIds[currentIndex],
          positionQueryResult.slot3,
          TokenType.INSURANCE_INTEREST
        );
        extraData = {
          loanPrincipal,
          loanInterest,
          coveragePrincipal,
          coverageInterest,
        };
        break;
      }
      case PositionType.LIQUIDITY: {
        const liquidityToken = formatDataIntoCreditToken(
          pairForPosition.asset.address,
          positionIds[currentIndex],
          positionQueryResult.slot0,
          TokenType.LIQUIDITY
        );
        extraData = { liquidityToken };
        break;
      }
      case PositionType.DEBT: {
        const CDT = formatDataIntoCreditToken(
          pairForPosition.asset.address,
          positionIds[currentIndex],
          positionQueryResult.slot0,
          TokenType.COLLATERAL_DEBT
        );
        extraData = { CDT };
        break;
      }
    }

    const position: CreditPosition = {
      positionIndex: positionIds[currentIndex],
      positionType: Number(positionType),
      pair,
      maturity:positionQueryResult.maturity,
      ...extraData,
    };

    if (Number(positionType) === PositionType.CREDIT) {
      creditPositions.push(position);
    } else if (Number(positionType) === PositionType.LIQUIDITY) {
      liquidityPositions.push(position);
    } else {
      debtPositions.push(position);
    }

  }


  return {
    creditPositions,
    liquidityPositions,
    debtPositions,
  };
}

export function useCreditPositions(): SWRResponse<AllPositions> {
  const multicall = useMultiCall();
  const { account, chainId, web3 } = useActiveWeb3React();


  const { data:pairs=[],isValidating:isValidatingLendingPairs } = useLendingPairs();

  const creditPositionsSWR =  useSWR<AllPositions>(
    chainId && multicall && web3 && account && pairs.length>0
      ? ['my-credit-positions', account, chainId]
      : null,
    async () => {
      try {
        const creditPositionsContract = getCreditPositionContract(
          web3,
          chainId,
        );
        const totalPositions = Number(
          await creditPositionsContract.methods
            .balanceOf(account as string)
            .call(),
        );
        if (Number(totalPositions) < 0) {
          return {
            creditPositions: [],
            liquidityPositions: [],
            debtPositions: [],
          };
        }
        const positionIds = await getPositionIds(
          account as string,
          totalPositions,
          creditPositionsContract,
          multicall as Multicall,
        );
        const allPositionData = await getPositionData(
          pairs,
          positionIds,
          creditPositionsContract,
          multicall as Multicall,
        );
        return allPositionData;
      } catch (error) {
        console.log(error)
        return {
          creditPositions: [],
          liquidityPositions: [],
          debtPositions: [],
        };
      }
    },
    { ...assetSWRConfig, revalidateOnFocus: true },
  );

  return {
    ...creditPositionsSWR,
    isValidating:creditPositionsSWR.isValidating || isValidatingLendingPairs
  }
}
