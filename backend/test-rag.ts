import { agroVectorStore } from "./RAG/VectorStore";

async function testRag() {
  console.log("🔍 Running RAG Vector Similarity Search Test...\n");

  const testQueries = [
    "How to treat yellow rust in wheat?",
    "Paddy blast fungicide dosage",
    "What is the neem oil recipe for sucking pests?"
  ];

  for (const q of testQueries) {
    console.log(`\n==============================================`);
    console.log(`🔎 Query: "${q}"`);
    console.log(`==============================================`);

    const results = await agroVectorStore.search(q, 2, 0.4);

    if (results.length === 0) {
      console.log("❌ No matching documents found.");
    } else {
      results.forEach((res, idx) => {
        console.log(`\n[Match #${idx + 1}] (Similarity Score: ${(res.similarity * 100).toFixed(2)}%)`);
        console.log(`Crop: ${res.doc.crop} | Topic: ${res.doc.topic}`);
        console.log(`Source: ${res.doc.source}`);
        console.log(`Content Excerpt:\n${res.doc.content.substring(0, 180)}...`);
      });
    }
  }

  console.log("\n🎉 RAG Search Test Complete!");
  process.exit(0);
}

testRag().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
