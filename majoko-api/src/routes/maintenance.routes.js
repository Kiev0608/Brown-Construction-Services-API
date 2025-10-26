import express from "express";
import {
  createRequest,
  assignContractor,
  updateRequestStatus,
  getAllRequests,
} from "../controllers/maintenance.controller.js";

const router = express.Router();

// 1️⃣ Client: Create maintenance request
router.post("/create", createRequest);

// 2️⃣ Admin: Assign contractor
router.patch("/assign/:id", assignContractor);

// 3️⃣ Contractor/Admin: Update status
router.patch("/update/:id", updateRequestStatus);

// 4️⃣ View all requests
router.get("/all", getAllRequests);

export default router;
