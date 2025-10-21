import express from "express";
import { createQuotation, getQuotations, convertQuotationToInvoice, createInvoice, getInvoices, getInvoiceById, recordPayment, sendReminder } from "../controllers/invoice.controller.js";

const router = express.Router();

// Quotation
router.post("/quotation", createQuotation);
router.get("/quotation", getQuotations);
router.post("/quotation/:quotationId/convert", convertQuotationToInvoice);

// Invoice
router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.post("/:id/pay", recordPayment);
router.post("/:id/reminder", sendReminder);

export default router;
