import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { handleChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", authenticate, handleChat);

export default router;
