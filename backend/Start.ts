// eslint-disable @typescript-eslint/no-unused-vars
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { authenticateUser } from "./Auth/Authentication";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001"
  })
);

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

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
 * Realtime ephemeral session (UNCHANGED)
 */
app.get("/api/session", async (req, res) => {
  try {
    const sessionConfig = JSON.stringify({
      session: {
        type: "realtime",
        model: "gpt-realtime",
        audio: {
          output: { voice: "marin" }
        }
      }
    });

    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_KEY}`,
          "Content-Type": "application/json"
        },
        body: sessionConfig
      }
    );

    const data = await response.json();
    console.log(data)
    if (!response.ok) {
      return res.status(500).json(data);
    }

    res.json({
      ephemeralKey: data.value
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create session" });
  }
});


const chatHistory: ChatCompletionMessageParam[] = [];

app.post("/api/chat/stream", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1. Add the new user message to history
    chatHistory.push({ role: "user", content: message });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      // 2. Send the entire history to OpenAI
      messages: chatHistory,
      stream: true
    });

    let assistantContent = "";

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;

      if (token) {
        // 3. Accumulate the full response internally
        assistantContent += token;
        res.write(token);
      }
    }

    // 4. Save the full assistant response to history
    chatHistory.push({ role: "assistant", content: assistantContent });

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).end("Streaming failed");
  }
});

app.post("/api/chat/end", (req, res) => {
  try {
    // 1. Clear the array in-place (works even if chatHistory is const)
    chatHistory.length = 0;

    // 2. Send a success confirmation
    res.status(200).json({ message: "Chat history has been reset." });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset chat history" });
  }
});
app.post("/api/plant-disease/analyze", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: "imageBase64 is required"
      });
    }

    /**
     * Send image to OpenAI vision model
     */
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an agricultural plant pathology expert. Analyze the plant image and return a short disease diagnosis and treatment recommendation. if the crop looks fine, talk about the health of the plant, etc"
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identify any plant disease visible in this image."
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ]
    });

    const result =
      response.choices[0]?.message?.content ||
      "Unable to determine plant condition.";

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
