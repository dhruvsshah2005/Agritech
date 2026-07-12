import { Router } from "express";
import { handleSearchRag } from "../controllers/rag.controller";

const router = Router();

router.post("/search", handleSearchRag);

export default router;
