import express from "express";
import { submitResult, getLeaderboard } from "../controllers/quizController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/submit", protect, submitResult);
router.get("/leaderboard", getLeaderboard);

export default router;
