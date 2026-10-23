import { describe, expect, it } from 'vitest';

import { markSeen, pickQuestions, questionPool } from '../picker';
import { QUESTIONS } from '../questions';
import {
  createGame,
  gameReducer,
  POINTS_FOR_CORRECT,
  scoreFor,
  standings,
  UNDERDOG_POINTS,
  winners,
  type GameAction,
  type GameState,
} from '../session';
import { answerFor, CATEGORIES, type Player, type RoundQuestion, type Side } from '../types';

const makePlayers = (count: number): Player[] =>
  Array.from({ length: count }, (_, i) => ({ id: `p${i}`, name: `P${i}`, colorIndex: i }));

const makeRounds = (sides: Side[]): RoundQuestion[] =>
  sides.map((side, i) => ({
    question: { category: 'science', emoji: '🧪', prompt: `Q${i}`, correct: 'Right', wrong: 'Wrong', fact: 'Fact' },
    correctSide: side,
  }));

const run = (state: GameState, ...actions: GameAction[]) => actions.reduce(gameReducer, state);
const vote = (playerId: string, side: Side): GameAction => ({ type: 'vote', playerId, side });

/** Deterministic random numbers for repeatable shuffles. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe('game session', () => {
  it('starts in debate', () => {
    expect(createGame(makePlayers(2), makeRounds(['a']), 30).phase).toBe('debate');
  });

  it('is finished when there are no questions', () => {
    expect(createGame(makePlayers(2), [], 30).phase).toBe('finished');
  });

  it("can't reveal until everyone votes", () => {
    let state = run(createGame(makePlayers(2), makeRounds(['a']), 30), { type: 'startVoting' }, vote('p0', 'a'), {
      type: 'reveal',
    });
    expect(state.phase).toBe('vote');

    state = run(state, vote('p1', 'b'), { type: 'reveal' });
    expect(state.phase).toBe('reveal');
  });

  it('ignores votes outside the vote phase', () => {
    const state = run(createGame(makePlayers(1), makeRounds(['a']), 30), vote('p0', 'a'));
    expect(state.votes).toEqual({});
  });

  it('awards points to correct players', () => {
    const state = run(
      createGame(makePlayers(2), makeRounds(['b']), 30),
      { type: 'startVoting' },
      vote('p0', 'a'),
      vote('p1', 'b'),
      { type: 'reveal' },
    );
    expect(scoreFor(state, 'p0')).toBe(0);
    expect(scoreFor(state, 'p1')).toBe(POINTS_FOR_CORRECT);
    expect(state.lastOutcome?.underdogBonus).toBe(false);
  });

  it('gives an underdog bonus when the right answer is in the minority', () => {
    const state = run(
      createGame(makePlayers(3), makeRounds(['a']), 30),
      { type: 'startVoting' },
      vote('p0', 'a'),
      vote('p1', 'b'),
      vote('p2', 'b'),
      { type: 'reveal' },
    );
    expect(state.lastOutcome?.underdogBonus).toBe(true);
    expect(scoreFor(state, 'p0')).toBe(POINTS_FOR_CORRECT + UNDERDOG_POINTS);
  });

  it('gives no underdog bonus when nobody is right', () => {
    const state = run(
      createGame(makePlayers(3), makeRounds(['a']), 30),
      { type: 'startVoting' },
      vote('p0', 'b'),
      vote('p1', 'b'),
      vote('p2', 'b'),
      { type: 'reveal' },
    );
    expect(state.lastOutcome?.underdogBonus).toBe(false);
    expect(state.lastOutcome?.points).toEqual({});
  });

  it('advances through rounds to finished', () => {
    let state = createGame(makePlayers(1), makeRounds(['a', 'b']), 30);
    for (const side of ['a', 'b'] as Side[]) {
      expect(state.phase).toBe('debate');
      state = run(state, { type: 'startVoting' }, vote('p0', side), { type: 'reveal' }, { type: 'nextRound' });
      expect(state.votes).toEqual({});
    }
    expect(state.phase).toBe('finished');
    expect(scoreFor(state, 'p0')).toBe(2 * POINTS_FOR_CORRECT);
    expect(standings(state)[0].correctCount).toBe(2);
  });

  it('shares ranks on ties', () => {
    const players = makePlayers(3);
    const state = run(
      createGame(players, makeRounds(['a']), 30),
      { type: 'startVoting' },
      vote('p0', 'a'),
      vote('p1', 'b'),
      vote('p2', 'a'),
      { type: 'reveal' },
    );
    expect(standings(state).map((s) => s.rank)).toEqual([1, 1, 3]);
    expect(standings(state).map((s) => s.player.id)).toEqual(['p0', 'p2', 'p1']);
    expect(winners(state).map((p) => p.id)).toEqual(['p0', 'p2']);
  });
});

describe('question picker', () => {
  const space = QUESTIONS.filter((q) => q.category === 'space');

  it('picks only selected categories', () => {
    const picked = pickQuestions(QUESTIONS, 5, ['space'], new Set(), seeded(1));
    expect(picked).toHaveLength(5);
    expect(picked.every((r) => r.question.category === 'space')).toBe(true);
  });

  it('prefers unseen questions', () => {
    const seen = new Set(space.slice(0, -2).map((q) => q.prompt));
    const picked = pickQuestions(QUESTIONS, 2, ['space'], seen, seeded(2));
    expect(new Set(picked.map((r) => r.question.prompt))).toEqual(new Set(space.slice(-2).map((q) => q.prompt)));
  });

  it('falls back to seen questions when the pool runs out', () => {
    const picked = pickQuestions(QUESTIONS, space.length + 10, ['space'], new Set(space.map((q) => q.prompt)), seeded(3));
    expect(picked).toHaveLength(space.length);
    expect(new Set(picked.map((r) => r.question.prompt)).size).toBe(space.length);
  });

  it('places the correct answer on the correct side', () => {
    for (const round of pickQuestions(QUESTIONS, 20, [], new Set(), seeded(4))) {
      expect(answerFor(round, round.correctSide)).toBe(round.question.correct);
      expect(answerFor(round, round.correctSide === 'a' ? 'b' : 'a')).toBe(round.question.wrong);
    }
  });

  it('uses every question when no category is selected', () => {
    expect(questionPool(QUESTIONS, [])).toHaveLength(QUESTIONS.length);
  });

  it('resets seen questions once the pool is exhausted', () => {
    let seen = markSeen(new Set(), space.slice(0, -1).map((q) => q.prompt), space);
    expect(seen.size).toBe(space.length - 1);

    const last = space[space.length - 1].prompt;
    seen = markSeen(seen, [last], space);
    expect([...seen]).toEqual([last]);
  });
});

describe('question bank', () => {
  it('has questions in every category', () => {
    for (const category of CATEGORIES) {
      expect(QUESTIONS.some((q) => q.category === category.id), category.id).toBe(true);
    }
  });

  it('has unique prompts', () => {
    expect(new Set(QUESTIONS.map((q) => q.prompt)).size).toBe(QUESTIONS.length);
  });

  it('has distinct, non-empty answers and facts', () => {
    for (const q of QUESTIONS) {
      expect(q.correct && q.wrong && q.fact, q.prompt).toBeTruthy();
      expect(q.correct, q.prompt).not.toBe(q.wrong);
    }
  });
});
