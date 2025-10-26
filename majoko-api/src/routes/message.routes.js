import express from "express";
import { createMessage, getUserMessages, markMessageRead } from "../controllers/message.controller.js";

const router = express.Router();

// Send a message
router.post("/send", createMessage);

// Get all messages for a user
router.get("/user/:userId", getUserMessages);

// Mark message as read
router.put("/read/:messageId", markMessageRead);

export default router;
