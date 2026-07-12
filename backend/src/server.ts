import http from "http";
import app from "./app";
import { config } from "./config/env";
import { socketService } from "./services/socket.service";
import { agroVectorStore } from "./services/rag.service";

const server = http.createServer(app);

// Initialize Socket.IO real-time alert engine
socketService.init(server);

// Initialize RAG knowledge vector store in background
agroVectorStore.initialize().catch((err) => {
  console.warn("RAG background initialization warning:", err);
});

server.listen(config.port, () => {
  console.log(`🌾 Kisaan Sahayak Server running at http://localhost:${config.port}`);
});

export default server;
