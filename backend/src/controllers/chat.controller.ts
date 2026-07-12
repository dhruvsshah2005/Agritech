import { Request, Response, NextFunction } from "express";
import { geminiService } from "../services/gemini.service";
import { agroVectorStore } from "../services/rag.service";
import { GeminiMessage } from "../types";

const chatHistory: GeminiMessage[] = [];

export async function handleStreamChat(req: Request, res: Response, next: NextFunction) {
  try {
    const { message, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const languageNames: Record<string, string> = {
      hi: "Hindi", en: "English", bn: "Bengali", te: "Telugu", mr: "Marathi",
      ta: "Tamil", gu: "Gujarati", kn: "Kannada", pa: "Punjabi", ml: "Malayalam",
      or: "Odia", as: "Assamese", ur: "Urdu", sa: "Sanskrit", es: "Spanish", ne: "Nepali"
    };
    const targetLanguage = languageNames[language || "hi"] || "Hindi";

    // 1. Vector Search for RAG Grounding
    let retrievedContext = "";
    try {
      const searchResults = await agroVectorStore.search(message, 2, 0.45);
      if (searchResults && searchResults.length > 0) {
        retrievedContext = searchResults
          .map((r, i) => `[Source ${i + 1} (${r.doc.crop} - ${r.doc.topic} | ${r.doc.source})]:\n${r.doc.content}`)
          .join("\n\n");
        console.log(`🌾 RAG Retrieved ${searchResults.length} verified sources for query: "${message}"`);
      }
    } catch (ragErr) {
      console.warn("RAG retrieval warning:", ragErr);
    }

    // 2. Formulate System Instruction
    let systemInstruction = `You are Kisan Sahayak, a helpful Indian agricultural assistant. You must respond entirely in the native script of ${targetLanguage}. Keep your answers concise, practical, and friendly. If the user greets you, greet them back warmly in ${targetLanguage}.`;

    if (retrievedContext) {
      systemInstruction += `\n\n[VERIFIED INDIAN AGRICULTURAL KNOWLEDGE BASE]:\n${retrievedContext}\n\nIMPORTANT INSTRUCTION: Use the verified agricultural knowledge provided above to formulate your recommendations regarding chemicals, pesticide dosages, fertilizer schedules, and treatment steps with maximum precision.`;
    }

    // 3. Initiate Gemini Session & Stream
    const sessionModel = geminiService.getGenerativeModel("gemini-2.5-flash", systemInstruction);
    const chat = sessionModel.startChat({
      history: chatHistory,
      generationConfig: { maxOutputTokens: 2000 }
    });

    const result = await chat.sendMessageStream(message);
    let assistantContent = "";

    for await (const chunk of result.stream) {
      const token = chunk.text();
      if (token) {
        assistantContent += token;
        res.write(token);
      }
    }

    chatHistory.push({ role: "user", parts: [{ text: message }] });
    chatHistory.push({ role: "model", parts: [{ text: assistantContent }] });

    res.end();
  } catch (err) {
    next(err);
  }
}

export function handleResetChat(req: Request, res: Response) {
  chatHistory.length = 0;
  res.status(200).json({ message: "Chat history has been reset." });
}
