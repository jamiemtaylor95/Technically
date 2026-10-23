import { useReducer } from 'react';
import { Alert, Platform, View } from 'react-native';

import { SlideIn, TopBar } from '../../components/Layout';
import { currentRound, gameReducer, type GameState } from '../../game/session';
import { DebateScreen } from './DebateScreen';
import { ResultsScreen } from './ResultsScreen';
import { RevealScreen } from './RevealScreen';
import { VoteScreen } from './VoteScreen';

/** Hosts a whole game, from the first debate to the final scoreboard. */
export function GameScreen({
  initialState,
  makeRematch,
  onExit,
}: {
  initialState: GameState;
  makeRematch: () => Promise<GameState>;
  onExit: () => void;
}) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const round = currentRound(state);

  const confirmQuit = () => {
    if (Platform.OS === 'web') {
      onExit();
      return;
    }
    Alert.alert('Quit this game?', 'Scores for this game will be lost.', [
      { text: 'Keep Playing', style: 'cancel' },
      { text: 'Quit Game', style: 'destructive', onPress: onExit },
    ]);
  };

  // Remounting on every step replays the slide-in and resets per-phase state.
  const stepKey = `${state.id}-${state.roundIndex}-${state.phase}`;

  let content = null;
  if (state.phase === 'finished' || !round) {
    content = (
      <ResultsScreen
        state={state}
        onPlayAgain={async () => dispatch({ type: 'restart', state: await makeRematch() })}
        onExit={onExit}
      />
    );
  } else if (state.phase === 'debate') {
    content = (
      <DebateScreen round={round} timerSeconds={state.timerSeconds} onVote={() => dispatch({ type: 'startVoting' })} />
    );
  } else if (state.phase === 'vote') {
    content = (
      <VoteScreen
        state={state}
        round={round}
        onVote={(playerId, side) => dispatch({ type: 'vote', playerId, side })}
        onReveal={() => dispatch({ type: 'reveal' })}
      />
    );
  } else if (state.lastOutcome) {
    content = (
      <RevealScreen
        state={state}
        round={round}
        outcome={state.lastOutcome}
        onNext={() => dispatch({ type: 'nextRound' })}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {state.phase !== 'finished' && (
        <TopBar
          title={`Question ${state.roundIndex + 1} of ${state.rounds.length}`}
          icon="close"
          onIconPress={confirmQuit}
          iconLabel="Quit game"
        />
      )}
      <SlideIn key={stepKey}>{content}</SlideIn>
    </View>
  );
}
