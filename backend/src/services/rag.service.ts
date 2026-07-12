import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env";
import { supabase } from "../config/supabase";
import { VERIFIED_AGRO_KNOWLEDGE } from "../data/knowledgeData";
import { KnowledgeDoc } from "../types";

export class AgroVectorStore {
  private genAI: GoogleGenerativeAI;
  private primaryEmbeddingModel: any;
  private fallbackEmbeddingModel: any;
  private inMemoryDocs: KnowledgeDoc[] = [];
  private isInitialized = false;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    this.primaryEmbeddingModel = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
    this.fallbackEmbeddingModel = this.genAI.getGenerativeModel({ model: "embedding-001" });
    this.inMemoryDocs = [...VERIFIED_AGRO_KNOWLEDGE];
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.primaryEmbeddingModel.embedContent(text);
      return response.embedding.values;
    } catch (err1) {
      try {
        const response = await this.fallbackEmbeddingModel.embedContent(text);
        return response.embedding.values;
      } catch (err2) {
        throw err2;
      }
    }
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;
    console.log("🌾 Initializing Agricultural RAG Knowledge Base...");
    try {
      if (!config.geminiApiKey || config.geminiApiKey.includes("your_gemini_api_key")) {
        console.log("ℹ️ GEMINI_API_KEY not set. Operating RAG in resilient keyword-search mode.");
        return;
      }
      let embeddedCount = 0;
      for (const doc of this.inMemoryDocs) {
        if (!doc.embedding) {
          try {
            const textToEmbed = `Crop: ${doc.crop}\nTopic: ${doc.topic}\nDetails: ${doc.content}`;
            doc.embedding = await this.generateEmbedding(textToEmbed);
            embeddedCount++;
          } catch (e) {
            // Silently suppress per-doc embedding failure; fallback search handles it cleanly
          }
        }
      }
      if (embeddedCount > 0) {
        console.log(`✅ Agricultural RAG Knowledge Base ready (${embeddedCount} documents embedded).`);
      } else {
        console.log("ℹ️ RAG initialized with resilient keyword-matching fallback.");
      }
    } catch (err) {
      console.log("ℹ️ Operating RAG in resilient keyword-search mode.");
    }
  }

  private keywordFallbackSearch(
    query: string,
    matchCount = 3
  ): { doc: KnowledgeDoc; similarity: number }[] {
    const stopWords = new Set(["the", "a", "an", "in", "on", "of", "and", "is", "for", "to", "with", "how", "what", "treatment", "cure"]);
    const queryTokens = query
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !stopWords.has(t));

    if (queryTokens.length === 0) return [];

    const scored = this.inMemoryDocs.map((doc) => {
      const docText = `${doc.crop} ${doc.topic} ${doc.content}`.toLowerCase();
      let score = 0;

      for (const token of queryTokens) {
        if (doc.crop.toLowerCase().includes(token)) score += 3.0;
        if (doc.topic.toLowerCase().includes(token)) score += 2.0;
        if (docText.includes(token)) score += 1.0;
      }

      const normalizedSimilarity = Math.min(0.95, score / (queryTokens.length * 2.5));
      return { doc, similarity: normalizedSimilarity };
    });

    return scored
      .filter((s) => s.similarity >= 0.25)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, matchCount);
  }

  async search(
    query: string,
    matchCount = 3,
    matchThreshold = 0.55
  ): Promise<{ doc: KnowledgeDoc; similarity: number }[]> {
    try {
      const queryEmbedding = await this.generateEmbedding(query);

      try {
        const { data, error } = await supabase.rpc("match_agricultural_knowledge", {
          query_embedding: queryEmbedding,
          match_threshold: matchThreshold,
          match_count: matchCount,
        });

        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            doc: {
              id: item.id,
              crop: item.crop,
              topic: item.topic,
              content: item.content,
              source: item.source,
            },
            similarity: item.similarity,
          }));
        }
      } catch {
        // Fall through to in-memory cosine search
      }

      if (!this.isInitialized) {
        await this.initialize();
      }

      const scoredDocs = this.inMemoryDocs
        .filter((doc) => doc.embedding && doc.embedding.length > 0)
        .map((doc) => ({
          doc,
          similarity: this.cosineSimilarity(queryEmbedding, doc.embedding!),
        }))
        .filter((item) => item.similarity >= matchThreshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, matchCount);

      if (scoredDocs.length > 0) {
        return scoredDocs;
      }
    } catch (embErr) {
      console.warn("⚠️ Embedding API unavailable or offline, engaging lexical RAG fallback.");
    }

    return this.keywordFallbackSearch(query, matchCount);
  }
}

export const agroVectorStore = new AgroVectorStore();
