/**
 * Division Visualizer Game - Utility Functions
 * Generates division problems and real-life scenarios
 */

export interface DivisionProblem {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  scenario: Scenario;
}

export interface Scenario {
  title: string;
  description: string;
  emoji: string;
  context: string;
}

const scenarios: Scenario[] = [
  {
    title: "Sharing Cookies",
    description: "cookies shared among friends",
    emoji: "🍪",
    context: "Each friend gets"
  },
  {
    title: "Distributing Apples",
    description: "apples divided into baskets",
    emoji: "🍎",
    context: "Each basket contains"
  },
  {
    title: "Organizing Books",
    description: "books arranged on shelves",
    emoji: "📚",
    context: "Each shelf has"
  },
  {
    title: "Sharing Candies",
    description: "candies distributed to kids",
    emoji: "🍬",
    context: "Each kid receives"
  },
  {
    title: "Dividing Toys",
    description: "toys split among children",
    emoji: "🧸",
    context: "Each child gets"
  },
  {
    title: "Sharing Pizza Slices",
    description: "pizza slices divided among people",
    emoji: "🍕",
    context: "Each person gets"
  },
  {
    title: "Organizing Pencils",
    description: "pencils grouped into boxes",
    emoji: "✏️",
    context: "Each box contains"
  },
  {
    title: "Distributing Stickers",
    description: "stickers shared with friends",
    emoji: "⭐",
    context: "Each friend gets"
  },
  {
    title: "Sharing Marbles",
    description: "marbles divided into groups",
    emoji: "🔵",
    context: "Each group has"
  },
  {
    title: "Organizing Flowers",
    description: "flowers arranged in vases",
    emoji: "🌸",
    context: "Each vase contains"
  },
  {
    title: "Distributing Coins",
    description: "coins shared equally",
    emoji: "🪙",
    context: "Each person gets"
  },
  {
    title: "Sharing Balloons",
    description: "balloons divided among guests",
    emoji: "🎈",
    context: "Each guest receives"
  }
];

/**
 * Generate a random division problem with 1-2 digit numbers
 */
export function generateDivisionProblem(): DivisionProblem {
  // Generate dividend: 10-99 (2 digits) or 1-9 (1 digit)
  const dividend = Math.random() > 0.5 
    ? Math.floor(Math.random() * 90) + 10  // 10-99
    : Math.floor(Math.random() * 9) + 1;   // 1-9

  // Generate divisor: 2-12 (ensure it's smaller than dividend)
  let divisor = Math.floor(Math.random() * 11) + 2; // 2-12
  while (divisor > dividend) {
    divisor = Math.floor(Math.random() * 11) + 2;
  }

  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;

  // Pick a random scenario
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  return {
    dividend,
    divisor,
    quotient,
    remainder,
    scenario
  };
}

/**
 * Get the full scenario text
 */
export function getScenarioText(problem: DivisionProblem): string {
  const { dividend, divisor, scenario } = problem;
  return `${dividend} ${scenario.description} by ${divisor}`;
}

/**
 * Get the explanation text
 */
export function getExplanationText(problem: DivisionProblem): string {
  const { dividend, divisor, quotient, remainder, scenario } = problem;
  if (remainder === 0) {
    return `${dividend} ÷ ${divisor} = ${quotient}. ${scenario.context} ${quotient} each.`;
  } else {
    return `${dividend} ÷ ${divisor} = ${quotient} remainder ${remainder}. ${scenario.context} ${quotient} each, with ${remainder} left over.`;
  }
}

/**
 * Generate array of items to visualize division
 */
export function generateDivisionVisualization(problem: DivisionProblem): number[][] {
  const { dividend, divisor } = problem;
  const groups: number[][] = [];

  for (let i = 0; i < divisor; i++) {
    groups.push([]);
  }

  for (let i = 0; i < dividend; i++) {
    groups[i % divisor].push(i);
  }

  return groups;
}
