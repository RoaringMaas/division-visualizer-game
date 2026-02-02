/**
 * Leaderboard Component
 * Displays student rankings by accuracy from backend database
 */

import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  totalQuestions: number;
  accuracy?: number;
  createdAt: Date;
}

interface LeaderboardProps {
  onClose?: () => void;
}

const QUIZ_LENGTH = 10;

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch leaderboard from backend
  const { data: leaderboardData } = trpc.leaderboard.getAll.useQuery();

  // Update entries when data changes
  useEffect(() => {
    if (leaderboardData) {
      const sortedEntries = leaderboardData
        .map((entry) => ({
          ...entry,
          accuracy: Math.round((entry.score / entry.totalQuestions) * 100)
        }))
        .sort((a, b) => {
          // Sort by accuracy descending, then by date descending
          if ((b.accuracy || 0) !== (a.accuracy || 0)) {
            return (b.accuracy || 0) - (a.accuracy || 0);
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      setEntries(sortedEntries);
      setIsLoading(false);
    }
  }, [leaderboardData]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-2">Loading leaderboard...</div>
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
        <Trophy size={32} className="text-[#d4af37]" />
        <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "Fredoka" }}>
          Leaderboard
        </h2>
      </motion.div>

      {/* Empty State */}
      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200"
        >
          <div className="text-5xl mb-4">📊</div>
          <p className="text-lg text-muted-foreground">
            No scores yet. Complete a quiz to appear on the leaderboard!
          </p>
        </motion.div>
      ) : (
        <>
          {/* Leaderboard Entries */}
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
                      {new Date(entry.createdAt).toLocaleDateString()}
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

          {/* Stats Summary */}
          {entries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-br from-[#0891b2]/10 to-[#a855f7]/10 rounded-lg border border-slate-200"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{entries.length}</div>
                <div className="text-sm text-muted-foreground">Total Scores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold quotient-color">
                  {Math.round(
                    entries.reduce((sum, e) => sum + (e.accuracy || 0), 0) / entries.length
                  )}
                  %
                </div>
                <div className="text-sm text-muted-foreground">Avg Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.max(...entries.map((e) => e.accuracy || 0))}%
                </div>
                <div className="text-sm text-muted-foreground">Best Score</div>
              </div>
            </motion.div>
          )}
        </>
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
 * Hook to add entry to leaderboard (kept for backward compatibility)
 * Now uses backend tRPC mutation instead of localStorage
 */
export function useLeaderboard() {
  const addScoreMutation = trpc.leaderboard.addScore.useMutation();

  const addEntry = (name: string, score: number) => {
    addScoreMutation.mutate({ name, score, totalQuestions: QUIZ_LENGTH });
  };

  return { addEntry };
}
