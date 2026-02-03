/**
 * Achievement Badges Component
 * Displays earned badges and newly unlocked achievements
 */

import { motion, AnimatePresence } from "framer-motion";
import { BADGES } from "@shared/badges";
import { X } from "lucide-react";

interface AchievementBadgesProps {
  achievements: Array<{
    badgeId: string;
    badgeTitle: string;
    badgeDescription: string;
  }>;
  newBadges?: string[];
  onClose?: () => void;
}

export default function AchievementBadges({
  achievements,
  newBadges = [],
  onClose,
}: AchievementBadgesProps) {
  if (achievements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* New Badges Celebration */}
      <AnimatePresence>
        {newBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl border-2 border-yellow-500 shadow-lg"
          >
            <div className="text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">New Badges Unlocked!</h3>
              <p className="text-white/90">You earned {newBadges.length} new achievement badge{newBadges.length !== 1 ? "s" : ""}!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badges Grid */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Your Achievements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => {
            const badgeKey = Object.keys(BADGES).find(
              (key) => BADGES[key as keyof typeof BADGES].id === achievement.badgeId
            );
            const badge = badgeKey ? BADGES[badgeKey as keyof typeof BADGES] : null;

            if (!badge) return null;

            const isNew = newBadges.includes(achievement.badgeId);

            return (
              <motion.div
                key={achievement.badgeId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-4 rounded-xl border-2 text-center transition-all ${
                  isNew
                    ? `bg-gradient-to-br ${badge.color} border-yellow-400 shadow-lg scale-105`
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* New Badge Indicator */}
                {isNew && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                  >
                    ✨
                  </motion.div>
                )}

                {/* Badge Icon */}
                <div className={`text-4xl mb-2 ${isNew ? "" : "opacity-70"}`}>
                  {badge.icon}
                </div>

                {/* Badge Title */}
                <h4 className={`font-bold text-sm mb-1 ${isNew ? "text-white" : "text-foreground"}`}>
                  {badge.title}
                </h4>

                {/* Badge Description */}
                <p className={`text-xs ${isNew ? "text-white/90" : "text-muted-foreground"}`}>
                  {badge.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
          className="w-full p-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-foreground font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <X size={18} />
          Close
        </motion.button>
      )}
    </div>
  );
}
