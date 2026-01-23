import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leaderboardScores, InsertLeaderboardScore } from "../drizzle/schema";
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
