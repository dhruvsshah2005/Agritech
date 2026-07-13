-- 1. Enable the pgvector extension to work with vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create table to store verified agricultural knowledge documents
CREATE TABLE IF NOT EXISTS agricultural_knowledge (
    id BIGSERIAL PRIMARY KEY,
    crop TEXT NOT NULL,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT DEFAULT 'ICAR / KVK Verified Advisory',
    embedding VECTOR(768), -- Gemini text-embedding-004 produces 768-dimensional vectors
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create an HNSW index for fast approximate nearest neighbor vector search
CREATE INDEX IF NOT EXISTS agricultural_knowledge_embedding_idx
ON agricultural_knowledge
USING hnsw (embedding vector_cosine_ops);

-- 4. Create RPC search function for cosine similarity matching
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
    FROM agricultural_knowledge ak
    WHERE 1 - (ak.embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;
