import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      default: 15,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const QuizResult = mongoose.model("QuizResult", quizResultSchema);
export default QuizResult;
