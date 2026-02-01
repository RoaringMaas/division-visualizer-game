import { describe, it, expect } from "vitest";
import { generateDivisionProblem, Difficulty } from "../divisionUtils";

describe("divisionUtils - Difficulty Levels", () => {
  describe("Easy difficulty (2-digit ÷ 1-digit)", () => {
    it("should generate problems with 2-digit dividend", () => {
      for (let i = 0; i < 10; i++) {
        const problem = generateDivisionProblem("easy");
        expect(problem.dividend).toBeGreaterThanOrEqual(10);
        expect(problem.dividend).toBeLessThanOrEqual(99);
      }
    });

    it("should generate problems with 1-digit divisor", () => {
      for (let i = 0; i < 10; i++) {
        const problem = generateDivisionProblem("easy");
        expect(problem.divisor).toBeGreaterThanOrEqual(1);
        expect(problem.divisor).toBeLessThanOrEqual(9);
      }
    });

    it("should have valid quotient and remainder", () => {
      const problem = generateDivisionProblem("easy");
      const expectedQuotient = Math.floor(problem.dividend / problem.divisor);
      const expectedRemainder = problem.dividend % problem.divisor;
      expect(problem.quotient).toBe(expectedQuotient);
      expect(problem.remainder).toBe(expectedRemainder);
    });
  });

  describe("Medium difficulty (3-digit ÷ 1-digit)", () => {
    it("should generate problems with 3-digit dividend", () => {
      for (let i = 0; i < 10; i++) {
        const problem = generateDivisionProblem("medium");
        expect(problem.dividend).toBeGreaterThanOrEqual(100);
        expect(problem.dividend).toBeLessThanOrEqual(999);
      }
    });

    it("should generate problems with 1-digit divisor", () => {
      for (let i = 0; i < 10; i++) {
        const problem = generateDivisionProblem("medium");
        expect(problem.divisor).toBeGreaterThanOrEqual(1);
        expect(problem.divisor).toBeLessThanOrEqual(9);
      }
    });

    it("should have valid quotient and remainder", () => {
      const problem = generateDivisionProblem("medium");
      const expectedQuotient = Math.floor(problem.dividend / problem.divisor);
      const expectedRemainder = problem.dividend % problem.divisor;
      expect(problem.quotient).toBe(expectedQuotient);
      expect(problem.remainder).toBe(expectedRemainder);
    });
  });

  describe("Hard difficulty (2-3 digit ÷ 2-digit)", () => {
    it("should generate problems with 2-3 digit dividend", () => {
      for (let i = 0; i < 10; i++) {
        const problem = generateDivisionProblem("hard");
        expect(problem.dividend).toBeGreaterThanOrEqual(10);
        expect(problem.dividend).toBeLessThanOrEqual(999);
      }
    });

    it("should generate problems with 2-digit divisor", () => {
      for (let i = 0; i < 10; i++) {
        const problem = generateDivisionProblem("hard");
        expect(problem.divisor).toBeGreaterThanOrEqual(10);
        expect(problem.divisor).toBeLessThanOrEqual(99);
      }
    });

    it("should have valid quotient and remainder", () => {
      const problem = generateDivisionProblem("hard");
      const expectedQuotient = Math.floor(problem.dividend / problem.divisor);
      const expectedRemainder = problem.dividend % problem.divisor;
      expect(problem.quotient).toBe(expectedQuotient);
      expect(problem.remainder).toBe(expectedRemainder);
    });

    it("should ensure dividend is greater than or equal to divisor", () => {
      for (let i = 0; i < 10; i++) {
        const problem = generateDivisionProblem("hard");
        expect(problem.dividend).toBeGreaterThanOrEqual(problem.divisor);
      }
    });
  });

  describe("Default difficulty", () => {
    it("should use easy difficulty when not specified", () => {
      const problem = generateDivisionProblem();
      expect(problem.dividend).toBeGreaterThanOrEqual(10);
      expect(problem.dividend).toBeLessThanOrEqual(99);
      expect(problem.divisor).toBeGreaterThanOrEqual(1);
      expect(problem.divisor).toBeLessThanOrEqual(9);
    });
  });

  describe("Problem generation consistency", () => {
    it("should always generate valid division problems", () => {
      const difficulties: Difficulty[] = ["easy", "medium", "hard"];
      
      difficulties.forEach(difficulty => {
        for (let i = 0; i < 5; i++) {
          const problem = generateDivisionProblem(difficulty);
          
          // Verify math is correct
          expect(problem.dividend).toBe(
            problem.divisor * problem.quotient + problem.remainder
          );
          
          // Remainder should be less than divisor
          expect(problem.remainder).toBeLessThan(problem.divisor);
          
          // Remainder should be non-negative
          expect(problem.remainder).toBeGreaterThanOrEqual(0);
        }
      });
    });
  });
});
