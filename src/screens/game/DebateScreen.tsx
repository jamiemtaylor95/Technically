import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/Button';
import { AnswerTile, QuestionCard } from '../../components/QuestionCard';
import { answerFor, SIDES, type RoundQuestion } from '../../game/types';
import { colors, fonts } from '../../theme';

/**
 * Phase 1: show the question and both answers, and let the group argue
 * until the timer runs out.
 */
export function DebateScreen({
  round,
  timerSeconds,
  onVote,
}: {
  round: RoundQuestion;
  timerSeconds: number;
  onVote: () => void;
}) {
  const [remaining, setRemaining] = useState(timerSeconds);
  const timeUp = remaining <= 0;

  useEffect(() => {
    const interval = setInterval(() => setRemaining((r) => Math.max(r - 1, 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (remaining === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    } else if (remaining <= 5) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }, [remaining]);

  return (
    <View style={styles.container}>
      <TimerBar remaining={remaining} total={timerSeconds} />

      <ScrollView contentContainerStyle={styles.content}>
        <QuestionCard question={round.question} />

        <View style={styles.answers}>
          {SIDES.map((side) => (
            <AnswerTile key={side} side={side} text={answerFor(round, side)} />
          ))}
        </View>

        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={[styles.headline, timeUp && { color: colors.yellow }]}>
            {timeUp ? "Time's up!" : 'Argue it out!'}
          </Text>
          <Text style={styles.subhead}>
            {timeUp ? 'Lock in your votes.' : 'Make your case before the timer runs out.'}
          </Text>
        </View>
      </ScrollView>

      <PrimaryButton title={timeUp ? 'Vote Now' : 'Done Arguing? Vote'} onPress={onVote} />
    </View>
  );
}

function TimerBar({ remaining, total }: { remaining: number; total: number }) {
  const progress = useRef(new Animated.Value(1)).current;
  const hurry = remaining <= 5;
  const tint = hurry ? colors.red : colors.yellow;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: total > 0 ? remaining / total : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [remaining, total, progress]);

  return (
    <View
      style={styles.timer}
      accessible
      accessibilityRole="timer"
      accessibilityLabel={`${remaining} seconds left`}
    >
      <Ionicons name="stopwatch" size={24} color={hurry ? colors.red : colors.white} />
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: tint,
              width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            },
          ]}
        />
      </View>
      <Text style={[styles.seconds, { color: hurry ? colors.red : colors.white }]}>{remaining}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 16 },
  content: { gap: 20, paddingBottom: 12 },
  answers: { flexDirection: 'row', gap: 12 },
  headline: { fontFamily: fonts.black, fontSize: 26, color: colors.white },
  subhead: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.muted, textAlign: 'center' },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  track: { flex: 1, height: 12, borderRadius: 6, backgroundColor: colors.surface, overflow: 'hidden' },
  fill: { height: 12, borderRadius: 6 },
  seconds: { fontFamily: fonts.black, fontSize: 22, minWidth: 34, textAlign: 'right', fontVariant: ['tabular-nums'] },
});
