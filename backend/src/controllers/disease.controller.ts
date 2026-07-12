import { Request, Response, NextFunction } from "express";
import { geminiService } from "../services/gemini.service";

export async function handleAnalyzeDisease(req: Request, res: Response, next: NextFunction) {
  try {
    const { imageBase64, language } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required" });
    }

    const diagnosis = await geminiService.analyzePlantImage(imageBase64, language);
    res.json({ diagnosis });
  } catch (err) {
    next(err);
  }
}
