/**
 * Answer Input Component
 * Allows students to input quotient and remainder answers
 * Design: Playful Educational with input fields and check button
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DivisionProblem, StudentAnswer, validateAnswer, getFeedbackMessage } from "@/lib/divisionUtils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";

interface AnswerInputProps {
  problem: DivisionProblem;
  onAnswerSubmit?: (isCorrect: boolean) => void;
  showFeedback?: boolean;
  mode?: "practice" | "quiz";
  onNewProblem?: () => void;
}

export default function AnswerInput({
  problem,
  onAnswerSubmit,
  showFeedback = true,
  mode = "practice",
  onNewProblem
}: AnswerInputProps) {
  const [quotient, setQuotient] = useState("");
  const [remainder, setRemainder] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Auto-reset when problem changes (for quiz mode question transitions)
  useEffect(() => {
    handleReset();
  }, [problem.dividend, problem.divisor]);

  const handleCheck = () => {
    const answer: StudentAnswer = {
      quotient: quotient === "" ? 0 : parseInt(quotient),
      remainder: remainder === "" ? 0 : parseInt(remainder)
    };

    const correct = validateAnswer(problem, answer);
    setIsCorrect(correct);
    setFeedback(getFeedbackMessage(problem, answer));
    setSubmitted(true);

    if (onAnswerSubmit) {
      onAnswerSubmit(correct);
    }
  };

  const handleReset = () => {
    setQuotient("");
    setRemainder("");
    setSubmitted(false);
    setIsCorrect(false);
    setFeedback("");
  };

  const handleNewProblem = () => {
    handleReset();
    if (onNewProblem) {
      onNewProblem();
    }
  };

  const handleChangeAnswer = () => {
    setSubmitted(false);
    setIsCorrect(false);
    setFeedback("");
  };

  const isInputValid = quotient !== "" && remainder !== "";

  return (
    <div className="space-y-4">
      {/* Input Fields */}
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Quotient (how many each)
          </label>
          <Input
            type="number"
            min="0"
            value={quotient}
            onChange={(e) => setQuotient(e.target.value)}
            placeholder="Enter quotient"
            disabled={submitted && mode === "practice"}
            className="text-lg font-bold quotient-color border-2 border-[#a855f7]/30 focus:border-[#a855f7]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Remainder (left over)
          </label>
          <Input
            type="number"
            min="0"
            value={remainder}
            onChange={(e) => setRemainder(e.target.value)}
            placeholder="Enter remainder"
            disabled={submitted && mode === "practice"}
            className="text-lg font-bold text-orange-500 border-2 border-orange-200 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {!submitted ? (
          <Button
            onClick={handleCheck}
            disabled={!isInputValid}
            className="flex-1 h-10 font-bold rounded-lg bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0284c7] hover:to-[#0891b2] text-white disabled:opacity-50"
          >
            <Check size={18} className="mr-2" />
            Check Answer
          </Button>
        ) : mode === "practice" ? (
          <Button
            onClick={handleNewProblem}
            className="flex-1 h-10 font-bold rounded-lg bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white"
          >
            Try Again
          </Button>
        ) : mode === "quiz" ? (
          <Button
            onClick={handleChangeAnswer}
            className="flex-1 h-10 font-bold rounded-lg bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white"
          >
            <Edit2 size={18} className="mr-2" />
            Change Answer
          </Button>
        ) : null}
      </div>

      {/* Feedback Message */}
      <AnimatePresence>
        {submitted && showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-lg border-2 ${
              isCorrect
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-red-50 border-red-300 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <Check size={20} className="text-green-600" />
              ) : (
                <X size={20} className="text-red-600" />
              )}
              <span className="font-bold">
                {isCorrect ? "Correct!" : "Not quite right"}
              </span>
            </div>
            <p className="text-sm">{feedback}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer Summary */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm space-y-2"
        >
          <div className="flex justify-between">
            <span className="text-muted-foreground">Your answer:</span>
            <span className="font-bold">
              {quotient} R{remainder}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Correct answer:</span>
            <span className="font-bold">
              {problem.quotient} R{problem.remainder}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
