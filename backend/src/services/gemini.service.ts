import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }

  getGenerativeModel(modelName = "gemini-2.5-flash", systemInstruction?: string) {
    return this.genAI.getGenerativeModel({
      model: modelName,
      systemInstruction,
    });
  }

  async analyzePlantImage(imageBase64: string, language = "Hindi"): Promise<string> {
    const parts = imageBase64.split(";base64,");
    const mimeType = parts[0].split(":")[1] || "image/jpeg";
    const rawBase64 = parts[1] || imageBase64;

    const imagePart = {
      inlineData: {
        data: rawBase64,
        mimeType: mimeType,
      },
    };

    const languageNames: Record<string, string> = {
      hi: "Hindi", en: "English", bn: "Bengali", te: "Telugu", mr: "Marathi",
      ta: "Tamil", gu: "Gujarati", kn: "Kannada", pa: "Punjabi", ml: "Malayalam",
      or: "Odia", as: "Assamese", ur: "Urdu", sa: "Sanskrit", es: "Spanish", ne: "Nepali"
    };
    const targetLang = languageNames[language] || language || "Hindi";

    const prompt = `You are an agricultural plant pathology expert. Analyze the plant image and return a short disease diagnosis and treatment recommendation. If the crop looks fine, talk about the health of the plant. You MUST reply entirely in the native script of ${targetLang}.`;

    const model = this.getGenerativeModel("gemini-2.5-flash");
    const response = await model.generateContent([prompt, imagePart]);
    return response.response.text() || "Unable to determine plant condition.";
  }
}

export const geminiService = new GeminiService();
