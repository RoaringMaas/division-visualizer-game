/**
 * Division Visualizer Game - Home Page
 * Design: Playful Educational with asymmetric layout
 * Left: Visualization (60%), Right: Scenario context (40%)
 */

import DivisionVisualizer from "@/components/DivisionVisualizer";
import { Button } from "@/components/ui/button";
import {
  DivisionProblem,
  generateDivisionProblem,
  getScenarioText,
  getExplanationText
} from "@/lib/divisionUtils";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [problem, setProblem] = useState<DivisionProblem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize with first problem
  useEffect(() => {
    setProblem(generateDivisionProblem());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh animation
    setTimeout(() => {
      setProblem(generateDivisionProblem());
      setIsRefreshing(false);
    }, 300);
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl font-bold mb-4 text-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f3] via-[#fef3c7]/30 to-[#fef9f3] py-8 px-4">
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
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn how division works with real-life scenarios. Watch as numbers are grouped and distributed!
        </p>
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
            <DivisionVisualizer problem={problem} showResult={true} />
          </motion.div>

          {/* Right: Scenario Context (40%) */}
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
                {getScenarioText(problem)}
              </p>
              <div className="bg-gradient-to-br from-[#a855f7]/10 to-[#ec4899]/10 rounded-lg p-4 border border-[#a855f7]/20">
                <p className="text-sm font-medium text-foreground">
                  {getExplanationText(problem)}
                </p>
              </div>
            </div>

            {/* Division Breakdown Card */}
            <div className="bg-gradient-to-br from-[#0891b2]/5 to-[#f97316]/5 rounded-2xl shadow-lg p-6 border-2 border-slate-100">
              <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "Fredoka" }}>
                Division Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#0891b2]/20">
                  <span className="text-sm font-medium text-muted-foreground">Dividend (total)</span>
                  <span className="text-2xl font-bold dividend-color">{problem.dividend}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#f97316]/20">
                  <span className="text-sm font-medium text-muted-foreground">Divisor (groups)</span>
                  <span className="text-2xl font-bold divisor-color">{problem.divisor}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#a855f7]/20">
                  <span className="text-sm font-medium text-muted-foreground">Quotient (each)</span>
                  <span className="text-2xl font-bold quotient-color">{problem.quotient}</span>
                </div>
                {problem.remainder > 0 && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                    <span className="text-sm font-medium text-muted-foreground">Remainder</span>
                    <span className="text-2xl font-bold text-orange-500">{problem.remainder}</span>
                  </div>
                )}
              </div>
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
          Click <span className="font-semibold">New Problem</span> to generate different division scenarios with 1-2 digit numbers
        </p>
      </motion.div>
    </div>
  );
}
