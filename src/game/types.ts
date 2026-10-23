export type Category = 'animals' | 'science' | 'space' | 'food' | 'history' | 'myths';

export const CATEGORIES: { id: Category; title: string; emoji: string }[] = [
  { id: 'animals', title: 'Animals', emoji: '🦀' },
  { id: 'science', title: 'Science', emoji: '🧪' },
  { id: 'space', title: 'Space', emoji: '🪐' },
  { id: 'food', title: 'Food', emoji: '🍅' },
  { id: 'history', title: 'History', emoji: '🏛️' },
  { id: 'myths', title: 'Myths', emoji: '🤔' },
];

export function categoryTitle(id: Category): string {
  return CATEGORIES.find((c) => c.id === id)?.title ?? id;
}

/**
 * A two-sided "technically" question: one answer is what most people
 * assume, the other is what's actually true.
 */
export interface Question {
  category: Category;
  emoji: string;
  prompt: string;
  correct: string;
  wrong: string;
  fact: string;
}

export type Side = 'a' | 'b';
export const SIDES: Side[] = ['a', 'b'];

/** A question as it's played in a round, with its answers placed on a side. */
export interface RoundQuestion {
  question: Question;
  correctSide: Side;
}

export function answerFor(round: RoundQuestion, side: Side): string {
  return side === round.correctSide ? round.question.correct : round.question.wrong;
}

export interface Player {
  id: string;
  name: string;
  colorIndex: number;
}

export interface GameSettings {
  rounds: number;
  timerSeconds: number;
  categories: Category[];
}

export const ROUND_OPTIONS = [5, 10, 15, 20];
export const TIMER_OPTIONS = [15, 30, 60, 90];
export const MAX_PLAYERS = 8;

export const DEFAULT_SETTINGS: GameSettings = {
  rounds: 10,
  timerSeconds: 30,
  categories: CATEGORIES.map((c) => c.id),
};

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
