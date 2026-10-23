import type { Category, Question, RoundQuestion } from './types';

export function questionPool(bank: Question[], categories: Category[]): Question[] {
  const filtered = bank.filter((q) => categories.includes(q.category));
  return filtered.length > 0 ? filtered : bank;
}

function shuffled<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Picks questions for a game, preferring ones the group hasn't seen yet. */
export function pickQuestions(
  bank: Question[],
  count: number,
  categories: Category[],
  seen: Set<string>,
  random: () => number = Math.random,
): RoundQuestion[] {
  const pool = questionPool(bank, categories);
  const fresh = shuffled(pool.filter((q) => !seen.has(q.prompt)), random);
  const repeats = shuffled(pool.filter((q) => seen.has(q.prompt)), random);

  return [...fresh, ...repeats].slice(0, Math.max(count, 0)).map((question) => ({
    question,
    correctSide: random() < 0.5 ? 'a' : 'b',
  }));
}

/**
 * Marks questions as seen. Once every question in `pool` has been seen,
 * the pool starts over so the deck never runs dry.
 */
export function markSeen(seen: Set<string>, ids: string[], pool: Question[]): Set<string> {
  const next = new Set([...seen, ...ids]);
  if (pool.every((q) => next.has(q.prompt))) {
    pool.forEach((q) => next.delete(q.prompt));
    ids.forEach((id) => next.add(id));
  }
  return next;
}
