/**
 * Quiz Review Mode Component
 * Allows students to revisit and redo incorrect quiz questions
 */

import AnswerInput from "@/components/AnswerInput";
import { Button } from "@/components/ui/button";
import { DivisionProblem } from "@/lib/divisionUtils";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, X } from "lucide-react";
import { useState } from "react";

interface QuizReviewModeProps {
  problems: DivisionProblem[];
  questionIndex: number;
  onAnswerCorrect: () => void;
  onExit: () => void;
}

export default function QuizReviewMode({
  problems,
  questionIndex,
  onAnswerCorrect,
  onExit
}: QuizReviewModeProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const problem = problems[questionIndex];

  const handleAnswerSubmit = (correct: boolean) => {
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleContinue = () => {
    if (isCorrect) {
      onAnswerCorrect();
    }
  };

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
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "Fredoka" }}>
              Review Question
            </h1>
            <Button
              onClick={onExit}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Back to Results
            </Button>
          </div>

          {/* Progress */}
          <div className="text-sm text-muted-foreground">
            Reviewing Question {questionIndex + 1}
          </div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 mb-6"
        >
          {/* Question Display */}
          <div className="mb-8 text-center">
            <h2 className="text-6xl font-bold text-foreground mb-4" style={{ fontFamily: "Fredoka" }}>
              {problem.dividend} ÷ {problem.divisor}
            </h2>
            <p className="text-lg text-muted-foreground">
              {problem.scenario.emoji} {problem.scenario.title}
            </p>
          </div>

          {/* Scenario Details */}
          <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-muted-foreground mb-2">Scenario:</p>
            <p className="text-foreground">{problem.scenario.description}</p>
          </div>

          {/* Answer Input */}
          <AnswerInput
            problem={problem}
            onAnswerSubmit={handleAnswerSubmit}
            showFeedback={true}
            mode="practice"
          />

          {/* Success Message */}
          {submitted && isCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle size={24} />
                <div>
                  <p className="font-bold">Great job! You got it right! 🎉</p>
                  <p className="text-sm">Click "Back to Results" to review the next question.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Incorrect Message */}
          {submitted && !isCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200"
            >
              <div className="flex items-center gap-3 text-red-700">
                <X size={24} />
                <div>
                  <p className="font-bold">Not quite right yet</p>
                  <p className="text-sm">Try again! You can do it.</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        {submitted && isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <Button
              onClick={handleContinue}
              className="flex-1 h-12 font-bold rounded-lg bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white"
            >
              Back to Results
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
