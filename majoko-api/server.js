// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import Firebase db from src/config
import { db } from "./src/config/firebase.config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ API is running!");
});

// Example maintenance endpoint
app.post("/maintenance", async (req, res) => {
  try {
    const { clientName, description, status } = req.body;

    const docRef = await db.collection("maintenance").add({
      clientName,
      description,
      status: status || "Pending",
      createdAt: new Date()
    });

    res.status(201).json({ message: "Maintenance request created", id: docRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create maintenance request" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
