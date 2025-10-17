// src/config/firebase.config.js
import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("../browns-construction-service-firebase.json");

// Initialize Firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export Firestore database instance
export const db = admin.firestore();
