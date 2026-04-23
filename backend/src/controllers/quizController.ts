import { Response, Request } from "express";
import QuizResult from "../models/QuizResult";
import { AuthRequest } from "../middlewares/authMiddleware";

/**
 * Persist quiz score to the database
 */
export const submitResult = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { score, totalQuestions, category } = req.body;
    const userId = req.user._id;

    const result = await QuizResult.create({
      userId,
      score,
      totalQuestions: totalQuestions || 15,
      category: category || "General",
    });

    res.status(201).json({
      success: true,
      message: "Quiz result saved!",
      data: result,
    });
  } catch (error) {
    console.error("[Quiz Service]: Submission error", error);
    res.status(500).json({
      success: false,
      message: "Failed to save quiz result.",
    });
  }
};

/**
 * Fetch top 10 scores with associated user data
 */
export const getLeaderboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const leaderboard = await QuizResult.find()
      .sort({ score: -1 })
      .populate("userId", "username")
      .limit(10);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error("[Quiz Service]: Leaderboard retrieval error", error);
    res.status(500).json({
      success: false,
      message: "Failed to load leaderboard.",
    });
  }
};
