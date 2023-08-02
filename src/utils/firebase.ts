import admin from 'firebase-admin';

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString('utf-8'))

export default admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
}).firestore();
