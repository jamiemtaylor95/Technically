import { makeId, type Player, type RoundQuestion, type Side } from './types';

export const POINTS_FOR_CORRECT = 100;
export const UNDERDOG_POINTS = 50;

export type Phase =
  /** The group argues while the timer runs. */
  | 'debate'
  /** Everyone locks in a side. */
  | 'vote'
  /** The real answer and a fun fact. */
  | 'reveal'
  | 'finished';

export interface RoundOutcome {
  correctSide: Side;
  points: Record<string, number>;
  /** True when the people who got it right were outnumbered. */
  underdogBonus: boolean;
}

export interface GameState {
  id: string;
  players: Player[];
  rounds: RoundQuestion[];
  timerSeconds: number;
  roundIndex: number;
  phase: Phase;
  votes: Record<string, Side>;
  scores: Record<string, number>;
  correctCounts: Record<string, number>;
  lastOutcome: RoundOutcome | null;
}

export type GameAction =
  | { type: 'startVoting' }
  | { type: 'vote'; playerId: string; side: Side }
  | { type: 'reveal' }
  | { type: 'nextRound' }
  | { type: 'restart'; state: GameState };

export function createGame(players: Player[], rounds: RoundQuestion[], timerSeconds: number): GameState {
  return {
    id: makeId(),
    players,
    rounds,
    timerSeconds,
    roundIndex: 0,
    phase: rounds.length === 0 || players.length === 0 ? 'finished' : 'debate',
    votes: {},
    scores: {},
    correctCounts: {},
    lastOutcome: null,
  };
}

export function currentRound(state: GameState): RoundQuestion | undefined {
  return state.rounds[state.roundIndex];
}

export function isLastRound(state: GameState): boolean {
  return state.roundIndex >= state.rounds.length - 1;
}

export function allVotesIn(state: GameState): boolean {
  return state.players.every((p) => state.votes[p.id] !== undefined);
}

export function votersFor(state: GameState, side: Side): Player[] {
  return state.players.filter((p) => state.votes[p.id] === side);
}

export function scoreFor(state: GameState, playerId: string): number {
  return state.scores[playerId] ?? 0;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'startVoting':
      return state.phase === 'debate' ? { ...state, phase: 'vote' } : state;

    case 'vote':
      if (state.phase !== 'vote') return state;
      return { ...state, votes: { ...state.votes, [action.playerId]: action.side } };

    case 'reveal': {
      const round = currentRound(state);
      if (state.phase !== 'vote' || !round || !allVotesIn(state)) return state;

      const right = votersFor(state, round.correctSide);
      const underdog = right.length > 0 && right.length * 2 < state.players.length;
      const award = POINTS_FOR_CORRECT + (underdog ? UNDERDOG_POINTS : 0);

      const points: Record<string, number> = {};
      const scores = { ...state.scores };
      const correctCounts = { ...state.correctCounts };
      for (const player of right) {
        points[player.id] = award;
        scores[player.id] = (scores[player.id] ?? 0) + award;
        correctCounts[player.id] = (correctCounts[player.id] ?? 0) + 1;
      }

      return {
        ...state,
        scores,
        correctCounts,
        lastOutcome: { correctSide: round.correctSide, points, underdogBonus: underdog },
        phase: 'reveal',
      };
    }

    case 'nextRound': {
      if (state.phase !== 'reveal') return state;
      const roundIndex = state.roundIndex + 1;
      return {
        ...state,
        votes: {},
        lastOutcome: null,
        roundIndex,
        phase: roundIndex < state.rounds.length ? 'debate' : 'finished',
      };
    }

    case 'restart':
      return action.state;
  }
}

export interface Standing {
  player: Player;
  score: number;
  correctCount: number;
  rank: number;
}

/** Players ordered by score. Tied players share a rank. */
export function standings(state: GameState): Standing[] {
  const sorted = state.players
    .map((player, index) => ({ player, index, score: scoreFor(state, player.id) }))
    .sort((l, r) => (l.score !== r.score ? r.score - l.score : l.index - r.index));

  const result: Standing[] = [];
  sorted.forEach(({ player, score }, index) => {
    const previous = result[result.length - 1];
    result.push({
      player,
      score,
      correctCount: state.correctCounts[player.id] ?? 0,
      rank: previous && previous.score === score ? previous.rank : index + 1,
    });
  });
  return result;
}

export function winners(state: GameState): Player[] {
  return standings(state)
    .filter((s) => s.rank === 1)
    .map((s) => s.player);
}
