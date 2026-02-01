/**
 * Division Visualizer Game - Home Page
 * Design: Playful Educational with asymmetric layout
 * Features: Practice mode, Quiz mode, and Leaderboard (shared backend)
 */

import AnswerInput from "@/components/AnswerInput";
import DivisionVisualizer from "@/components/DivisionVisualizer";
import QuizMode from "@/components/QuizMode";
import { Button } from "@/components/ui/button";
import {
  DivisionProblem,
  generateDivisionProblem,
  Difficulty
} from "@/lib/divisionUtils";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, BookOpen, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

type PageMode = "practice" | "quiz" | "leaderboard";

export default function Home() {
  const [problem, setProblem] = useState<DivisionProblem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pageMode, setPageMode] = useState<PageMode>("practice");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

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

  if (!problem && pageMode === "practice") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl font-bold mb-4 text-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f3] via-[#fef3c7]/30 to-[#fef9f3]">
      <AnimatePresence mode="wait">
        {pageMode === "practice" && problem && (
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
              <h1 className="text-5xl md:text-6xl font-bold mb-3 text-foreground" style={{ fontFamily: "Fredoka" }}>
                Division Visualizer
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Learn how division works with real-life scenarios. Watch as numbers are grouped and distributed!
              </p>

              {/* Mode Buttons */}
              <div className="flex gap-3 justify-center flex-wrap mb-6">
                <Button
                  onClick={() => setPageMode("practice")}
                  className="gap-2 bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white font-bold"
                >
                  <BookOpen size={18} />
                  Practice Mode
                </Button>
                <Button
                  onClick={() => setPageMode("quiz")}
                  className="gap-2 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d97706] text-white font-bold"
                >
                  <Trophy size={18} />
                  Quiz Mode
                </Button>
                <Button
                  onClick={() => setPageMode("leaderboard")}
                  variant="outline"
                  className="gap-2 font-bold border-2 border-[#f97316] text-[#f97316] hover:bg-[#f97316]/10"
                >
                  <Trophy size={18} />
                  Leaderboard
                </Button>
              </div>

              {/* Difficulty Selector */}
              {pageMode === "practice" && (
                <div className="flex gap-2 justify-center flex-wrap">
                  <button
                    onClick={() => setDifficulty("easy")}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      difficulty === "easy"
                        ? "bg-green-500 text-white shadow-lg"
                        : "bg-white text-green-600 border-2 border-green-500 hover:bg-green-50"
                    }`}
                  >
                    Easy (2-digit by 1-digit)
                  </button>
                  <button
                    onClick={() => setDifficulty("medium")}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      difficulty === "medium"
                        ? "bg-blue-500 text-white shadow-lg"
                        : "bg-white text-blue-600 border-2 border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    Medium (3-digit by 1-digit)
                  </button>
                  <button
                    onClick={() => setDifficulty("hard")}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      difficulty === "hard"
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-white text-red-600 border-2 border-red-500 hover:bg-red-50"
                    }`}
                  >
                    Hard (2-digit & 3-digit by 2-digit)
                  </button>
                </div>
              )}
            </motion.div>

            {/* Main Content - Asymmetric Layout */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left: Visualization (60%) */}
                <motion.div
                  className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  key={`problem-${problem.dividend}-${problem.divisor}`}
                >
                  <DivisionVisualizer
                    problem={problem}
                    showResult={false}
                  />
                </motion.div>

                {/* Right: Answer Input (40%) */}
                <motion.div
                  className="lg:col-span-1 space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {/* Scenario Card */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-100 hover:shadow-xl transition-shadow">
                    <div className="text-5xl mb-4 text-center">{problem.scenario.emoji}</div>
                    <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "Fredoka" }}>
                      {problem.scenario.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {problem.dividend} {problem.scenario.description} by {problem.divisor}
                    </p>
                    <div className="bg-gradient-to-br from-[#a855f7]/10 to-[#ec4899]/10 rounded-lg p-4 border border-[#a855f7]/20">
                      <p className="text-sm font-medium text-foreground">
                        {problem.scenario.context} <span className="font-bold quotient-color">?</span> each
                        {problem.remainder > 0 && (
                          <span>, with <span className="font-bold text-orange-500">?</span> left over</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Answer Input Card */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-100">
                    <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "Fredoka" }}>
                      Your Answer
                    </h3>
                  <AnswerInput
                    problem={problem}
                    showFeedback={true}
                    mode="practice"
                    onNewProblem={handleRefresh}
                  />
                  </div>

                  {/* Refresh Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white shadow-lg"
                    >
                      <motion.div
                        animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 0.6, repeat: isRefreshing ? Infinity : 0 }}
                        className="mr-2"
                      >
                        <RefreshCw size={20} />
                      </motion.div>
                      {isRefreshing ? "Generating..." : "New Problem"}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Footer Info */}
            <motion.div
              className="max-w-7xl mx-auto mt-16 text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p>
                Practice mode: Input your answers and get instant feedback. Ready to test your skills? Try <span className="font-semibold">Quiz Mode</span>!
              </p>
            </motion.div>
          </motion.div>
        )}

        {pageMode === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizMode
              onComplete={handleQuizComplete}
              onExit={() => setPageMode("practice")}
              difficulty={difficulty}
            />
          </motion.div>
        )}

        {pageMode === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 px-4"
          >
            <div className="max-w-2xl mx-auto">
              <SharedLeaderboard
                entries={leaderboardData || []}
                onClose={() => setPageMode("practice")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Shared Leaderboard Component
 * Displays scores from all students in the backend database
 */
function SharedLeaderboard({ entries, onClose }: { entries: any[]; onClose: () => void }) {
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "📊";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="py-12 px-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "Fredoka" }}>
            🏆 Leaderboard
          </h2>
          <p className="text-muted-foreground">Top performers in Division Visualizer</p>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No scores yet. Be the first to take the quiz!</p>
            <Button onClick={onClose} className="bg-gradient-to-r from-[#0891b2] to-[#06b6d4] text-white">
              Back to Practice
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{getMedalIcon(index + 1)}</span>
                  <div>
                    <p className="font-bold text-foreground">{entry.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.score}/{entry.totalQuestions} correct
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#0891b2]">
                    {Math.round((entry.score / entry.totalQuestions) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">accuracy</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-[#0891b2] to-[#06b6d4] text-white hover:from-[#0284c7] hover:to-[#0891b2]"
          >
            Back to Practice
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
