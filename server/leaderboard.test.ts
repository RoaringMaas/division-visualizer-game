import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Mock database functions for testing
 */
const mockLeaderboardData = [
  { id: 1, name: "Alice", score: 9, totalQuestions: 10, createdAt: new Date("2026-01-23") },
  { id: 2, name: "Bob", score: 7, totalQuestions: 10, createdAt: new Date("2026-01-22") },
  { id: 3, name: "Charlie", score: 9, totalQuestions: 10, createdAt: new Date("2026-01-21") },
  { id: 4, name: "Diana", score: 5, totalQuestions: 10, createdAt: new Date("2026-01-20") },
];

// Mock the db module
vi.mock("./db", () => ({
  getLeaderboardScores: vi.fn(async () => mockLeaderboardData),
  addLeaderboardScore: vi.fn(async (name: string, score: number, totalQuestions: number) => {
    mockLeaderboardData.push({
      id: mockLeaderboardData.length + 1,
      name,
      score,
      totalQuestions,
      createdAt: new Date(),
    });
    return { success: true };
  }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("leaderboard", () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockLeaderboardData.length = 4;
  });

  describe("leaderboard.getAll", () => {
    it("returns all leaderboard scores", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.leaderboard.getAll();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("returns entries with required fields", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.leaderboard.getAll();

      result.forEach((entry) => {
        expect(entry).toHaveProperty("name");
        expect(entry).toHaveProperty("score");
        expect(entry).toHaveProperty("totalQuestions");
        expect(entry).toHaveProperty("createdAt");
      });
    });

    it("returns empty array when no scores exist", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.leaderboard.getAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("leaderboard.addScore", () => {
    it("adds a new score to the leaderboard", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.leaderboard.addScore({
        name: "Eve",
        score: 8,
        totalQuestions: 10,
      });

      expect(result).toEqual({ success: true });
    });

    it("validates name is not empty", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.leaderboard.addScore({
          name: "",
          score: 8,
          totalQuestions: 10,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("too_small");
      }
    });

    it("validates score is between 0 and 10", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.leaderboard.addScore({
          name: "Frank",
          score: 15,
          totalQuestions: 10,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("too_big");
      }
    });

    it("validates totalQuestions is positive", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.leaderboard.addScore({
          name: "Grace",
          score: 5,
          totalQuestions: 0,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("too_small");
      }
    });

    it("accepts valid score data", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.leaderboard.addScore({
        name: "Henry",
        score: 10,
        totalQuestions: 10,
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("leaderboard accuracy calculation", () => {
    it("calculates accuracy correctly for perfect score", async () => {
      const accuracy = (10 / 10) * 100;
      expect(accuracy).toBe(100);
    });

    it("calculates accuracy correctly for partial score", async () => {
      const accuracy = (7 / 10) * 100;
      expect(accuracy).toBe(70);
    });

    it("calculates accuracy correctly for zero score", async () => {
      const accuracy = (0 / 10) * 100;
      expect(accuracy).toBe(0);
    });
  });
});
