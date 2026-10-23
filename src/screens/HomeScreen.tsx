import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Bouncy, PrimaryButton, SecondaryButton } from '../components/Button';
import { SparkBurst, Squiggle, TitleLogo } from '../components/Decorations';
import { QUESTIONS } from '../game/questions';
import { colors, fonts } from '../theme';

export function HomeScreen({
  onPlay,
  onHowToPlay,
  onAbout,
}: {
  onPlay: () => void;
  onHowToPlay: () => void;
  onAbout: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content} bounces={false}>
      <View style={styles.header}>
        <View>
          <TitleLogo size={58} />
          <View style={styles.spark}>
            <SparkBurst rotate={40} spread={80} />
          </View>
        </View>

        <View style={{ alignItems: 'center', gap: 2 }}>
          <Text style={styles.tagline}>Argue first. Find out who’s right.</Text>
          <Squiggle width={220} />
        </View>

        <Text style={styles.subtitle}>
          A party game for people who love being right about{' '}
          <Text style={{ color: colors.yellow, fontFamily: fonts.black }}>ridiculous</Text> things.
        </Text>
      </View>

      <SampleQuestion />
      <FeatureRow />

      <View style={{ gap: 14 }}>
        <PrimaryButton title="Play Now" onPress={onPlay} />
        <SecondaryButton title="How to Play" onPress={onHowToPlay} />
      </View>

      <View style={{ alignItems: 'center', gap: 2 }}>
        <Text style={styles.footer}>Smart. Silly. Seriously Fun.</Text>
        <Squiggle width={180} height={6} strokeWidth={3} />
      </View>

      <Bouncy onPress={onAbout} style={styles.about} accessibilityLabel="About and privacy">
        <Ionicons name="information-circle-outline" size={16} color={colors.faint} />
        <Text style={styles.aboutText}>About & Privacy</Text>
      </Bouncy>
    </ScrollView>
  );
}

/** A tilted mini "phone screen" teasing the crab question from the ad. */
function SampleQuestion() {
  const [revealed, setRevealed] = useState(false);
  const question = QUESTIONS[0];

  return (
    <Bouncy
      onPress={() => setRevealed((r) => !r)}
      style={styles.phone}
      accessibilityLabel={`Sample question: ${question.prompt}. Tap to ${revealed ? 'hide' : 'show'} the answer.`}
    >
      <View style={styles.timerRow}>
        <Ionicons name="stopwatch-outline" size={18} color={colors.navyDeep} />
        <View style={styles.timerTrack}>
          <View style={styles.timerFill} />
        </View>
      </View>
      <Text style={styles.phonePrompt}>{question.prompt}</Text>
      <Text style={styles.phoneEmoji}>{question.emoji}</Text>
      <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'stretch' }}>
        <View style={[styles.phoneAnswer, { backgroundColor: colors.blue }]}>
          <Text style={styles.phoneAnswerText}>{revealed ? question.wrong : '?'}</Text>
        </View>
        <View
          style={[
            styles.phoneAnswer,
            { backgroundColor: colors.purple },
            revealed && { borderWidth: 3, borderColor: colors.yellow },
          ]}
        >
          <Text style={styles.phoneAnswerText}>{revealed ? question.correct : '?'}</Text>
        </View>
      </View>
      <Text style={styles.phoneHint}>{revealed ? 'Technically, the claws are legs too!' : 'Tap to peek'}</Text>
    </Bouncy>
  );
}

const FEATURES = [
  { icon: <Ionicons name="chatbubbles" size={28} color={colors.yellow} />, title: 'Debate\nYour Take' },
  { icon: <Ionicons name="stopwatch" size={28} color={colors.white} />, title: 'Beat\nthe Timer' },
  { icon: <Ionicons name="trophy" size={26} color={colors.yellow} />, title: 'See the\nReal Answer' },
  { icon: <MaterialCommunityIcons name="brain" size={28} color={colors.pink} />, title: 'Learn\nFun Facts' },
];

function FeatureRow() {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {FEATURES.map((f) => (
        <View key={f.title} style={{ flex: 1, alignItems: 'center', gap: 8 }} accessible>
          <View style={styles.featureCircle}>{f.icon}</View>
          <Text style={styles.featureText}>{f.title}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingVertical: 24, gap: 28 },
  header: { alignItems: 'center', gap: 18 },
  spark: { position: 'absolute', right: -14, top: -26 },
  tagline: {
    fontFamily: fonts.black,
    fontSize: 22,
    color: colors.white,
    textAlign: 'center',
    transform: [{ rotate: '-2deg' }],
  },
  subtitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  phone: {
    alignSelf: 'center',
    width: 270,
    padding: 18,
    gap: 10,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 30,
    borderWidth: 6,
    borderColor: '#111',
    transform: [{ rotate: '4deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'stretch' },
  timerTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: 'rgba(20,33,84,0.15)' },
  timerFill: { width: '55%', height: 8, borderRadius: 4, backgroundColor: colors.yellow },
  phonePrompt: { fontFamily: fonts.black, fontSize: 19, color: colors.navyDeep, textAlign: 'center' },
  phoneEmoji: { fontSize: 58, lineHeight: 70 },
  phoneAnswer: { flex: 1, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  phoneAnswerText: { fontFamily: fonts.black, fontSize: 26, color: colors.white },
  phoneHint: { fontFamily: fonts.extraBold, fontSize: 13, color: 'rgba(20,33,84,0.6)' },
  featureCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.stroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { fontFamily: fonts.extraBold, fontSize: 13, lineHeight: 16, color: colors.white, textAlign: 'center' },
  footer: { fontFamily: fonts.black, fontSize: 18, color: colors.white },
  about: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 4 },
  aboutText: { fontFamily: fonts.bold, fontSize: 14, color: colors.faint },
});
