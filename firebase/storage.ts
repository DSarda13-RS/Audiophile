import admin, {ServiceAccount} from "firebase-admin";

import serviceAccount from "../serviceAccountKey.json"
const accountKey = serviceAccount as ServiceAccount

if(!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert(accountKey),
        storageBucket: process.env.BUCKET_URL
    });
}

const storage = admin.storage().bucket();
export default storage;

