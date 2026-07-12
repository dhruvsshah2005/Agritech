import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3001",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  supabaseUrl: process.env.SUPABASE_URL || "https://placeholder-project.supabase.co",
  supabaseKey: process.env.SUPABASE_KEY || "placeholder-anon-key",
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET || "",
};
