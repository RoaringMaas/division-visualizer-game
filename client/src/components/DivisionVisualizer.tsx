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
}

export default function DivisionVisualizer({
  problem,
  showResult = true,
  questionKey
}: DivisionVisualizerProps) {
  const { dividend, divisor, quotient, remainder, scenario } = problem;

  // Memoize groups to prevent unnecessary recalculations
  const groups = useMemo(() => {
    return Array.from({ length: divisor }, (_, i) => 
      Array.from({ length: quotient }, (_, j) => i * quotient + j + 1)
    );
  }, [divisor, quotient]);

  // Animation variants - optimized to reduce re-renders
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const groupVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const blockVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  const remainderVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.15,
        duration: 0.3
      }
    }
  };

  const resultVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3,
        duration: 0.4
      }
    }
  };

  // Calculate grid columns based on divisor
  const gridCols = Math.min(divisor, 4);

  // Create unique key for this question to force remount
  const visualizationKey = questionKey ? `viz-${questionKey}` : `viz-${dividend}-${divisor}`;

  return (
    <div className="w-full space-y-8">
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
      <div className="space-y-6" key={visualizationKey}>
        {/* Main Groups */}
        <motion.div
          className="grid gap-4 justify-center"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, minmax(120px, 1fr))`,
            maxWidth: "100%"
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {groups.map((group, groupIndex) => (
            <motion.div
              key={`group-${groupIndex}`}
              className="flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow"
              variants={groupVariants}
            >
              {/* Group Label */}
              <div className="text-center text-xs font-semibold text-muted-foreground">
                Group {groupIndex + 1}
              </div>

              {/* Items in Group */}
              <div className="flex flex-wrap gap-2 justify-center">
                {group.map((itemIndex) => (
                  <motion.div
                    key={`item-${itemIndex}`}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0891b2] to-[#0284c7] shadow-md flex items-center justify-center text-white text-xs font-bold"
                    variants={blockVariants}
                  >
                    {itemIndex}
                  </motion.div>
                ))}
              </div>

              {/* Group Count */}
              <div className="text-center text-sm font-bold text-[#0891b2]">
                {quotient} {scenario.emoji}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Remainder Section (if any) */}
        {remainder > 0 && (
          <motion.div
            className="flex justify-center"
            variants={remainderVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 shadow-md">
              {/* Remainder Label */}
              <div className="text-center text-xs font-semibold text-muted-foreground">
                Remainder
              </div>

              {/* Remainder Items */}
              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from({ length: remainder }, (_, i) => (
                  <motion.div
                    key={`remainder-${i}`}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-md flex items-center justify-center text-white text-xs font-bold"
                    variants={blockVariants}
                  >
                    {dividend - remainder + i + 1}
                  </motion.div>
                ))}
              </div>

              {/* Remainder Count */}
              <div className="text-center text-sm font-bold text-orange-600">
                {remainder} {scenario.emoji} left over
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Result Display */}
      {showResult && (
        <motion.div
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#a855f7]/10 to-[#ec4899]/10 border-2 border-[#a855f7]/30 shadow-lg"
          variants={resultVariants}
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
      )}

      {/* Mathematical Notation */}
      <div className="text-center text-xs text-muted-foreground font-mono space-y-1">
        <div>{dividend} ÷ {divisor} = {quotient}{remainder > 0 ? ` R${remainder}` : ""}</div>
        <div className="text-[10px]">({dividend} = {divisor} × {quotient}{remainder > 0 ? ` + ${remainder}` : ""})</div>
      </div>
    </div>
  );
}
