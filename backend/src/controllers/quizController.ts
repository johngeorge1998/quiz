import { Response, Request } from "express";
import QuizResult from "../models/QuizResult";
import { AuthRequest } from "../middlewares/authMiddleware";
import { encrypt, decrypt } from "../config/crypto";

const TRIVIA_API_URL = "https://the-trivia-api.com/api";

/**
 * Proxy questions from external API and mask correct answers
 */
export const getQuestions = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { category, limit = 15 } = req.query;
    
    const response = await fetch(
      `${TRIVIA_API_URL}/questions?categories=${category}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch questions from upstream API");
    }

    const questions = await response.json();
    
    // Map of question ID to correct answer for verification
    const answersMap: Record<string, string> = {};
    
    const maskedQuestions = questions.map((q: any) => {
      answersMap[q.id] = q.correctAnswer;
      
      // Combine and shuffle options
      const options = [...q.incorrectAnswers, q.correctAnswer].sort(
        () => Math.random() - 0.5,
      );
      
      // Return question without correct answer
      const { correctAnswer, incorrectAnswers, ...rest } = q;
      return { ...rest, options };
    });

    // Encrypt the answers map to send to frontend
    const answersToken = encrypt(JSON.stringify(answersMap));

    res.json({
      success: true,
      data: {
        questions: maskedQuestions,
        answersToken,
      },
    });
  } catch (error) {
    console.error("[Quiz Service]: Question fetch error", error);
    res.status(500).json({
      success: false,
      message: "Failed to load questions.",
    });
  }
};

/**
 * Persist quiz score to the database after backend verification
 */
export const submitResult = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { userAnswers, answersToken, category } = req.body;
    const userId = req.user._id;

    if (!userAnswers || !answersToken) {
      res.status(400).json({ success: false, message: "Missing required quiz data" });
      return;
    }

    // Decrypt correct answers
    const decryptedAnswers = JSON.parse(decrypt(answersToken));
    
    // Calculate score on backend
    let score = 0;
    const totalQuestions = Object.keys(decryptedAnswers).length;

    for (const [qId, correctAns] of Object.entries(decryptedAnswers)) {
      if (userAnswers[qId] === correctAns) {
        score++;
      }
    }

    const result = await QuizResult.create({
      userId,
      score,
      totalQuestions,
      category: category || "General",
    });

    res.status(201).json({
      success: true,
      message: "Quiz result verified and saved!",
      data: result,
      calculatedScore: score,
      correctAnswers: decryptedAnswers,
    });
  } catch (error) {
    console.error("[Quiz Service]: Submission error", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify and save quiz result.",
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

