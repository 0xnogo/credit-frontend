import { db } from "@/lib/firebaseClient";
import { useActiveWeb3React } from "@services/web3/useActiveWeb3React";
import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore"
import { CreditTransactionsQuery } from "@graph/core/types";
import { addPool, poolInformationState, pushCreditTransactions, updatePool } from "./usePoolInformation";
import { getPoolInfo } from "hooks/credit/usePoolInfo";
import { useMultiCall } from "hooks/useMulticall";
import Multicall from "@/lib/multicall";
import { CreditPair } from "types/credit";
import { getTokenMappingFromPair } from "hooks/useTokenMapping";
import { getRecoil } from "recoil-nexus";
import { getCreditTransactions, getCreditTransactionsUpper } from "@graph/core/fetchers/credit";

interface FirebaseTx{
     asset_amount:string;
     asset_value:string;
     block_number:string;
     collateral_value:string;
     max_apr:string;
     id:string;
     collateral_amount:string;
     previous_block_number:string;
     tx_hash:string;
     timestamp:string;
     user:string;
     type:string;
     index:string;
}

const serializeTransaction = (tx:FirebaseTx):CreditTransactionsQuery =>{
     return {
          type:tx.type,
          assetValue:tx.asset_value,
          collateralValue:tx.collateral_value,
          maxAPR: tx.max_apr,
          id:tx.id,
          collateralAmount:tx.collateral_amount,
          blockNumber:tx.block_number,
          previousBlockNumber:tx.previous_block_number,
          assetAmount:tx.asset_amount,
          txHash:tx.tx_hash,
          timestamp:tx.timestamp,
          user : {
               id: tx.user
          },
          index:tx.index
     }
}

//here we update the latest txs as well as the latest pool parameters
export function useTransactionsController(pair:CreditPair | undefined,maturity:string | number){

  const { web3,chainId,wrongChain,account } = useActiveWeb3React()

  const [loadingAhead,setLoadingAhead] = useState(false);

  const [loadingBelow,setLoadingBelow] = useState(false);

  const multicall = useMultiCall()

  const lock = useRef(false)
  const scrollLock = useRef(false)
  
  const loadNextTransactions = async () =>{
     if(!pair || !maturity || !chainId || wrongChain || scrollLock.current) return
     const poolId = pair.address.toLowerCase()+"-"+maturity
     const transactionState = getRecoil(poolInformationState);
     const poolState = transactionState?.[poolId];
     if(!poolState || poolState.lastPage) return;
     const transactions = poolState.transactions;
     if(!transactions || transactions.length === 0) return
     let lastPage = false
     try{
          scrollLock.current = true
          setLoadingBelow(true)
          const latestTransactions = (await getCreditTransactions(chainId,10,0,transactions[transactions.length - 1].index,pair.address,maturity as number)) ?? [];
          if(latestTransactions.length < 10){
               lastPage = true;
          }
          pushCreditTransactions({
               poolId,
               lastPage,
               transactions:[...latestTransactions]
          })
     }
     catch(error){}
     finally{
          setLoadingBelow(false)
          scrollLock.current = false
     }
  }

  useEffect(()=>{
    if(!pair || !maturity || !multicall || !web3 || !chainId || wrongChain) return
       const poolId = pair.address.toLowerCase()+"-"+maturity
       const documentRef =  doc(db,'latest-transaction',poolId);

       let unsub = onSnapshot(documentRef,async (snapshot)=>{
            if(!snapshot.exists()){
                //snapshot doesnt exist, means theres currently 0 txs in the pair
                //update pool information object, ignore txs fetching
               const poolInfo = (await getPoolInfo(pair.address,maturity as number,web3,multicall as Multicall,getTokenMappingFromPair(pair)))
               addPool({
                    poolId,
                    //@ts-ignore
                    poolInformation:{
                         ...poolInfo,
                         transactions:[],
                         lastPage:true
                    }
               })
            }
            else{
               const transactionState = getRecoil(poolInformationState);
               const transactions = transactionState?.[poolId]?.transactions
               const noTransactions = (!transactions || !transactions.length)
               //snapshot exists, means theres currently >0 txs in the pair, fetch the latest value from snapshot
               const latestSnapshotData:CreditTransactionsQuery = serializeTransaction(snapshot.data() as FirebaseTx);
                //if lock is not being used being used, 
                // check: if previous index from snapshot (m) > index of highest tx in array (n) , refetch the subgraph txs from n to m 
                let currentIndex = Number(latestSnapshotData.index);
                let previousIndex = Number(noTransactions ? 0 : transactions[0].index); //0-> means we havent fetched yet, doing the first fetch
                let fecthedTxs:CreditTransactionsQuery[] = []
               
               
               if((currentIndex - 1 > previousIndex) && !lock.current){ //if the prev index and curr index are equal, we dont trigger a refresh
                         //do stuff with lock
                         lock.current = true
                         try{
                              setLoadingAhead(true)
                              //fetch the missing txs between the latest tx in the array and the latest snapshotted tx
                              fecthedTxs = await getCreditTransactionsUpper(chainId,10,previousIndex.toString(),currentIndex.toString(),pair.address,maturity as number);
                         }
                         catch(error){
                              console.log(error)
                         }
                         finally{
                              setLoadingAhead(false)
                              //free the lock
                              lock.current = false
                         }
               }

               const poolInfo = (await getPoolInfo(pair.address,maturity as number,web3,multicall as Multicall,getTokenMappingFromPair(pair)))

                //append snapshot tx to beginning of array
                //update pool information object
                if(currentIndex <= previousIndex) return
                if(previousIndex === 0 && noTransactions){
                    addPool({
                         poolId,
                         //@ts-ignore
                         poolInformation:{
                              ...poolInfo,
                              transactions:[latestSnapshotData,...fecthedTxs],
                              lastPage:false
                          }
                    })
                }
                else{
                    fecthedTxs.pop()
                    updatePool({
                         poolId,
                         //@ts-ignore
                         poolInformation:poolInfo,
                         transactions:[latestSnapshotData,...fecthedTxs]
                    })
                }
            }
       },
       (err)=>{
          console.log(err)
          //very unlikely to happen, in case it does, show a popup, or refresh page
       })
       return ()=>{
            unsub();
       }
  },[pair?.address,maturity,account,multicall,web3,chainId,wrongChain])

  return {loadingAhead,loadNextTransactions,loadingBelow};
}