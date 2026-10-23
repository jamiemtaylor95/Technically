import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from '@expo-google-fonts/nunito';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Modal, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Background } from './src/components/Background';
import { SlideIn } from './src/components/Layout';
import { markSeen, pickQuestions, questionPool } from './src/game/picker';
import { QUESTIONS } from './src/game/questions';
import { createGame, type GameState } from './src/game/session';
import { storage } from './src/game/storage';
import type { GameSettings, Player } from './src/game/types';
import { HomeScreen } from './src/screens/HomeScreen';
import { HowToPlayScreen } from './src/screens/HowToPlayScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { GameScreen } from './src/screens/game/GameScreen';
import { colors } from './src/theme';

type Screen = { name: 'home' } | { name: 'setup' } | { name: 'game'; game: GameState; players: Player[]; settings: GameSettings };

/** Picks fresh questions and starts a game, remembering what's been played. */
async function newGame(players: Player[], settings: GameSettings): Promise<GameState> {
  const seen = await storage.loadSeen();
  const rounds = pickQuestions(QUESTIONS, settings.rounds, settings.categories, seen);
  await storage.saveSeen(
    markSeen(
      seen,
      rounds.map((r) => r.question.prompt),
      questionPool(QUESTIONS, settings.categories),
    ),
  );
  return createGame(players, rounds, settings.timerSeconds);
}

export default function App() {
  const [fontsLoaded] = useFonts({ Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black });
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: colors.navyDeep }}>
        <Background />
        {fontsLoaded && (
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            {screen.name === 'home' && (
              <SlideIn key="home">
                <HomeScreen onPlay={() => setScreen({ name: 'setup' })} onHowToPlay={() => setShowHowToPlay(true)} />
              </SlideIn>
            )}
            {screen.name === 'setup' && (
              <SlideIn key="setup">
                <SetupScreen
                  onBack={() => setScreen({ name: 'home' })}
                  onStart={async (players, settings) =>
                    setScreen({ name: 'game', game: await newGame(players, settings), players, settings })
                  }
                />
              </SlideIn>
            )}
            {screen.name === 'game' && (
              <GameScreen
                key={screen.game.id}
                initialState={screen.game}
                makeRematch={() => newGame(screen.players, screen.settings)}
                onExit={() => setScreen({ name: 'home' })}
              />
            )}
          </SafeAreaView>
        )}

        <Modal
          visible={showHowToPlay}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowHowToPlay(false)}
        >
          <View style={{ flex: 1, backgroundColor: colors.navyDeep }}>
            <Background />
            <HowToPlayScreen onClose={() => setShowHowToPlay(false)} />
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
}
