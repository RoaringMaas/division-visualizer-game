/**
 * Quiz Results Summary Component
 * Displays final score, accuracy, and question breakdown with review capability
 */

import { Button } from "@/components/ui/button";
import { DivisionProblem } from "@/lib/divisionUtils";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface QuizResultsSummaryProps {
  score: number;
  totalQuestions: number;
  answers: boolean[];
  problems: DivisionProblem[];
  onViewLeaderboard: () => void;
  onExit: () => void;
  onReviewQuestion?: (questionIndex: number) => void;
}

export default function QuizResultsSummary({
  score,
  totalQuestions,
  answers,
  problems,
  onViewLeaderboard,
  onExit,
  onReviewQuestion
}: QuizResultsSummaryProps) {
  const accuracy = Math.round((score / totalQuestions) * 100);
  const correctCount = answers.filter((a) => a === true).length;
  const incorrectCount = answers.filter((a) => a === false).length;
  const [correctedQuestions, setCorrectedQuestions] = useState<Set<number>>(new Set());

  const handleReviewQuestion = (index: number) => {
    if (onReviewQuestion) {
      onReviewQuestion(index);
    }
  };

  const handleQuestionCorrected = (index: number) => {
    const updated = new Set(correctedQuestions);
    updated.add(index);
    setCorrectedQuestions(updated);
  };

  // Calculate updated score including corrected questions
  const updatedCorrectCount = correctCount + correctedQuestions.size;
  const updatedAccuracy = Math.round((updatedCorrectCount / totalQuestions) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#fef9f3] via-[#fef3c7]/30 to-[#fef9f3] py-8 px-4"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "Fredoka" }}>
            Quiz Results
          </h1>
          <p className="text-muted-foreground">Here's how you did</p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-slate-100"
        >
          <div className="text-center mb-8">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <div className="text-6xl font-bold quotient-color mb-2">{updatedCorrectCount}/{totalQuestions}</div>
            <div className="text-3xl font-bold text-foreground mb-2">{updatedAccuracy}% Accuracy</div>
            <div className="text-lg text-muted-foreground">
              {updatedAccuracy >= 80
                ? "Excellent work! 🌟"
                : updatedAccuracy >= 60
                ? "Good effort! Keep practicing! 💪"
                : "Keep trying! You'll improve! 📚"}
            </div>
            {correctedQuestions.size > 0 && (
              <div className="text-sm text-green-600 mt-2">
                ✓ {correctedQuestions.size} question{correctedQuestions.size !== 1 ? 's' : ''} corrected
              </div>
            )}
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-green-50 rounded-lg border border-green-200 text-center"
            >
              <div className="text-3xl font-bold text-green-600">{updatedCorrectCount}</div>
              <div className="text-sm text-green-700 font-medium">Correct</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-red-50 rounded-lg border border-red-200 text-center"
            >
              <div className="text-3xl font-bold text-red-600">{incorrectCount - correctedQuestions.size}</div>
              <div className="text-sm text-red-700 font-medium">Incorrect</div>
            </motion.div>
          </div>

          {/* Question Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <h3 className="font-bold text-foreground mb-3">Question Breakdown</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Click on red questions to review and correct them
            </p>
            <div className="flex flex-wrap gap-2">
              {answers.map((isCorrect, index) => {
                const isCorrected = correctedQuestions.has(index);
                const isWrong = isCorrect === false && !isCorrected;

                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    onClick={() => isWrong && handleReviewQuestion(index)}
                    disabled={!isWrong}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white transition-all ${
                      isCorrect === true
                        ? "bg-green-500"
                        : isCorrected
                        ? "bg-blue-500 cursor-default"
                        : isWrong
                        ? "bg-red-500 hover:bg-red-600 cursor-pointer hover:scale-110"
                        : "bg-slate-300 cursor-default"
                    }`}
                    title={
                      isCorrect === true
                        ? "Correct"
                        : isCorrected
                        ? "Corrected"
                        : isWrong
                        ? "Click to review"
                        : "Unanswered"
                    }
                  >
                    {index + 1}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 flex-col sm:flex-row"
        >
          <Button
            onClick={onViewLeaderboard}
            className="flex-1 h-12 font-bold rounded-lg bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white"
          >
            Save Score to Leaderboard
          </Button>
          <Button
            onClick={onExit}
            variant="outline"
            className="flex-1 h-12 font-bold"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Menu
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
