import { Router } from "express";
import { handleStreamChat, handleResetChat } from "../controllers/chat.controller";

const router = Router();

router.post("/stream", handleStreamChat);
router.post("/end", handleResetChat);

export default router;
