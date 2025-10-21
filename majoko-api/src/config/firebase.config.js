// src/config/firebase.config.js
const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.resolve(__dirname, "serviceAccountKey.json");
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = { admin, db };
