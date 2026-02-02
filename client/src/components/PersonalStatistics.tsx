/**
 * Personal Statistics Dashboard Component
 * Displays student progress, accuracy by difficulty, and trends
 */

import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Target, Award } from "lucide-react";
import { useEffect, useState } from "react";

interface StatisticData {
  difficulty: "easy" | "medium" | "hard";
  totalAttempts: number;
  totalCorrect: number;
  averageAccuracy: number;
}

interface PersonalStatisticsProps {
  studentName: string;
  onClose?: () => void;
}

export default function PersonalStatistics({ studentName, onClose }: PersonalStatisticsProps) {
  const [statistics, setStatistics] = useState<StatisticData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch statistics from backend
  const { data: statsData } = trpc.statistics.getByName.useQuery({ name: studentName });

  useEffect(() => {
    if (statsData) {
      setStatistics(statsData as StatisticData[]);
      setIsLoading(false);
    }
  }, [statsData]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "from-green-500 to-emerald-600";
      case "medium":
        return "from-blue-500 to-cyan-600";
      case "hard":
        return "from-red-500 to-orange-600";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Easy (2-digit ÷ 1-digit)";
      case "medium":
        return "Medium (3-digit ÷ 1-digit)";
      case "hard":
        return "Hard (2-3 digit ÷ 2-digit)";
      default:
        return difficulty;
    }
  };

  const totalProblems = statistics.reduce((sum, s) => sum + s.totalAttempts, 0);
  const totalCorrect = statistics.reduce((sum, s) => sum + s.totalCorrect, 0);
  const overallAccuracy = totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-2">Loading statistics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <BarChart3 size={32} className="text-[#0891b2]" />
        <div>
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "Fredoka" }}>
            My Statistics
          </h2>
          <p className="text-sm text-muted-foreground">{studentName}</p>
        </div>
      </motion.div>

      {/* Overall Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* Total Problems */}
        <motion.div
          variants={itemVariants}
          className="p-6 bg-gradient-to-br from-[#0891b2]/10 to-[#06b6d4]/10 rounded-lg border border-[#0891b2]/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Problems</span>
            <Target size={20} className="text-[#0891b2]" />
          </div>
          <div className="text-3xl font-bold text-foreground">{totalProblems}</div>
          <p className="text-xs text-muted-foreground mt-1">Across all difficulties</p>
        </motion.div>

        {/* Total Correct */}
        <motion.div
          variants={itemVariants}
          className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-lg border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Correct Answers</span>
            <Award size={20} className="text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">{totalCorrect}</div>
          <p className="text-xs text-muted-foreground mt-1">Problems solved correctly</p>
        </motion.div>

        {/* Overall Accuracy */}
        <motion.div
          variants={itemVariants}
          className="p-6 bg-gradient-to-br from-[#f97316]/10 to-[#ea580c]/10 rounded-lg border border-[#f97316]/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Overall Accuracy</span>
            <TrendingUp size={20} className="text-[#f97316]" />
          </div>
          <div className="text-3xl font-bold quotient-color">{overallAccuracy}%</div>
          <p className="text-xs text-muted-foreground mt-1">Average across all attempts</p>
        </motion.div>
      </motion.div>

      {/* Difficulty Breakdown */}
      {statistics.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <h3 className="text-lg font-bold text-foreground">Performance by Difficulty</h3>
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.difficulty}
              variants={itemVariants}
              className={`p-6 rounded-lg border-2 bg-gradient-to-r ${getDifficultyColor(
                stat.difficulty
              )} bg-opacity-5 border-opacity-30`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-foreground text-lg">
                    {getDifficultyLabel(stat.difficulty)}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {stat.totalCorrect} / {stat.totalAttempts} correct
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold quotient-color">{stat.averageAccuracy}%</div>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getDifficultyColor(stat.difficulty)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.averageAccuracy}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                <div>
                  <div className="text-lg font-bold text-foreground">{stat.totalAttempts}</div>
                  <div className="text-xs text-muted-foreground">Attempts</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{stat.totalCorrect}</div>
                  <div className="text-xs text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {stat.totalAttempts - stat.totalCorrect}
                  </div>
                  <div className="text-xs text-muted-foreground">Incorrect</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200"
        >
          <div className="text-5xl mb-4">📊</div>
          <p className="text-lg text-muted-foreground">
            No statistics yet. Complete some quizzes to see your progress!
          </p>
        </motion.div>
      )}

      {/* Close Button */}
      {onClose && (
        <Button
          onClick={onClose}
          className="w-full h-10 bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white font-bold rounded-lg"
        >
          Close Statistics
        </Button>
      )}
    </div>
  );
}
