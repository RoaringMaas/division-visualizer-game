/**
 * Badge Definitions and Achievement System
 * Defines all available badges and logic to check if they should be awarded
 */

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const BADGES: Record<string, Badge> = {
  FIRST_PROBLEM: {
    id: "first_problem",
    title: "First Step",
    description: "Solve your first division problem",
    icon: "🎯",
    color: "from-blue-500 to-cyan-600",
  },
  TEN_PROBLEMS: {
    id: "ten_problems",
    title: "Getting Started",
    description: "Solve 10 division problems",
    icon: "📚",
    color: "from-green-500 to-emerald-600",
  },
  FIFTY_PROBLEMS: {
    id: "fifty_problems",
    title: "Problem Solver",
    description: "Solve 50 division problems",
    icon: "🚀",
    color: "from-purple-500 to-pink-600",
  },
  HUNDRED_PROBLEMS: {
    id: "hundred_problems",
    title: "Century Champion",
    description: "Solve 100 division problems",
    icon: "💯",
    color: "from-yellow-500 to-orange-600",
  },
  PERFECT_QUIZ: {
    id: "perfect_quiz",
    title: "Perfect Score",
    description: "Score 100% on a quiz (10/10)",
    icon: "⭐",
    color: "from-yellow-400 to-yellow-600",
  },
  NINETY_PERCENT: {
    id: "ninety_percent",
    title: "Accuracy Master",
    description: "Achieve 90%+ accuracy on a quiz",
    icon: "🎖️",
    color: "from-red-500 to-pink-600",
  },
  EASY_MASTER: {
    id: "easy_master",
    title: "Easy Master",
    description: "Achieve 90%+ accuracy on Easy difficulty",
    icon: "🟢",
    color: "from-green-500 to-emerald-600",
  },
  MEDIUM_MASTER: {
    id: "medium_master",
    title: "Medium Master",
    description: "Achieve 90%+ accuracy on Medium difficulty",
    icon: "🔵",
    color: "from-blue-500 to-cyan-600",
  },
  HARD_MASTER: {
    id: "hard_master",
    title: "Hard Master",
    description: "Achieve 90%+ accuracy on Hard difficulty",
    icon: "🔴",
    color: "from-red-500 to-orange-600",
  },
  ALL_DIFFICULTIES: {
    id: "all_difficulties",
    title: "Master of All",
    description: "Achieve 90%+ accuracy on all difficulty levels",
    icon: "👑",
    color: "from-purple-500 to-pink-600",
  },
};

export type BadgeId = keyof typeof BADGES;

/**
 * Check which badges should be awarded based on student statistics
 */
export function checkAchievements(
  totalProblems: number,
  stats: Array<{
    difficulty: "easy" | "medium" | "hard";
    totalAttempts: number;
    totalCorrect: number;
    averageAccuracy: number;
  }>
): string[] {
  const unlockedBadges: string[] = [];

  // Problem count badges
  if (totalProblems >= 1) unlockedBadges.push("FIRST_PROBLEM");
  if (totalProblems >= 10) unlockedBadges.push("TEN_PROBLEMS");
  if (totalProblems >= 50) unlockedBadges.push("FIFTY_PROBLEMS");
  if (totalProblems >= 100) unlockedBadges.push("HUNDRED_PROBLEMS");

  // Difficulty-specific accuracy badges
  const easyStats = stats.find((s) => s.difficulty === "easy");
  const mediumStats = stats.find((s) => s.difficulty === "medium");
  const hardStats = stats.find((s) => s.difficulty === "hard");

  if (easyStats && easyStats.averageAccuracy >= 90) {
    unlockedBadges.push("EASY_MASTER");
  }
  if (mediumStats && mediumStats.averageAccuracy >= 90) {
    unlockedBadges.push("MEDIUM_MASTER");
  }
  if (hardStats && hardStats.averageAccuracy >= 90) {
    unlockedBadges.push("HARD_MASTER");
  }

  // All difficulties mastered
  if (
    easyStats &&
    mediumStats &&
    hardStats &&
    easyStats.averageAccuracy >= 90 &&
    mediumStats.averageAccuracy >= 90 &&
    hardStats.averageAccuracy >= 90
  ) {
    unlockedBadges.push("ALL_DIFFICULTIES");
  }

  return unlockedBadges;
}

/**
 * Check if a perfect quiz badge should be awarded
 */
export function checkPerfectQuizBadge(score: number, totalQuestions: number): boolean {
  return score === totalQuestions;
}

/**
 * Check if accuracy badge should be awarded for a quiz
 */
export function checkAccuracyBadge(score: number, totalQuestions: number): boolean {
  const accuracy = (score / totalQuestions) * 100;
  return accuracy >= 90;
}
