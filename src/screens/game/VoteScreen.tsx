import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Bouncy, PrimaryButton } from '../../components/Button';
import { Avatar, AvatarStack } from '../../components/Decorations';
import { AnswerTile, QuestionCard } from '../../components/QuestionCard';
import { allVotesIn, votersFor, type GameState } from '../../game/session';
import { answerFor, SIDES, type Player, type RoundQuestion, type Side } from '../../game/types';
import { colors, fonts, sideColor } from '../../theme';

/** Phase 2: pass the phone around and have everyone lock in a side. */
export function VoteScreen({
  state,
  round,
  onVote,
  onReveal,
}: {
  state: GameState;
  round: RoundQuestion;
  onVote: (playerId: string, side: Side) => void;
  onReveal: () => void;
}) {
  const solo = state.players.length === 1;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <QuestionCard question={round.question} compact />

        <View style={styles.answers}>
          {SIDES.map((side) => (
            <View key={side} style={{ flex: 1, gap: 10, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
                <AnswerTile side={side} text={answerFor(round, side)} />
              </View>
              <AvatarStack players={votersFor(state, side)} />
            </View>
          ))}
        </View>

        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text style={styles.headline}>Pick a side!</Text>
          <Text style={styles.subhead}>
            {solo ? 'Lock in your answer.' : 'Pass the phone around. Everyone locks in an answer.'}
          </Text>
        </View>

        <View style={{ gap: 10 }}>
          {state.players.map((player) => (
            <VoteRow
              key={player.id}
              player={player}
              selection={state.votes[player.id]}
              onVote={(side) => onVote(player.id, side)}
            />
          ))}
        </View>
      </ScrollView>

      <PrimaryButton title="Reveal the Answer" disabled={!allVotesIn(state)} onPress={onReveal} />
    </View>
  );
}

function VoteRow({ player, selection, onVote }: { player: Player; selection?: Side; onVote: (side: Side) => void }) {
  return (
    <View style={styles.row}>
      <Avatar player={player} size={38} />
      <Text style={styles.name} numberOfLines={1}>
        {player.name}
      </Text>
      {SIDES.map((side) => {
        const selected = selection === side;
        const color = sideColor(side);
        return (
          <Bouncy
            key={side}
            onPress={() => onVote(side)}
            selected={selected}
            accessibilityLabel={`${player.name} votes ${side.toUpperCase()}`}
            style={[styles.choice, { borderColor: color, backgroundColor: selected ? color : `${color}1F` }]}
          >
            <Text style={[styles.choiceText, { color: selected ? colors.white : color }]}>{side.toUpperCase()}</Text>
          </Bouncy>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 16 },
  content: { gap: 18, paddingBottom: 12 },
  answers: { flexDirection: 'row', gap: 12 },
  headline: { fontFamily: fonts.black, fontSize: 24, color: colors.white },
  subhead: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.muted, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  name: { flex: 1, fontFamily: fonts.extraBold, fontSize: 18, color: colors.white },
  choice: {
    width: 54,
    height: 46,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceText: { fontFamily: fonts.black, fontSize: 20 },
});
