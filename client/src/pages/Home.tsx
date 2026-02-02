/**
 * Division Visualizer Game - Home Page
 * Design: Playful Educational with three main entry points
 * Features: Practice mode, Quiz mode, and Leaderboard navigation
 */

import AnswerInput from "@/components/AnswerInput";
import DivisionVisualizer from "@/components/DivisionVisualizer";
import QuizMode from "@/components/QuizMode";
import Leaderboard, { useLeaderboard } from "@/components/Leaderboard";
import { Button } from "@/components/ui/button";
import {
  DivisionProblem,
  generateDivisionProblem,
  Difficulty
} from "@/lib/divisionUtils";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, BookOpen, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

type PageMode = "landing" | "practice" | "quiz" | "leaderboard";

export default function Home() {
  const [problem, setProblem] = useState<DivisionProblem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pageMode, setPageMode] = useState<PageMode>("landing");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const { addEntry } = useLeaderboard();

  // Fetch leaderboard from backend
  const { data: leaderboardData, refetch: refetchLeaderboard } = trpc.leaderboard.getAll.useQuery();
  const addScoreMutation = trpc.leaderboard.addScore.useMutation({
    onSuccess: () => {
      refetchLeaderboard();
      setPageMode("leaderboard");
    }
  });

  // Initialize with first problem
  useEffect(() => {
    setProblem(generateDivisionProblem(difficulty));
  }, [difficulty]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setProblem(generateDivisionProblem(difficulty));
      setIsRefreshing(false);
    }, 300);
  };

  const handleQuizComplete = (score: number, studentName: string) => {
    addScoreMutation.mutate({ name: studentName, score, totalQuestions: 10 });
  };

  const handleBackToHome = () => {
    setPageMode("landing");
  };

  // Landing Page - Three Main Entry Points
  if (pageMode === "landing") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-[#fef9f3] via-[#fef3c7]/30 to-[#fef9f3] flex flex-col items-center justify-center p-4"
      >
        <div className="max-w-4xl w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-4 text-foreground" style={{ fontFamily: "Fredoka" }}>
              Division Visualizer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn how division works with real-life scenarios. Watch as numbers are grouped and distributed!
            </p>
          </motion.div>

          {/* Three Main Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Practice Mode Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => setPageMode("practice")}
                className="w-full h-full p-8 rounded-2xl bg-gradient-to-br from-[#0891b2] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white shadow-xl transition-all border-2 border-transparent hover:border-white"
              >
                <div className="flex flex-col items-center gap-4">
                  <BookOpen size={48} />
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Fredoka" }}>
                      Practice Mode
                    </h2>
                    <p className="text-sm opacity-90">
                      Learn with visual blocks and instant feedback
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>

            {/* Quiz Mode Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => setPageMode("quiz")}
                className="w-full h-full p-8 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d97706] text-white shadow-xl transition-all border-2 border-transparent hover:border-white"
              >
                <div className="flex flex-col items-center gap-4">
                  <Zap size={48} />
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Fredoka" }}>
                      Quiz Mode
                    </h2>
                    <p className="text-sm opacity-90">
                      Test your skills with 10 questions
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>

            {/* Leaderboard Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => setPageMode("leaderboard")}
                className="w-full h-full p-8 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#aa8c2c] hover:from-[#aa8c2c] hover:to-[#8b6f1f] text-white shadow-xl transition-all border-2 border-transparent hover:border-white"
              >
                <div className="flex flex-col items-center gap-4">
                  <Trophy size={48} />
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Fredoka" }}>
                      Leaderboard
                    </h2>
                    <p className="text-sm opacity-90">
                      See top scores and rankings
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          </div>

          {/* Decorative text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-muted-foreground"
          >
            <p>Choose a mode to get started!</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Practice Mode
  if (pageMode === "practice" && problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef9f3] via-[#fef3c7]/30 to-[#fef9f3]">
        <AnimatePresence mode="wait">
          <motion.div
            key="practice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-8 px-4"
          >
            {/* Header */}
            <motion.div
              className="max-w-7xl mx-auto mb-12 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-5xl md:text-6xl font-bold text-foreground flex-1" style={{ fontFamily: "Fredoka" }}>
                  Practice Mode
                </h1>
                <Button
                  onClick={handleBackToHome}
                  variant="outline"
                  className="gap-2"
                >
                  Back to Home
                </Button>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Learn how division works with real-life scenarios. Watch as numbers are grouped and distributed!
              </p>

              {/* Difficulty Selection */}
              <div className="flex gap-3 justify-center flex-wrap mb-6">
                <Button
                  onClick={() => setDifficulty("easy")}
                  className={`gap-2 font-bold ${
                    difficulty === "easy"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                >
                  Easy (2-digit by 1-digit)
                </Button>
                <Button
                  onClick={() => setDifficulty("medium")}
                  className={`gap-2 font-bold ${
                    difficulty === "medium"
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                >
                  Medium (3-digit by 1-digit)
                </Button>
                <Button
                  onClick={() => setDifficulty("hard")}
                  className={`gap-2 font-bold ${
                    difficulty === "hard"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                >
                  Hard (2-digit & 3-digit by 2-digit)
                </Button>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Visualizer */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-2"
                >
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <DivisionVisualizer problem={problem} />
                  </div>
                </motion.div>

                {/* Right Column - Scenario & Input */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Scenario Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
                    <h3 className="text-lg font-bold text-foreground mb-3">Real-Life Scenario</h3>
                    <div className="text-4xl mb-3">{problem.scenario.emoji}</div>
                    <p className="text-foreground font-semibold mb-2">{problem.scenario.title}</p>
                    <p className="text-sm text-muted-foreground">{problem.scenario.description}</p>
                  </div>

                  {/* Answer Input */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
                    <h3 className="text-lg font-bold text-foreground mb-4">Your Answer</h3>
                    <AnswerInput
                      problem={problem}
                      showFeedback={true}
                      mode="practice"
                      onNewProblem={handleRefresh}
                    />
                  </div>

                  {/* Refresh Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="w-full p-3 rounded-lg bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                    New Problem
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Quiz Mode
  if (pageMode === "quiz") {
    return (
      <QuizMode
        onComplete={handleQuizComplete}
        onExit={handleBackToHome}
      />
    );
  }

  // Leaderboard Mode
  if (pageMode === "leaderboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef9f3] via-[#fef3c7]/30 to-[#fef9f3] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground" style={{ fontFamily: "Fredoka" }}>
              Leaderboard
            </h1>
            <Button
              onClick={handleBackToHome}
              variant="outline"
              className="gap-2"
            >
              Back to Home
            </Button>
          </motion.div>
          <Leaderboard onClose={handleBackToHome} />
        </div>
      </div>
    );
  }

  // Fallback loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-4xl font-bold mb-4 text-foreground">Loading...</div>
      </div>
    </div>
  );
}
