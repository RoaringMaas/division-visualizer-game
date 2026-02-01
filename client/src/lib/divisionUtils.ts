/**
 * Division Visualizer Game - Utility Functions
 * Generates division problems and real-life scenarios
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DivisionProblem {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  scenario: Scenario;
  difficulty: Difficulty;
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
 * Generate a random division problem based on difficulty level
 * Easy: 2-digit ÷ 1-digit (10-99 ÷ 2-9)
 * Medium: 3-digit ÷ 1-digit (100-999 ÷ 2-9)
 * Hard: 2-3 digit ÷ 2-digit (10-999 ÷ 10-99)
 */
export function generateDivisionProblem(difficulty: Difficulty = 'easy'): DivisionProblem {
  let dividend: number;
  let divisor: number;

  if (difficulty === 'easy') {
    // Easy: 2-digit ÷ 1-digit
    dividend = Math.floor(Math.random() * 90) + 10; // 10-99
    divisor = Math.floor(Math.random() * 8) + 2;    // 2-9
  } else if (difficulty === 'medium') {
    // Medium: 3-digit ÷ 1-digit
    dividend = Math.floor(Math.random() * 900) + 100; // 100-999
    divisor = Math.floor(Math.random() * 8) + 2;      // 2-9
  } else {
    // Hard: 2-3 digit ÷ 2-digit
    dividend = Math.floor(Math.random() * 900) + 100; // 100-999
    divisor = Math.floor(Math.random() * 90) + 10;    // 10-99
  }

  // Ensure divisor is smaller than dividend
  while (divisor > dividend) {
    if (difficulty === 'easy') {
      divisor = Math.floor(Math.random() * 8) + 2;
    } else if (difficulty === 'medium') {
      divisor = Math.floor(Math.random() * 8) + 2;
    } else {
      divisor = Math.floor(Math.random() * 90) + 10;
    }
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
    scenario,
    difficulty
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
 * For hard mode with large numbers, cap visualization to 20 groups max
 */
export function generateDivisionVisualization(problem: DivisionProblem): number[][] {
  const { dividend, divisor, difficulty } = problem;
  const groups: number[][] = [];
  
  // For hard mode, cap visualization to prevent performance issues
  const maxGroups = difficulty === 'hard' ? Math.min(divisor, 20) : divisor;
  const itemsPerGroup = Math.ceil(dividend / maxGroups);

  for (let i = 0; i < maxGroups; i++) {
    groups.push([]);
  }

  for (let i = 0; i < dividend; i++) {
    groups[i % maxGroups].push(i);
  }

  return groups;
}

/**
 * Validate student's answer
 */
export interface StudentAnswer {
  quotient: number | string;
  remainder: number | string;
}

export function validateAnswer(problem: DivisionProblem, answer: StudentAnswer): boolean {
  const quotientCorrect = parseInt(String(answer.quotient)) === problem.quotient;
  const remainderCorrect = parseInt(String(answer.remainder)) === problem.remainder;
  return quotientCorrect && remainderCorrect;
}

/**
 * Get feedback message for incorrect answer
 */
export function getFeedbackMessage(problem: DivisionProblem, answer: StudentAnswer): string {
  const quotientCorrect = parseInt(String(answer.quotient)) === problem.quotient;
  const remainderCorrect = parseInt(String(answer.remainder)) === problem.remainder;

  if (quotientCorrect && remainderCorrect) {
    return "Perfect! You got it right!";
  }

  const messages: string[] = [];
  if (!quotientCorrect) {
    messages.push(`Quotient should be ${problem.quotient}, not ${answer.quotient}`);
  }
  if (!remainderCorrect) {
    messages.push(`Remainder should be ${problem.remainder}, not ${answer.remainder}`);
  }

  return messages.join(". ");
}
