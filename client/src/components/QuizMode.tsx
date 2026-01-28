/**
 * Quiz Mode Component
 * 10-question quiz with randomized problems and score tracking
 */

import AnswerInput from "@/components/AnswerInput";
import DivisionVisualizer from "@/components/DivisionVisualizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DivisionProblem, generateDivisionProblem } from "@/lib/divisionUtils";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface QuizModeProps {
  onComplete?: (score: number, studentName: string) => void;
  onExit?: () => void;
}

export default function QuizMode({ onComplete, onExit }: QuizModeProps) {
  const QUIZ_LENGTH = 10;
  const [problems, setProblems] = useState<DivisionProblem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);

  // Generate quiz problems on mount
  useEffect(() => {
    const generatedProblems = Array.from({ length: QUIZ_LENGTH }, () =>
      generateDivisionProblem()
    );
    setProblems(generatedProblems);
  }, []);

  const handleAnswerSubmit = (isCorrect: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = isCorrect;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    // If answer hasn't been submitted yet, don't allow advancing
    if (answers[currentQuestion] === undefined) {
      return;
    }
    if (currentQuestion < QUIZ_LENGTH - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (studentName.trim()) {
      setNameSubmitted(true);
      const score = answers.filter((a) => a === true).length;
      if (onComplete) {
        onComplete(score, studentName);
      }
    }
  };

  const score = answers.filter((a) => a === true).length;
  const accuracy = Math.round((score / QUIZ_LENGTH) * 100);

  // Loading state
  if (problems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-2">Loading Quiz...</div>
        </div>
      </div>
    );
  }

  // Quiz completion screen
  if (quizComplete && !nameSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-[#fef9f3] via-[#fef3c7]/30 to-[#fef9f3] flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-slate-100">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "Fredoka" }}>
              Quiz Complete!
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Score Display */}
            <div className="text-center p-6 bg-gradient-to-br from-[#a855f7]/10 to-[#ec4899]/10 rounded-lg border border-[#a855f7]/20">
              <div className="text-5xl font-bold quotient-color mb-2">{score}/{QUIZ_LENGTH}</div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {accuracy}% Accuracy
              </div>
              <div className="text-sm text-muted-foreground">
                {accuracy >= 80
                  ? "Excellent work! 🌟"
                  : accuracy >= 60
                  ? "Good effort! Keep practicing! 💪"
                  : "Keep trying! You'll improve! 📚"}
              </div>
            </div>

            {/* Student Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Enter your name to save your score
              </label>
              <Input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Your name"
                className="text-lg border-2 border-slate-200 focus:border-[#0891b2]"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitQuiz}
              disabled={!studentName.trim()}
              className="w-full h-12 font-bold rounded-lg bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white disabled:opacity-50"
            >
              Save Score to Leaderboard
            </Button>

            {/* Back Button */}
            <Button
              onClick={onExit}
              variant="outline"
              className="w-full h-10"
            >
              Back to Practice
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Main quiz screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f3] via-[#fef3c7]/30 to-[#fef9f3] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "Fredoka" }}>
              Quiz Mode
            </h1>
            <Button
              onClick={onExit}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Exit
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Question {currentQuestion + 1} of {QUIZ_LENGTH}</span>
              <span>{score} correct so far</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0891b2] to-[#06b6d4]"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / QUIZ_LENGTH) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 mb-6"
          >
            {/* Visualization */}
            <div className="mb-8">
              <DivisionVisualizer
                problem={problems[currentQuestion]}
                showResult={false}
                questionKey={currentQuestion}
                mode="quiz"
              />
            </div>

            {/* Answer Input */}
            <AnswerInput
              problem={problems[currentQuestion]}
              onAnswerSubmit={handleAnswerSubmit}
              showFeedback={true}
              mode="quiz"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 justify-between"
        >
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Previous
          </Button>

          <div className="flex gap-2 flex-wrap justify-center">
            {Array.from({ length: QUIZ_LENGTH }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  i === currentQuestion
                    ? "bg-gradient-to-r from-[#0891b2] to-[#06b6d4] text-white scale-110"
                    : answers[i] === true
                    ? "bg-green-500 text-white"
                    : answers[i] === false
                    ? "bg-red-500 text-white"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
            className="gap-2 bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white disabled:opacity-50"
          >
            {currentQuestion === QUIZ_LENGTH - 1 ? "Finish" : "Next"}
            <ArrowRight size={16} />
          </Button>
        </motion.div>

        {/* Question Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          {answers[currentQuestion] === undefined
            ? "Answer this question to continue"
            : answers[currentQuestion]
            ? "✓ Correct!"
            : "✗ Incorrect - Review and try again"}
        </motion.div>
      </div>
    </div>
  );
}
