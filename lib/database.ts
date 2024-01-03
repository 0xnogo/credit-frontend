import { doc,getDoc } from "firebase/firestore";
import { db } from "./firebaseClient"

export const getMerkleProof = async (id: string,address:string) => {
  const documentRef =  doc(db,`whitelist-epoch-${id}`,address);
  const document = await getDoc(documentRef);
  if (document.exists()) {
    return document.data().proof;
  } 
  throw new Error("Document doesnt exist")
};
