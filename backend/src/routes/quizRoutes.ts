import express from "express";
import {
  submitResult,
  getLeaderboard,
  getQuestions,
} from "../controllers/quizController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/questions", protect, getQuestions);
router.post("/submit", protect, submitResult);
router.get("/leaderboard", getLeaderboard);

export default router;
