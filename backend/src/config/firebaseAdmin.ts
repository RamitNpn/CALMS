import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT as string,
);

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
      storageBucket: "all-test-project-98532.appspot.com",
    })
  : getApps()[0];

export const bucket = getStorage(app).bucket();
