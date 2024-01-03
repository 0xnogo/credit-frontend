import { firestore } from 'firebase-admin';
import { calculatePrizeChances } from './weightedRandom';
import { getPassContract, getSpinPurchaser } from './web3Lib';
import Web3 from 'web3';

type Firestore = firestore.Firestore;

export const getUser = async (
  id: string,
  db: Firestore,
  tx?: firestore.Transaction,
) => {
  const web3 = new Web3();
  const documentRef = db.doc(`users/${web3.utils.toChecksumAddress(id)}`); //we do not check for address checksum errors here -> prevent duplicate addresses and invalid addresses
  const document = tx ? await tx.get(documentRef) : await documentRef.get();
  if (document.exists) {
    return document.data() as firestore.DocumentData;
  } else {
    const userObj = {
      hasDefaultSpun: false,
      totalSpins: 0,
    };
    tx ? await tx.set(documentRef, userObj) : await documentRef.set(userObj);
    return userObj;
  }
};

export const getMerkleProof = async (
  id: string,
  db: Firestore,
  tx?: firestore.Transaction,
) => {
  const web3 = new Web3();
  const documentRef = db.doc(
    `GENESIS_TOKEN_MERKLE_PROOFS/${web3.utils.toChecksumAddress(id)}`,
  );
  const document = tx ? await tx.get(documentRef) : await documentRef.get();
  if (document.exists) {
    return document.data() as firestore.DocumentData;
  } else {
    return undefined;
  }
};

export const checkUserSpunDefault = async (
  id: string,
  db: Firestore,
  tx?: firestore.Transaction,
) => {
  const data = await getUser(id, db, tx);
  return data.hasDefaultSpun;
};

export const setUserDefaultSpun = async (
  address: string,
  hasDefaultSpun: boolean,
  db: Firestore,
  tx: firestore.Transaction,
) => {
  const documentRef = db.doc(`users/${address}`);
  tx
    ? await tx.set(
        documentRef,
        {
          hasDefaultSpun,
        },
        { merge: true },
      )
    : await documentRef.set({ hasDefaultSpun }, { merge: true });
};

export const getCurrentPhaseFromDb = async (
  db: Firestore,
  tx?: firestore.Transaction,
): Promise<firestore.DocumentData> => {
  const documentRef = db.doc(`phase/phase`);

  const docSnap = tx ? await tx.get(documentRef) : await documentRef.get();
  return docSnap.data() as firestore.DocumentData;
};

async function getUnclaimedRewardRef(tx: firestore.Transaction, db: Firestore) {
  const querySnapshot = await tx.get(
    db.collection('prizes').where('id', '==', 'unset').limit(1),
  );
  if (querySnapshot.empty) {
    return undefined;
  }
  return querySnapshot.docs[0].ref;
}

export async function findUnclaimedRewardAndClaim(
  address: string,
  db: Firestore,
  nftId?: number,
) {
  return await db.runTransaction(async (transaction) => {
    const phase = await getCurrentPhaseFromDb(db, transaction);
    const state = calculatePrizeChances(phase.win, phase.lose);
    const unclaimedRewardRef = await getUnclaimedRewardRef(transaction, db);

    if (!unclaimedRewardRef || state === 'lose') {
      return undefined;
    } else {
      let spinInfo: any;
      spinInfo = await getSpinInformation(address, db, transaction, nftId);
      if (!spinInfo.remainingSpins)
        throw new Error('User does not have any spins left!');
      const reward = await transaction.get(unclaimedRewardRef);
      const rewardData = reward.data();
      transaction.update(unclaimedRewardRef, { id: address });

      // if (nftId !== undefined) {
      //   await setUserDefaultSpun(address, true, db, transaction);
      // }

      await incrementUserSpins(
        address,
        db,
        spinInfo.totalSpins + 1,
        transaction,
      );

      return {
        ...rewardData,
        address,
      };
    }
  });
}

export const canUserDefaultSpin = async (
  address: string,
  nftId: number,
  db: Firestore,
  transaction?: firestore.Transaction,
) => {
  const hasUserSpun = await checkUserSpunDefault(address, db, transaction);
  const nftContract = getPassContract();
  const ownerOfNFT = await nftContract.methods.ownerOf(nftId).call();
  const web3 = new Web3();
  if (
    web3.utils.toChecksumAddress(ownerOfNFT) !==
    web3.utils.toChecksumAddress(address)
  ) {
    return false;
  }
  return !hasUserSpun;
};

export const checkUserIsNFTOwner = async (address: string, nftId: number) => {
  const nftContract = getPassContract();
  const ownerOfNFT = await nftContract.methods.ownerOf(nftId).call();
  const web3 = new Web3();
  if (
    web3.utils.toChecksumAddress(ownerOfNFT) !==
    web3.utils.toChecksumAddress(address)
  ) {
    return false;
  }
  return true;
};

export const getSpinInformation = async (
  address: string,
  db: Firestore,
  tx?: firestore.Transaction,
  nftId?: number,
) => {
  const defaultSpin =
    nftId !== undefined ? Number(await checkUserIsNFTOwner(address, nftId)) : 0;
  const spinsBN: string = await getSpinPurchaser()
    .methods.spinsPurchased(address)
    .call();
  const spinsBought = Number(spinsBN);
  const user = await getUser(address, db, tx);
  let totalSpins = 0;
  totalSpins = user.totalSpins;

  return {
    remainingSpins: spinsBought - totalSpins + defaultSpin,
    spinsBought,
    totalSpins,
  };
};

export const incrementUserSpins = async (
  address: string,
  db: Firestore,
  totalSpins: number,
  tx?: firestore.Transaction,
) => {
  const documentRef = db.doc(`users/${address}`);
  tx
    ? await tx.set(
        documentRef,
        {
          totalSpins,
        },
        { merge: true },
      )
    : await documentRef.set({ totalSpins }, { merge: true });
};

export const getUserRewards = async (address: string, db: Firestore) => {
  const querySnapshot = await db
    .collection('prizes')
    .where('id', '==', address)
    .get();
  if (querySnapshot.empty) {
    return [];
  }
  return querySnapshot.docs.map((doc) => doc.data());
};
