import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { categoryTitle, type Question, type Side } from '../game/types';
import { colors, fonts, sideColor } from '../theme';

/** The light card that shows a question, styled like the phone screen in the ad. */
export function QuestionCard({ question, compact = false }: { question: Question; compact?: boolean }) {
  return (
    <View style={[styles.card, { padding: compact ? 18 : 24, gap: compact ? 8 : 12 }]}>
      <View style={styles.tag}>
        <Ionicons name="pricetag" size={11} color="rgba(20,33,84,0.6)" />
        <Text style={styles.tagText}>{categoryTitle(question.category).toUpperCase()}</Text>
      </View>
      {!compact && (
        <Text style={styles.emoji} accessible={false}>
          {question.emoji}
        </Text>
      )}
      <Text style={[styles.prompt, { fontSize: compact ? 20 : 26, lineHeight: compact ? 25 : 32 }]}>
        {question.prompt}
      </Text>
    </View>
  );
}

export type AnswerStatus = 'neutral' | 'correct' | 'wrong';

/** A blue or purple answer block. */
export function AnswerTile({ side, text, status = 'neutral' }: { side: Side; text: string; status?: AnswerStatus }) {
  return (
    <View
      style={[
        styles.tile,
        { backgroundColor: sideColor(side), opacity: status === 'wrong' ? 0.35 : 1 },
        status === 'correct' && styles.tileCorrect,
      ]}
      accessible
      accessibilityLabel={`Answer ${side.toUpperCase()}: ${text}${status === 'correct' ? ', correct' : ''}`}
    >
      <Text style={styles.tileLabel}>{side.toUpperCase()}</Text>
      <Text style={styles.tileText} numberOfLines={3} adjustsFontSizeToFit>
        {text}
      </Text>
      {status !== 'neutral' && (
        <View style={styles.badge}>
          <Ionicons
            name={status === 'correct' ? 'checkmark-circle' : 'close-circle'}
            size={32}
            color={status === 'correct' ? colors.green : colors.red}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tagText: { fontFamily: fonts.extraBold, fontSize: 12, color: 'rgba(20,33,84,0.6)', letterSpacing: 0.5 },
  emoji: { fontSize: 84, lineHeight: 100 },
  prompt: { fontFamily: fonts.black, color: colors.navyDeep, textAlign: 'center' },
  tile: {
    flex: 1,
    minHeight: 100,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tileCorrect: {
    borderWidth: 4,
    borderColor: colors.yellow,
  },
  tileLabel: { fontFamily: fonts.black, fontSize: 14, color: 'rgba(255,255,255,0.75)' },
  tileText: { fontFamily: fonts.black, fontSize: 22, color: colors.white, textAlign: 'center' },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.white,
    borderRadius: 18,
  },
});
