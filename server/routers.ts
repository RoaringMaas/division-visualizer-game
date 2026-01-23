import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getLeaderboardScores, addLeaderboardScore } from "./db";

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
});

export type AppRouter = typeof appRouter;
