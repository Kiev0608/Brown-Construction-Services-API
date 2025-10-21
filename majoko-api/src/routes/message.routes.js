import express from "express";
import { sendMessage, getThreadWithUser, getUserMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/thread/:userId", getThreadWithUser);
router.get("/user/:userId", getUserMessages);

export default router;
