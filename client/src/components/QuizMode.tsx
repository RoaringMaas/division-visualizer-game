/**
 * Quiz Mode Component
 * 10-question quiz with randomized problems and score tracking
 */

import AnswerInput from "@/components/AnswerInput";
import QuizResultsSummary from "@/components/QuizResultsSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DivisionProblem, generateDivisionProblem, Difficulty } from "@/lib/divisionUtils";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface QuizModeProps {
  onComplete?: (score: number, studentName: string) => void;
  onExit?: () => void;
  difficulty?: Difficulty;
}

export default function QuizMode({ onComplete, onExit, difficulty: initialDifficulty = 'easy' }: QuizModeProps) {
  const QUIZ_LENGTH = 10;
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [quizStarted, setQuizStarted] = useState(false);
  const [problems, setProblems] = useState<DivisionProblem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showResultsSummary, setShowResultsSummary] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);

  // Generate quiz problems when quiz starts
  useEffect(() => {
    if (quizStarted) {
      const generatedProblems = Array.from({ length: QUIZ_LENGTH }, () =>
        generateDivisionProblem(difficulty)
      );
      setProblems(generatedProblems);
    }
  }, [quizStarted, difficulty]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

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

  const handleViewResults = () => {
    setShowResultsSummary(true);
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

  // Difficulty selection screen
  if (!quizStarted) {
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
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "Fredoka" }}>
              Select Difficulty
            </h2>
            <p className="text-muted-foreground">
              Choose a difficulty level for your 10-question quiz
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Easy Button */}
            <button
              onClick={() => {
                setDifficulty('easy');
                handleStartQuiz();
              }}
              className="w-full p-4 rounded-lg font-bold text-lg transition-all bg-green-500 text-white hover:bg-green-600 hover:shadow-lg"
            >
              Easy (2-digit by 1-digit)
            </button>

            {/* Medium Button */}
            <button
              onClick={() => {
                setDifficulty('medium');
                handleStartQuiz();
              }}
              className="w-full p-4 rounded-lg font-bold text-lg transition-all bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg"
            >
              Medium (3-digit by 1-digit)
            </button>

            {/* Hard Button */}
            <button
              onClick={() => {
                setDifficulty('hard');
                handleStartQuiz();
              }}
              className="w-full p-4 rounded-lg font-bold text-lg transition-all bg-red-500 text-white hover:bg-red-600 hover:shadow-lg"
            >
              Hard (2-digit & 3-digit by 2-digit)
            </button>

            {/* Back Button */}
            <Button
              onClick={onExit}
              variant="outline"
              className="w-full h-12"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Menu
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

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

  // Results Summary Screen
  if (quizComplete && showResultsSummary && !nameSubmitted) {
    return (
      <QuizResultsSummary
        score={score}
        totalQuestions={QUIZ_LENGTH}
        answers={answers}
        onViewLeaderboard={() => setShowResultsSummary(false)}
        onExit={onExit || (() => {})}
      />
    );
  }

  // Quiz completion screen (name input before leaderboard)
  if (quizComplete && !showResultsSummary && !nameSubmitted) {
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
            {/* View Results Button */}
            <Button
              onClick={handleViewResults}
              className="w-full h-12 font-bold rounded-lg bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white"
            >
              View Results Summary
            </Button>

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
      <div className="max-w-2xl mx-auto">
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
            {/* Question Display */}
            <div className="mb-8 text-center">
              <h2 className="text-6xl font-bold text-foreground mb-4" style={{ fontFamily: "Fredoka" }}>
                {problems[currentQuestion].dividend} ÷ {problems[currentQuestion].divisor}
              </h2>
              <p className="text-lg text-muted-foreground">
                {problems[currentQuestion].scenario.emoji} {problems[currentQuestion].scenario.title}
              </p>
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
                disabled={i < currentQuestion}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  i === currentQuestion
                    ? "bg-gradient-to-r from-[#0891b2] to-[#06b6d4] text-white scale-110"
                    : answers[i] === true
                    ? "bg-green-500 text-white"
                    : answers[i] === false
                    ? "bg-red-500 text-white"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                } ${i < currentQuestion ? "opacity-50 cursor-not-allowed" : ""}`}
                whileHover={i < currentQuestion ? {} : { scale: 1.1 }}
                whileTap={i < currentQuestion ? {} : { scale: 0.95 }}
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
