import express from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  deleteInvoice,
  createPaypalOrder,
  capturePaypalPayment,
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.post("/create", createInvoice);
router.get("/all", getAllInvoices);
router.get("/:id", getInvoiceById);
router.put("/update/:id", updateInvoiceStatus);
router.delete("/delete/:id", deleteInvoice);

// PayPal
router.post("/paypal/create-order", createPaypalOrder);
router.post("/paypal/capture-payment", capturePaypalPayment);

export default router;