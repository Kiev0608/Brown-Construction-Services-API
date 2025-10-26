import express from "express";
import dotenv from "dotenv";

// Routes
import invoiceRoutes from "./src/routes/invoice.routes.js";
import maintenanceRoutes from "./src/routes/maintenance.routes.js";
import messageRoutes from "./src/routes/message.routes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/messages", messageRoutes);

// Mount routes
app.use("/invoice", invoiceRoutes);
app.use("/maintenance", maintenanceRoutes);

// Test root
app.get("/", (req, res) => res.send("API is running..."));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
