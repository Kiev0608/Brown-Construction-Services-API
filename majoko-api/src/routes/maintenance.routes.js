import express from "express";
import {
  createRequest,
  assignContractor,
  updateRequestStatus,
  getAllRequests,
} from "../controllers/maintenance.controller.js";

const router = express.Router();


router.post("/create", createRequest);
router.patch("/assign/:id", assignContractor);
router.patch("/update/:id", updateRequestStatus);
router.get("/all", getAllRequests);

export default router;
