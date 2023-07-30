import admin from 'firebase-admin';
import serviceAccount from "../../firebase-adminsdk.json"

export default admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
}).firestore();
