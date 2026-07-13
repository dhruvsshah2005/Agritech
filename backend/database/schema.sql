-- ====================================================================
-- KISAAN SAHAYAK — COMPLETE POSTGRESQL DATABASE SCHEMA (SUPABASE)
-- ====================================================================

-- 1. FARMER PROFILES TABLE
-- Linked directly to Supabase Auth users (auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone_number TEXT,
    state TEXT,
    district TEXT,
    village TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile." 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile." 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile." 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);


-- 2. FARMER CROPS TIMELINE TABLE
-- Stores crops grown by farmers linked to their profile
CREATE TABLE IF NOT EXISTS public.crops (
    id BIGSERIAL PRIMARY KEY,
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    season TEXT, -- Kharif, Rabi, Zaid
    area_acres NUMERIC(5, 2),
    sowing_date DATE,
    expected_harvest_date DATE,
    status TEXT DEFAULT 'Growing', -- Growing, Harvested, Planning
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Crops
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can manage their own crops." 
    ON public.crops FOR ALL 
    USING (auth.uid() = farmer_id);


-- 3. AGRICULTURAL RAG KNOWLEDGE BASE TABLE (PGVECTOR)
-- Stores verified ICAR manuals and 768-dimensional vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.agricultural_knowledge (
    id BIGSERIAL PRIMARY KEY,
    crop TEXT NOT NULL,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT DEFAULT 'ICAR / KVK Verified Advisory',
    embedding VECTOR(768), -- Gemini text-embedding-004 vector space
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create HNSW Vector Index for sub-second similarity search
CREATE INDEX IF NOT EXISTS agricultural_knowledge_embedding_idx
ON public.agricultural_knowledge
USING hnsw (embedding vector_cosine_ops);

-- RPC Function for Vector Cosine Similarity Search
CREATE OR REPLACE FUNCTION match_agricultural_knowledge (
    query_embedding VECTOR(768),
    match_threshold FLOAT DEFAULT 0.65,
    match_count INT DEFAULT 3
)
RETURNS TABLE (
    id BIGINT,
    crop TEXT,
    topic TEXT,
    content TEXT,
    source TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        ak.id,
        ak.crop,
        ak.topic,
        ak.content,
        ak.source,
        1 - (ak.embedding <=> query_embedding) AS similarity
    FROM public.agricultural_knowledge ak
    WHERE 1 - (ak.embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;
