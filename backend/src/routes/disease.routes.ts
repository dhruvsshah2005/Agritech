import { Router } from "express";
import { handleAnalyzeDisease } from "../controllers/disease.controller";

const router = Router();

router.post("/analyze", handleAnalyzeDisease);

export default router;
