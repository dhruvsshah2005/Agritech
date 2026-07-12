import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: "*", // allow cross-origin access from Next.js frontend
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health Check
app.get("/", (req, res) => {
  res.send("Kisaan Sahayak API & Real-Time Socket Server Running");
});

app.get("/api/session", (req, res) => {
  res.json({ ephemeralKey: "dummy-key-for-web-speech" });
});

// Main API Routes
app.use("/api", routes);

// Global Error Handler
app.use(errorHandler);

export default app;
