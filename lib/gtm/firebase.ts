import * as admin from 'firebase-admin';
import { serviceAccount } from '../../constants/gtm/serviceAccount';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
  });
}

const db = admin.firestore();

export { db, admin, serviceAccount };
