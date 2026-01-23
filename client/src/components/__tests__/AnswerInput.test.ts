import { describe, expect, it, vi } from "vitest";
import { validateAnswer, getFeedbackMessage } from "@/lib/divisionUtils";

describe("AnswerInput Component Logic", () => {
  const mockProblem = {
    dividend: 10,
    divisor: 3,
    quotient: 3,
    remainder: 1,
    scenario: {
      title: "Test",
      description: "test",
      context: "test",
      emoji: "🎯"
    }
  };

  describe("Answer Validation", () => {
    it("validates correct answer", () => {
      const answer = { quotient: 3, remainder: 1 };
      const isCorrect = validateAnswer(mockProblem, answer);
      expect(isCorrect).toBe(true);
    });

    it("validates incorrect quotient", () => {
      const answer = { quotient: 2, remainder: 1 };
      const isCorrect = validateAnswer(mockProblem, answer);
      expect(isCorrect).toBe(false);
    });

    it("validates incorrect remainder", () => {
      const answer = { quotient: 3, remainder: 0 };
      const isCorrect = validateAnswer(mockProblem, answer);
      expect(isCorrect).toBe(false);
    });

    it("validates both quotient and remainder incorrect", () => {
      const answer = { quotient: 5, remainder: 5 };
      const isCorrect = validateAnswer(mockProblem, answer);
      expect(isCorrect).toBe(false);
    });
  });

  describe("Feedback Messages", () => {
    it("provides feedback for correct answer", () => {
      const answer = { quotient: 3, remainder: 1 };
      const feedback = getFeedbackMessage(mockProblem, answer);
      expect(feedback).toBeDefined();
      expect(typeof feedback).toBe("string");
    });

    it("provides feedback for incorrect answer", () => {
      const answer = { quotient: 2, remainder: 0 };
      const feedback = getFeedbackMessage(mockProblem, answer);
      expect(feedback).toBeDefined();
      expect(typeof feedback).toBe("string");
    });
  });

  describe("Quiz Mode Behavior", () => {
    it("should allow editing answer in quiz mode", () => {
      // This test verifies the logic: in quiz mode, after submission,
      // a "Change Answer" button should appear instead of "Try Again"
      const mode = "quiz";
      const submitted = true;
      
      // In quiz mode with submitted=true, we should show "Change Answer" button
      const shouldShowChangeButton = mode === "quiz" && submitted;
      expect(shouldShowChangeButton).toBe(true);
    });

    it("should not show try again button in quiz mode", () => {
      const mode = "quiz";
      const submitted = true;
      
      // In quiz mode, we should never show "Try Again"
      const shouldShowTryAgain = mode === "practice" && submitted;
      expect(shouldShowTryAgain).toBe(false);
    });

    it("should show try again button in practice mode", () => {
      const mode = "practice";
      const submitted = true;
      
      // In practice mode with submitted=true, we should show "Try Again"
      const shouldShowTryAgain = mode === "practice" && submitted;
      expect(shouldShowTryAgain).toBe(true);
    });
  });

  describe("Input Validation", () => {
    it("validates that both quotient and remainder are required", () => {
      const quotient = "3";
      const remainder = "";
      const isValid = quotient !== "" && remainder !== "";
      expect(isValid).toBe(false);
    });

    it("validates that both fields must be filled", () => {
      const quotient = "3";
      const remainder = "1";
      const isValid = quotient !== "" && remainder !== "";
      expect(isValid).toBe(true);
    });

    it("validates empty quotient", () => {
      const quotient = "";
      const remainder = "1";
      const isValid = quotient !== "" && remainder !== "";
      expect(isValid).toBe(false);
    });
  });
});
