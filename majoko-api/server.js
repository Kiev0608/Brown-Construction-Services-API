// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Firebase init
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccount = JSON.parse(
  await import(`file://${path.resolve(__dirname, "./src/browns-construction-service-firebase.json")}`, {
    assert: { type: "json" }
  }).then((m) => JSON.stringify(m.default))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

import { db } from "./src/config/firebase.config.js";

// Auth middleware
import { authenticate, authorizeRoles } from "./src/middleware/auth.js";

// Routes
import maintenanceRoutes from "./src/routes/maintenance.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test endpoint
app.get("/", (req, res) => res.send("✅ API running!"));

// Auth routes (login/registration)
app.use("/auth", authRoutes);

// Maintenance routes (role-protected)
app.use(
  "/maintenance",
  authenticate(), // attach req.user
  maintenanceRoutes // inside, we will check roles for create/update
);

// Test Firebase connection
app.get("/test-firebase", async (req, res) => {
  try {
    const testDoc = await db.collection("test").add({ message: "Firebase is working!" });
    res.json({ success: true, id: testDoc.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
