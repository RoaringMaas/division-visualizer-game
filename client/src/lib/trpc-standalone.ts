/**
 * Standalone tRPC mock — replaces real tRPC calls with localStorage-based
 * equivalents so the app works as a single, self-contained HTML file.
 */
import { type ReactNode, useState, useEffect, createElement } from "react";

const LEADERBOARD_KEY = "dvg-leaderboard";

// ---------------------------------------------------------------------------
// Types (mirrors the server shape)
// ---------------------------------------------------------------------------

interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  totalQuestions: number;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

function readLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<LeaderboardEntry & { createdAt: string }>;
    return parsed.map((e) => ({ ...e, createdAt: new Date(e.createdAt) }));
  } catch {
    return [];
  }
}

function writeLeaderboard(entries: LeaderboardEntry[]) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

// ---------------------------------------------------------------------------
// Tiny hook helpers
// ---------------------------------------------------------------------------

function makeUseQuery<T>(fetcher: () => T) {
  return function useQuery() {
    const [data, setData] = useState<T | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      setData(fetcher());
      setIsLoading(false);
    }, []);

    const refetch = () => setData(fetcher());

    return { data, isLoading, refetch };
  };
}

function makeUseMutation<TInput, TOutput>(
  fn: (input: TInput) => TOutput,
) {
  return function useMutation(options?: { onSuccess?: (data: TOutput) => void }) {
    const mutate = (input: TInput) => {
      const result = fn(input);
      options?.onSuccess?.(result);
    };
    return { mutate, isPending: false };
  };
}

// ---------------------------------------------------------------------------
// The trpc mock object — matches the shape used by components
// ---------------------------------------------------------------------------

export const trpc = {
  // Used in main.tsx — just renders children
  Provider: function Provider({
    children,
  }: {
    children: ReactNode;
    client?: unknown;
    queryClient?: unknown;
  }) {
    return createElement("div", { style: { display: "contents" } }, children);
  },

  // Returns a no-op client (unused when Provider is a passthrough)
  createClient: () => ({}),

  leaderboard: {
    getAll: {
      useQuery: makeUseQuery<LeaderboardEntry[]>(readLeaderboard),
    },
    addScore: {
      useMutation: makeUseMutation(
        ({
          name,
          score,
          totalQuestions,
        }: {
          name: string;
          score: number;
          totalQuestions: number;
        }) => {
          const entries = readLeaderboard();
          const newEntry: LeaderboardEntry = {
            id: Date.now(),
            name,
            score,
            totalQuestions,
            createdAt: new Date(),
          };
          writeLeaderboard([...entries, newEntry]);
          return { success: true as const };
        },
      ),
    },
  },

  statistics: {
    getByName: {
      useQuery: (_input: { name: string }) => ({ data: null, isLoading: false, refetch: () => {} }),
    },
    update: {
      useMutation: () => ({ mutate: (_input: unknown) => {}, isPending: false }),
    },
  },

  achievements: {
    getByName: {
      useQuery: (_input: { name: string }) => ({ data: null, isLoading: false, refetch: () => {} }),
    },
    award: {
      useMutation: () => ({ mutate: (_input: unknown) => {}, isPending: false }),
    },
  },
};
