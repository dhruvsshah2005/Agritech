import { Router } from "express";
import chatRoutes from "./chat.routes";
import diseaseRoutes from "./disease.routes";
import alertRoutes from "./alert.routes";
import ragRoutes from "./rag.routes";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

router.use("/chat", chatRoutes);
router.use("/plant-disease", diseaseRoutes);
router.use("/alerts", alertRoutes);
router.use("/rag", ragRoutes);

// Protected test route verifying Supabase JWT
router.get("/test-auth", authenticateUser, (req, res) => {
  const user = (req as any).user;
  res.json({
    message: "JWT verified successfully",
    user_id: user.sub,
    email: user.email,
    full_payload: user,
  });
});

export default router;
