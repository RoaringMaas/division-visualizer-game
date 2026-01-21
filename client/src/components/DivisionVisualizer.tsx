/**
 * Division Visualizer Component
 * Displays division as groups of blocks with smooth animations
 * Design: Playful Educational - Color-coded blocks (teal, orange, purple)
 */

import { DivisionProblem, generateDivisionVisualization } from "@/lib/divisionUtils";
import { motion } from "framer-motion";

interface DivisionVisualizerProps {
  problem: DivisionProblem;
  showResult?: boolean;
}

export default function DivisionVisualizer({
  problem,
  showResult = true
}: DivisionVisualizerProps) {
  const groups = generateDivisionVisualization(problem);
  const { dividend, divisor, quotient, remainder, scenario } = problem;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
        duration: 0.4
      }
    }
  };

  const blockVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
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
        delay: 0.5,
        duration: 0.5
      }
    }
  };

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

      {/* Division Visualization */}
      <motion.div
        className="grid gap-6 justify-center"
        style={{
          gridTemplateColumns: `repeat(${Math.min(divisor, 4)}, 1fr)`,
          maxWidth: "100%"
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={`${dividend}-${divisor}`}
      >
        {groups.map((group, groupIndex) => (
          <motion.div
            key={groupIndex}
            className="flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow"
            variants={groupVariants}
          >
            {/* Group Label */}
            <div className="text-center text-xs font-semibold text-muted-foreground">
              Group {groupIndex + 1}
            </div>

            {/* Blocks in Group */}
            <div className="flex flex-wrap gap-2 justify-center">
              {group.map((itemIndex) => (
                <motion.div
                  key={itemIndex}
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0891b2] to-[#0284c7] shadow-md flex items-center justify-center text-white text-xs font-bold"
                  variants={blockVariants}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                >
                  {itemIndex + 1}
                </motion.div>
              ))}
            </div>

            {/* Group Count */}
            <div className="text-center text-sm font-bold text-[#0891b2]">
              {group.length} {scenario.emoji}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Result Display */}
      {showResult && (
        <motion.div
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#a855f7]/10 to-[#ec4899]/10 border-2 border-[#a855f7]/30 shadow-lg"
          variants={resultVariants}
          initial="hidden"
          animate="visible"
          key={`result-${dividend}-${divisor}`}
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
