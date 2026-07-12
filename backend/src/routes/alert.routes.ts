import { Router } from "express";
import { handleBroadcastAlert, handleGetActiveAlerts } from "../controllers/alert.controller";

const router = Router();

router.post("/broadcast", handleBroadcastAlert);
router.get("/active", handleGetActiveAlerts);

export default router;
