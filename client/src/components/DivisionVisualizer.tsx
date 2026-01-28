/**
 * Division Visualizer Component
 * Displays division as equal groups with separate remainder
 * Design: Playful Educational - Shows quotient items per group, remainder separate
 */

import { DivisionProblem } from "@/lib/divisionUtils";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface DivisionVisualizerProps {
  problem: DivisionProblem;
  showResult?: boolean;
  questionKey?: string | number;
  mode?: "practice" | "quiz";
}

// Stable animation variants - defined outside component to prevent recreation
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05
    }
  }
};

const GROUP_VARIANTS = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2
    }
  }
};

const BLOCK_VARIANTS = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.15
    }
  }
};

const REMAINDER_VARIANTS = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.1,
      duration: 0.2
    }
  }
};

const RESULT_VARIANTS = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.2,
      duration: 0.3
    }
  }
};

export default function DivisionVisualizer({
  problem,
  showResult = true,
  questionKey,
  mode = "practice"
}: DivisionVisualizerProps) {
  const { dividend, divisor, quotient, remainder, scenario } = problem;

  // Memoize groups to prevent unnecessary recalculations
  const groups = useMemo(() => {
    return Array.from({ length: divisor }, (_, i) => 
      Array.from({ length: quotient }, (_, j) => i * quotient + j + 1)
    );
  }, [divisor, quotient]);

  // In quiz mode, disable animations for better performance
  const shouldAnimate = mode === "practice";

  // Calculate grid columns based on divisor
  const gridCols = Math.min(divisor, 4);

  // Create unique key for this question to force remount
  const visualizationKey = questionKey ? `viz-${questionKey}` : `viz-${dividend}-${divisor}`;

  // Render groups
  const renderGroups = () => {
    if (shouldAnimate) {
      return (
        <motion.div
          className="grid gap-4 justify-center"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, minmax(120px, 1fr))`,
            maxWidth: "100%"
          }}
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          {groups.map((group, groupIndex) => (
            <motion.div
              key={`group-${groupIndex}`}
              className="flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-md"
              variants={GROUP_VARIANTS}
            >
              <div className="text-center text-xs font-semibold text-muted-foreground">
                Group {groupIndex + 1}
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {group.map((itemIndex) => (
                  <motion.div
                    key={`item-${itemIndex}`}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0891b2] to-[#0284c7] shadow-md flex items-center justify-center text-white text-xs font-bold"
                    variants={BLOCK_VARIANTS}
                  >
                    {itemIndex}
                  </motion.div>
                ))}
              </div>

              <div className="text-center text-sm font-bold text-[#0891b2]">
                {quotient} {scenario.emoji}
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    } else {
      // Quiz mode: no animations, just render
      return (
        <div
          className="grid gap-4 justify-center"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, minmax(120px, 1fr))`,
            maxWidth: "100%"
          }}
        >
          {groups.map((group, groupIndex) => (
            <div
              key={`group-${groupIndex}`}
              className="flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-md"
            >
              <div className="text-center text-xs font-semibold text-muted-foreground">
                Group {groupIndex + 1}
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {group.map((itemIndex) => (
                  <div
                    key={`item-${itemIndex}`}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0891b2] to-[#0284c7] shadow-md flex items-center justify-center text-white text-xs font-bold"
                  >
                    {itemIndex}
                  </div>
                ))}
              </div>

              <div className="text-center text-sm font-bold text-[#0891b2]">
                {quotient} {scenario.emoji}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  // Render remainder
  const renderRemainder = () => {
    if (remainder === 0) return null;

    if (shouldAnimate) {
      return (
        <motion.div
          className="flex justify-center"
          variants={REMAINDER_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 shadow-md">
            <div className="text-center text-xs font-semibold text-muted-foreground">
              Remainder
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: remainder }, (_, i) => (
                <motion.div
                  key={`remainder-${i}`}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-md flex items-center justify-center text-white text-xs font-bold"
                  variants={BLOCK_VARIANTS}
                >
                  {dividend - remainder + i + 1}
                </motion.div>
              ))}
            </div>

            <div className="text-center text-sm font-bold text-orange-600">
              {remainder} {scenario.emoji} left over
            </div>
          </div>
        </motion.div>
      );
    } else {
      // Quiz mode: no animations
      return (
        <div className="flex justify-center">
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 shadow-md">
            <div className="text-center text-xs font-semibold text-muted-foreground">
              Remainder
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: remainder }, (_, i) => (
                <div
                  key={`remainder-${i}`}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-md flex items-center justify-center text-white text-xs font-bold"
                >
                  {dividend - remainder + i + 1}
                </div>
              ))}
            </div>

            <div className="text-center text-sm font-bold text-orange-600">
              {remainder} {scenario.emoji} left over
            </div>
          </div>
        </div>
      );
    }
  };

  // Render result
  const renderResult = () => {
    if (!showResult) return null;

    if (shouldAnimate) {
      return (
        <motion.div
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#a855f7]/10 to-[#ec4899]/10 border-2 border-[#a855f7]/30 shadow-lg"
          variants={RESULT_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center space-y-3">
            <div className="text-sm font-medium text-muted-foreground">Result</div>
            <div className="text-4xl font-bold">
              <span className="quotient-color">{quotient}</span>
              {remainder > 0 && (
                <span className="text-lg ml-2 text-muted-foreground">
                  R{remainder}
                </span>
              )}
            </div>
            <div className="text-sm text-foreground">
              {scenario.context} <span className="font-bold quotient-color">{quotient}</span> each
              {remainder > 0 && (
                <span>, with <span className="font-bold text-orange-500">{remainder}</span> left over</span>
              )}
            </div>
          </div>
        </motion.div>
      );
    } else {
      // Quiz mode: no animations
      return (
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#a855f7]/10 to-[#ec4899]/10 border-2 border-[#a855f7]/30 shadow-lg">
          <div className="text-center space-y-3">
            <div className="text-sm font-medium text-muted-foreground">Result</div>
            <div className="text-4xl font-bold">
              <span className="quotient-color">{quotient}</span>
              {remainder > 0 && (
                <span className="text-lg ml-2 text-muted-foreground">
                  R{remainder}
                </span>
              )}
            </div>
            <div className="text-sm text-foreground">
              {scenario.context} <span className="font-bold quotient-color">{quotient}</span> each
              {remainder > 0 && (
                <span>, with <span className="font-bold text-orange-500">{remainder}</span> left over</span>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full space-y-8" key={visualizationKey}>
      {/* Problem Statement */}
      <div className="text-center space-y-2">
        <div className="text-sm font-medium text-muted-foreground">
          {scenario.emoji} {scenario.title}
        </div>
        <div className="text-2xl font-bold text-foreground">
          <span className="dividend-color">{dividend}</span>
          <span className="mx-3 text-muted-foreground">÷</span>
          <span className="divisor-color">{divisor}</span>
        </div>
      </div>

      {/* Division Visualization - Groups with Equal Items */}
      <div className="space-y-6">
        {renderGroups()}
        {renderRemainder()}
      </div>

      {/* Result Display */}
      {renderResult()}

      {/* Mathematical Notation - Hidden in quiz mode */}
      {shouldAnimate && (
        <div className="text-center text-xs text-muted-foreground font-mono space-y-1">
          <div>{dividend} ÷ {divisor} = {quotient}{remainder > 0 ? ` R${remainder}` : ""}</div>
          <div className="text-[10px]">({dividend} = {divisor} × {quotient}{remainder > 0 ? ` + ${remainder}` : ""})</div>
        </div>
      )}
    </div>
  );
}
