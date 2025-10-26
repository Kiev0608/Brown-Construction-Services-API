// src/config/firebase.config.js
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

// ✅ Only initialize if there’s no app yet
const app = getApps().length ? getApp() : initializeApp({ credential: cert(serviceAccount) });

// ✅ Firestore
export const db = getFirestore(app);
