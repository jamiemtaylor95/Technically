import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/Button';
import { POINTS_FOR_CORRECT, UNDERDOG_POINTS } from '../game/session';
import { colors, fonts } from '../theme';

const STEPS = [
  {
    icon: <Ionicons name="chatbubbles" size={24} color={colors.yellow} />,
    title: 'Debate your take',
    detail:
      "Every question has two answers: the one everyone assumes and the one that's technically true. Argue about which is which.",
  },
  {
    icon: <Ionicons name="stopwatch" size={24} color={colors.white} />,
    title: 'Beat the timer',
    detail: "You only get so long to make your case. When time's up, or when you're done yelling, it's time to vote.",
  },
  {
    icon: <Ionicons name="hand-left" size={24} color={colors.blue} />,
    title: 'Lock in your answer',
    detail: 'Pass the phone around. Everyone picks A or B.',
  },
  {
    icon: <Ionicons name="trophy" size={22} color={colors.yellow} />,
    title: 'See the real answer',
    detail: `Right answers score ${POINTS_FOR_CORRECT} points. Side with the minority and win, and you get a +${UNDERDOG_POINTS} underdog bonus.`,
  },
  {
    icon: <MaterialCommunityIcons name="brain" size={24} color={colors.pink} />,
    title: 'Learn fun facts',
    detail: 'Every answer comes with the story behind it, so you can be insufferable at your next party.',
  },
];

export function HowToPlayScreen({ onClose }: { onClose: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title} accessibilityRole="header">
        How to Play
      </Text>
      {STEPS.map((step, i) => (
        <View key={step.title} style={styles.step} accessible>
          <View style={styles.circle}>{step.icon}</View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.stepTitle}>
              {i + 1}. {step.title}
            </Text>
            <Text style={styles.stepDetail}>{step.detail}</Text>
          </View>
        </View>
      ))}
      <View style={{ marginTop: 8 }}>
        <PrimaryButton title="Got It" onPress={onClose} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 32, gap: 22 },
  title: { fontFamily: fonts.black, fontSize: 34, color: colors.white },
  step: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.stroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: { fontFamily: fonts.black, fontSize: 19, color: colors.white },
  stepDetail: { fontFamily: fonts.semiBold, fontSize: 15, lineHeight: 21, color: 'rgba(255,255,255,0.75)' },
});
