import express from "express";
import { createMessage, getUserMessages, markMessageRead } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send", createMessage);

router.get("/user/:userId", getUserMessages);

router.put("/read/:messageId", markMessageRead);

export default router;
