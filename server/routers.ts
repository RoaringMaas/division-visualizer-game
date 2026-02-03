import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getLeaderboardScores, addLeaderboardScore, getStudentStatistics, updateStudentStatistics, getStudentAchievements, awardBadge } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  leaderboard: router({
    getAll: publicProcedure.query(async () => {
      return await getLeaderboardScores();
    }),
    addScore: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          score: z.number().int().min(0).max(10),
          totalQuestions: z.number().int().positive(),
        })
      )
      .mutation(async ({ input }) => {
        await addLeaderboardScore(input.name, input.score, input.totalQuestions);
        return { success: true };
      }),
  }),

  statistics: router({
    getByName: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
        })
      )
      .query(async ({ input }) => {
        return await getStudentStatistics(input.name);
      }),
    update: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          difficulty: z.enum(["easy", "medium", "hard"]),
          score: z.number().int().min(0).max(10),
          totalQuestions: z.number().int().positive(),
        })
      )
      .mutation(async ({ input }) => {
        await updateStudentStatistics(input.name, input.difficulty, input.score, input.totalQuestions);
        return { success: true };
      }),
  }),

  achievements: router({
    getByName: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
        })
      )
      .query(async ({ input }) => {
        return await getStudentAchievements(input.name);
      }),
    award: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          badgeId: z.string(),
          badgeTitle: z.string(),
          badgeDescription: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return await awardBadge(input.name, input.badgeId, input.badgeTitle, input.badgeDescription);
      }),
  }),
});

export type AppRouter = typeof appRouter;
