import { Request, Response, NextFunction } from "express";
import { agroVectorStore } from "../services/rag.service";

export async function handleSearchRag(req: Request, res: Response, next: NextFunction) {
  try {
    const { query, limit, threshold } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const results = await agroVectorStore.search(query, limit || 3, threshold || 0.45);
    res.json({ query, matchCount: results.length, results });
  } catch (err) {
    next(err);
  }
}
