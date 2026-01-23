/**
 * Leaderboard Component
 * Displays student rankings by accuracy
 */

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Medal, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timestamp: number;
}

interface LeaderboardProps {
  onClose?: () => void;
}

const STORAGE_KEY = "division_leaderboard";
const QUIZ_LENGTH = 10;

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  // Load leaderboard from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Sort by accuracy (descending), then by timestamp (newest first)
        const sorted = parsed.sort((a: LeaderboardEntry, b: LeaderboardEntry) => {
          if (b.accuracy !== a.accuracy) {
            return b.accuracy - a.accuracy;
          }
          return b.timestamp - a.timestamp;
        });
        setEntries(sorted);
      } catch (error) {
        console.error("Error loading leaderboard:", error);
      }
    }
  }, []);

  const handleAddEntry = (name: string, score: number) => {
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name,
      score,
      totalQuestions: QUIZ_LENGTH,
      accuracy: Math.round((score / QUIZ_LENGTH) * 100),
      timestamp: Date.now()
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleClearLeaderboard = () => {
    if (confirm("Are you sure you want to clear the entire leaderboard? This cannot be undone.")) {
      setEntries([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Medal size={32} className="text-[#f97316]" />
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "Fredoka" }}>
            Leaderboard
          </h2>
        </div>
        {entries.length > 0 && (
          <Button
            onClick={handleClearLeaderboard}
            variant="outline"
            size="sm"
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} />
            Clear
          </Button>
        )}
      </motion.div>

      {/* Leaderboard Table */}
      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200"
        >
          <div className="text-4xl mb-2">📊</div>
          <p className="text-lg text-muted-foreground">
            No scores yet. Complete a quiz to appear on the leaderboard!
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              variants={itemVariants}
              className={`p-4 rounded-lg border-2 flex items-center justify-between ${
                index < 3
                  ? "bg-gradient-to-r from-[#f97316]/5 to-[#a855f7]/5 border-[#f97316]/30"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Rank */}
                <div className="w-12 text-center">
                  {getMedalIcon(index) ? (
                    <span className="text-2xl">{getMedalIcon(index)}</span>
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground">#{index + 1}</span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <p className="font-bold text-foreground text-lg">{entry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Score and Accuracy */}
              <div className="text-right">
                <div className="text-2xl font-bold quotient-color">
                  {entry.accuracy}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {entry.score}/{entry.totalQuestions}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Stats Summary */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-br from-[#0891b2]/10 to-[#a855f7]/10 rounded-lg border border-slate-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold dividend-color">{entries.length}</div>
            <div className="text-xs text-muted-foreground">Total Attempts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold quotient-color">
              {Math.round(
                entries.reduce((sum, e) => sum + e.accuracy, 0) / entries.length
              )}%
            </div>
            <div className="text-xs text-muted-foreground">Average Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold divisor-color">
              {Math.max(...entries.map((e) => e.accuracy))}%
            </div>
            <div className="text-xs text-muted-foreground">Best Score</div>
          </div>
        </motion.div>
      )}

      {/* Close Button */}
      {onClose && (
        <Button
          onClick={onClose}
          className="w-full h-10 bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white font-bold rounded-lg"
        >
          Close Leaderboard
        </Button>
      )}
    </div>
  );
}

/**
 * Hook to add entry to leaderboard
 */
export function useLeaderboard() {
  const addEntry = (name: string, score: number) => {
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name,
      score,
      totalQuestions: QUIZ_LENGTH,
      accuracy: Math.round((score / QUIZ_LENGTH) * 100),
      timestamp: Date.now()
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    const entries = stored ? JSON.parse(stored) : [];
    const updated = [newEntry, ...entries];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return newEntry;
  };

  return { addEntry };
}
