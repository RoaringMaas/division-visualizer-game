import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leaderboardScores, InsertLeaderboardScore, studentStatistics } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all leaderboard scores sorted by accuracy and date
 */
export async function getLeaderboardScores() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get leaderboard: database not available");
    return [];
  }

  try {
    const scores = await db.select().from(leaderboardScores);

    // Sort in memory: by accuracy (descending), then by date (newest first)
    return scores.sort((a, b) => {
      const accuracyA = (a.score / a.totalQuestions) * 100;
      const accuracyB = (b.score / b.totalQuestions) * 100;
      if (accuracyB !== accuracyA) return accuracyB - accuracyA;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error("[Database] Failed to get leaderboard:", error);
    return [];
  }
}

/**
 * Add a new leaderboard score
 */
export async function addLeaderboardScore(
  name: string,
  score: number,
  totalQuestions: number
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add score: database not available");
    return null;
  }

  try {
    const result = await db.insert(leaderboardScores).values({
      name,
      score,
      totalQuestions,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to add leaderboard score:", error);
    throw error;
  }
}

/**
 * Get student statistics by name
 */
export async function getStudentStatistics(name: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get statistics: database not available");
    return [];
  }

  try {
    const result = await db.select().from(studentStatistics).where(eq(studentStatistics.name, name));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get student statistics:", error);
    return [];
  }
}

/**
 * Update or create student statistics
 */
export async function updateStudentStatistics(
  name: string,
  difficulty: "easy" | "medium" | "hard",
  score: number,
  totalQuestions: number
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update statistics: database not available");
    return null;
  }

  try {
    const existing = await db
      .select()
      .from(studentStatistics)
      .where(eq(studentStatistics.name, name))
      .limit(1);

    const isCorrect = score === totalQuestions ? 1 : 0;
    const newAccuracy = Math.round((score / totalQuestions) * 100);

    if (existing.length > 0) {
      const current = existing[0];
      const newTotalAttempts = current.totalAttempts + 1;
      const newTotalCorrect = current.totalCorrect + isCorrect;
      const updatedAccuracy = Math.round((newTotalCorrect / newTotalAttempts) * 100);

      await db
        .update(studentStatistics)
        .set({
          totalAttempts: newTotalAttempts,
          totalCorrect: newTotalCorrect,
          averageAccuracy: updatedAccuracy,
        })
        .where(eq(studentStatistics.name, name));
    } else {
      await db.insert(studentStatistics).values({
        name,
        difficulty,
        totalAttempts: 1,
        totalCorrect: isCorrect,
        averageAccuracy: newAccuracy,
      });
    }
  } catch (error) {
    console.error("[Database] Failed to update student statistics:", error);
    throw error;
  }
}

/**
 * Get student achievements by name
 */
export async function getStudentAchievements(name: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get achievements: database not available");
    return [];
  }

  try {
    const { studentAchievements: achievements } = await import("../drizzle/schema");
    const result = await db.select().from(achievements).where(eq(achievements.name, name));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get student achievements:", error);
    return [];
  }
}

/**
 * Award a badge to a student (if not already awarded)
 */
export async function awardBadge(
  name: string,
  badgeId: string,
  badgeTitle: string,
  badgeDescription: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot award badge: database not available");
    return null;
  }

  try {
    const { studentAchievements: achievements } = await import("../drizzle/schema");
    
    // Check if badge already exists
    const existing = await db
      .select()
      .from(achievements)
      .where(eq(achievements.name, name))
      .limit(1);

    const alreadyHasBadge = existing.some((a) => a.badgeId === badgeId);
    
    if (!alreadyHasBadge) {
      await db.insert(achievements).values({
        name,
        badgeId,
        badgeTitle,
        badgeDescription,
      });
      return { success: true, newBadge: true };
    }
    
    return { success: true, newBadge: false };
  } catch (error) {
    console.error("[Database] Failed to award badge:", error);
    throw error;
  }
}
