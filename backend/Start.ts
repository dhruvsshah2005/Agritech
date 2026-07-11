// eslint-disable @typescript-eslint/no-unused-vars
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { authenticateUser } from "./Auth/Authentication";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001"
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("Server running");
});

/**
 * Protected test route
 */
app.get("/test-auth", authenticateUser, (req, res) => {
  const user = (req as any).user;

  res.json({
    message: "JWT verified successfully",
    user_id: user.sub,
    email: user.email,
    full_payload: user
  });
});

/**
 * Ephemeral session (Mocked for Web Speech fallback)
 */
app.get("/api/session", async (req, res) => {
  res.json({
    ephemeralKey: "dummy-key-for-web-speech"
  });
});

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

const chatHistory: GeminiMessage[] = [];

app.post("/api/chat/stream", async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const languageNames: Record<string, string> = {
      hi: "Hindi",
      en: "English",
      bn: "Bengali",
      te: "Telugu",
      mr: "Marathi",
      ta: "Tamil",
      gu: "Gujarati",
      kn: "Kannada",
      pa: "Punjabi",
      ml: "Malayalam",
      or: "Odia",
      as: "Assamese",
      ur: "Urdu",
      sa: "Sanskrit",
      es: "Spanish",
      ne: "Nepali"
    };
    const targetLanguage = languageNames[language || "hi"] || "Hindi";

    // Instantiate model with dynamic systemInstruction for this request
    const sessionModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are Kisan Sahayak, a helpful Indian agricultural assistant. You must respond entirely in the native script of ${targetLanguage}. Keep your answers concise, practical, and friendly. If the user greets you, greet them back warmly in ${targetLanguage}.`
    });

    // Initialize the chat session with existing history
    const chat = sessionModel.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 2000,
      }
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

    // Append both messages to local history ONLY after successful completion
    chatHistory.push({ role: "user", parts: [{ text: message }] });
    chatHistory.push({ role: "model", parts: [{ text: assistantContent }] });

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).end("Streaming failed");
  }
});

app.post("/api/chat/end", (req, res) => {
  try {
    chatHistory.length = 0;
    res.status(200).json({ message: "Chat history has been reset." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset chat history" });
  }
});

app.post("/api/plant-disease/analyze", async (req, res) => {
  try {
    const { imageBase64, language } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: "imageBase64 is required"
      });
    }

    // Parse base64 string
    const parts = imageBase64.split(";base64,");
    const mimeType = parts[0].split(":")[1] || "image/jpeg";
    const rawBase64 = parts[1] || imageBase64;

    const imagePart = {
      inlineData: {
        data: rawBase64,
        mimeType: mimeType
      }
    };

    const languageNames: Record<string, string> = {
      hi: "Hindi",
      en: "English",
      bn: "Bengali",
      te: "Telugu",
      mr: "Marathi",
      ta: "Tamil",
      gu: "Gujarati",
      kn: "Kannada",
      pa: "Punjabi",
      ml: "Malayalam",
      or: "Odia",
      as: "Assamese",
      ur: "Urdu",
      sa: "Sanskrit",
      es: "Spanish",
      ne: "Nepali"
    };
    const targetLanguage = languageNames[language || "hi"] || "Hindi";

    const prompt = `You are an agricultural plant pathology expert. Analyze the plant image and return a short disease diagnosis and treatment recommendation. If the crop looks fine, talk about the health of the plant. You MUST reply entirely in the native script of ${targetLanguage}.`;

    const response = await model.generateContent([prompt, imagePart]);
    const result = response.response.text() || "Unable to determine plant condition.";

    res.json({
      diagnosis: result
    });
  } catch (err) {
    console.error("Plant disease detection failed:", err);
    res.status(500).json({
      error: "Image analysis failed"
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

