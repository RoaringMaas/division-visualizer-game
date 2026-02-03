import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leaderboard table for quiz scores
 * Stores all student quiz attempts with scores and accuracy
 */
export const leaderboardScores = mysqlTable("leaderboardScores", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeaderboardScore = typeof leaderboardScores.$inferSelect;
export type InsertLeaderboardScore = typeof leaderboardScores.$inferInsert;

/**
 * Student Statistics table for tracking progress
 * Stores aggregated statistics for each student by difficulty level
 */
export const studentStatistics = mysqlTable("studentStatistics", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).notNull(),
  totalAttempts: int("totalAttempts").default(0).notNull(),
  totalCorrect: int("totalCorrect").default(0).notNull(),
  averageAccuracy: int("averageAccuracy").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudentStatistic = typeof studentStatistics.$inferSelect;
export type InsertStudentistic = typeof studentStatistics.$inferInsert;
/**
 * Student Achievements table for tracking badges
 * Stores unlocked achievements/badges for each student
 */
export const studentAchievements = mysqlTable("studentAchievements", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  badgeId: varchar("badgeId", { length: 50 }).notNull(),
  badgeTitle: varchar("badgeTitle", { length: 100 }).notNull(),
  badgeDescription: text("badgeDescription").notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type StudentAchievement = typeof studentAchievements.$inferSelect;
export type InsertStudentAchievement = typeof studentAchievements.$inferInsert;
