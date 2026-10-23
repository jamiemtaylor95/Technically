import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/Button';
import { Avatar } from '../../components/Decorations';
import { AnswerTile, QuestionCard } from '../../components/QuestionCard';
import { isLastRound, UNDERDOG_POINTS, type GameState, type RoundOutcome } from '../../game/session';
import { answerFor, SIDES, type Player, type RoundQuestion } from '../../game/types';
import { colors, fonts } from '../../theme';

/** Phase 3: show the real answer, the fun fact, and who got it right. */
export function RevealScreen({
  state,
  round,
  outcome,
  onNext,
}: {
  state: GameState;
  round: RoundQuestion;
  outcome: RoundOutcome;
  onNext: () => void;
}) {
  const [shown, setShown] = useState(false);
  const appear = useRef(new Animated.Value(0)).current;
  const winners = state.players.filter((p) => outcome.points[p.id] !== undefined);

  useEffect(() => {
    // A short drumroll before the answer lands.
    const timeout = setTimeout(() => {
      setShown(true);
      Haptics.notificationAsync(
        winners.length > 0 ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
      ).catch(() => {});
      Animated.spring(appear, { toValue: 1, useNativeDriver: true, speed: 10, bounciness: 6 }).start();
    }, 700);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slideUp = {
    opacity: appear,
    transform: [{ translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Technically…</Text>

        <QuestionCard question={round.question} compact />

        <View style={styles.answers}>
          {SIDES.map((side) => (
            <AnswerTile
              key={side}
              side={side}
              text={answerFor(round, side)}
              status={shown ? (side === outcome.correctSide ? 'correct' : 'wrong') : 'neutral'}
            />
          ))}
        </View>

        <Animated.View style={[{ gap: 20 }, slideUp]}>
          <FactCard fact={round.question.fact} />
          <OutcomeBanner state={state} outcome={outcome} winners={winners} />
        </Animated.View>
      </ScrollView>

      <Animated.View style={{ opacity: appear }} pointerEvents={shown ? 'auto' : 'none'}>
        <PrimaryButton title={isLastRound(state) ? 'See Final Scores' : 'Next Question'} onPress={onNext} />
      </Animated.View>
    </View>
  );
}

function FactCard({ fact }: { fact: string }) {
  return (
    <View style={styles.fact} accessible>
      <View style={styles.factIcon}>
        <MaterialCommunityIcons name="brain" size={26} color={colors.pink} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.factLabel}>FUN FACT</Text>
        <Text style={styles.factText}>{fact}</Text>
      </View>
    </View>
  );
}

function OutcomeBanner({ state, outcome, winners }: { state: GameState; outcome: RoundOutcome; winners: Player[] }) {
  const group = state.players.length > 1;
  let headline: string;
  if (winners.length === 0) {
    headline = group ? "Nobody got it! Technically, you're all wrong." : "Not quite! Technically, that's wrong.";
  } else if (winners.length === state.players.length) {
    headline = group ? 'Everyone got it. Suspicious.' : 'Nailed it!';
  } else {
    headline = winners.length === 1 ? `${winners[0].name} was right!` : `${winners.length} players were right!`;
  }

  return (
    <View style={styles.banner}>
      <Text style={[styles.bannerTitle, { color: winners.length === 0 ? colors.red : colors.yellow }]}>{headline}</Text>

      {outcome.underdogBonus && (
        <View style={styles.underdog}>
          <Ionicons name="flame" size={16} color={colors.orange} />
          <Text style={styles.underdogText}>Underdog bonus! +{UNDERDOG_POINTS} for going against the crowd.</Text>
        </View>
      )}

      {winners.length > 0 && (
        <View style={styles.chips}>
          {winners.map((p) => (
            <View key={p.id} style={styles.chip}>
              <Avatar player={p} size={26} />
              <Text style={styles.chipName} numberOfLines={1}>
                {p.name}
              </Text>
              <Text style={styles.chipPoints}>+{outcome.points[p.id]}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 16 },
  content: { gap: 20, paddingBottom: 12 },
  title: {
    fontFamily: fonts.black,
    fontSize: 40,
    color: colors.white,
    textAlign: 'center',
    transform: [{ rotate: '-3deg' }],
  },
  answers: { flexDirection: 'row', gap: 12 },
  fact: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  factIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245,115,204,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  factLabel: { fontFamily: fonts.black, fontSize: 13, color: colors.pink, letterSpacing: 0.5 },
  factText: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 23, color: colors.white },
  banner: { padding: 16, borderRadius: 20, backgroundColor: colors.surface, gap: 12, alignItems: 'center' },
  bannerTitle: { fontFamily: fonts.black, fontSize: 20, textAlign: 'center' },
  underdog: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  underdogText: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.orange, flexShrink: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 6,
    paddingRight: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(51,204,122,0.14)',
  },
  chipName: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.white, maxWidth: 110 },
  chipPoints: { fontFamily: fonts.black, fontSize: 15, color: colors.green },
});
