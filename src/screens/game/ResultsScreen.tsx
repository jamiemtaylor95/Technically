import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, SecondaryButton } from '../../components/Button';
import { Avatar, SparkBurst } from '../../components/Decorations';
import { standings, winners, type GameState, type Standing } from '../../game/session';
import { colors, fonts } from '../../theme';

/** The final scoreboard. */
export function ResultsScreen({
  state,
  onPlayAgain,
  onExit,
}: {
  state: GameState;
  onPlayAgain: () => void;
  onExit: () => void;
}) {
  const pop = useRef(new Animated.Value(0)).current;
  const ranking = standings(state);
  const top = winners(state);
  const solo = state.players.length === 1;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, speed: 6, bounciness: 14, delay: 150 }).start();
  }, [pop]);

  const title = solo ? 'Final score' : top.length === 1 ? `${top[0].name} wins!` : "It's a tie!";
  const subtitle = solo
    ? `You got ${ranking[0]?.correctCount ?? 0} of ${state.rounds.length} right.`
    : 'Technically the smartest person in the room.';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View
          style={[
            styles.trophyWrap,
            { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }] },
          ]}
        >
          <View style={styles.burst}>
            <SparkBurst count={5} spread={140} length={22} />
          </View>
          <Ionicons name="trophy" size={88} color={colors.yellow} />
        </Animated.View>

        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={{ gap: 10 }}>
          {ranking.map((standing) => (
            <StandingRow key={standing.player.id} standing={standing} total={state.rounds.length} />
          ))}
        </View>
      </ScrollView>

      <View style={{ gap: 12 }}>
        <PrimaryButton title="Play Again" onPress={onPlayAgain} />
        <SecondaryButton title="Back to Home" onPress={onExit} />
      </View>
    </View>
  );
}

function StandingRow({ standing, total }: { standing: Standing; total: number }) {
  const leader = standing.rank === 1;
  return (
    <View style={[styles.row, leader && styles.rowLeader]} accessible>
      <View style={[styles.rank, { backgroundColor: leader ? colors.yellow : colors.surface }]}>
        <Text style={[styles.rankText, { color: leader ? colors.navyDeep : colors.muted }]}>{standing.rank}</Text>
      </View>
      <Avatar player={standing.player} size={40} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>
          {standing.player.name}
        </Text>
        <Text style={styles.correct}>
          {standing.correctCount}/{total} correct
        </Text>
      </View>
      <Text style={[styles.score, { color: leader ? colors.yellow : colors.white }]}>{standing.score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingBottom: 8, gap: 16 },
  content: { gap: 22, paddingBottom: 12 },
  trophyWrap: { alignItems: 'center', justifyContent: 'center', marginTop: 72, height: 110 },
  burst: { position: 'absolute', top: -40 },
  title: { fontFamily: fonts.black, fontSize: 36, color: colors.white, textAlign: 'center' },
  subtitle: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.muted, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  rowLeader: { backgroundColor: 'rgba(255,214,59,0.12)', borderColor: 'rgba(255,214,59,0.6)' },
  rank: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontFamily: fonts.black, fontSize: 18 },
  name: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.white },
  correct: { fontFamily: fonts.semiBold, fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  score: { fontFamily: fonts.black, fontSize: 24, fontVariant: ['tabular-nums'] },
});
