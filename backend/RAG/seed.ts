import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "../database/Connection";
import { VERIFIED_AGRO_KNOWLEDGE } from "./knowledgeData";

dotenv.config();

async function seedAgriculturalKnowledge() {
  console.log("🚀 Starting Agricultural Knowledge Base seeding...");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

  console.log(`📚 Preparing to embed and insert ${VERIFIED_AGRO_KNOWLEDGE.length} verified documents...`);

  for (let i = 0; i < VERIFIED_AGRO_KNOWLEDGE.length; i++) {
    const doc = VERIFIED_AGRO_KNOWLEDGE[i];
    const textToEmbed = `Crop: ${doc.crop}\nTopic: ${doc.topic}\nDetails: ${doc.content}`;

    console.log(`[${i + 1}/${VERIFIED_AGRO_KNOWLEDGE.length}] Generating embedding for: ${doc.crop} - ${doc.topic}`);
    const embeddingResult = await embeddingModel.embedContent(textToEmbed);
    const vector = embeddingResult.embedding.values;

    const { error } = await supabase.from("agricultural_knowledge").insert({
      crop: doc.crop,
      topic: doc.topic,
      content: doc.content,
      source: doc.source,
      embedding: vector,
    });

    if (error) {
      console.warn(`⚠️ Could not insert to Supabase: ${error.message}`);
    } else {
      console.log(`✅ Successfully seeded: ${doc.crop} - ${doc.topic}`);
    }
  }

  console.log("🎉 Seeding script completed!");
}

seedAgriculturalKnowledge().catch(console.error);
