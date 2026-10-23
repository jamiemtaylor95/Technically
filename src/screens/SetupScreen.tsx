import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Bouncy, PrimaryButton } from '../components/Button';
import { Avatar } from '../components/Decorations';
import { TopBar } from '../components/Layout';
import { questionPool } from '../game/picker';
import { QUESTIONS } from '../game/questions';
import { storage } from '../game/storage';
import {
  CATEGORIES,
  DEFAULT_SETTINGS,
  makeId,
  MAX_PLAYERS,
  ROUND_OPTIONS,
  TIMER_OPTIONS,
  type Category,
  type GameSettings,
  type Player,
} from '../game/types';
import { colors, fonts, playerColors } from '../theme';

export function SetupScreen({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (players: Player[], settings: GameSettings) => void;
}) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    Promise.all([storage.loadPlayers(), storage.loadSettings()]).then(([savedPlayers, savedSettings]) => {
      setPlayers(savedPlayers);
      setSettings(savedSettings);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) storage.savePlayers(players);
  }, [players, loaded]);

  useEffect(() => {
    if (loaded) storage.saveSettings(settings);
  }, [settings, loaded]);

  const canAdd = newName.trim().length > 0 && players.length < MAX_PLAYERS;

  const addPlayer = (name = newName) => {
    const trimmed = name.trim();
    if (!trimmed || players.length >= MAX_PLAYERS) return;
    const used = new Set(players.map((p) => p.colorIndex));
    const free = playerColors.findIndex((_, i) => !used.has(i));
    const colorIndex = free >= 0 ? free : players.length;
    setPlayers([...players, { id: makeId(), name: trimmed, colorIndex }]);
    setNewName('');
  };

  const toggleCategory = (id: Category) => {
    const on = settings.categories.includes(id);
    // Keep at least one category selected.
    if (on && settings.categories.length === 1) return;
    setSettings({
      ...settings,
      categories: on ? settings.categories.filter((c) => c !== id) : [...settings.categories, id],
    });
  };

  const available = questionPool(QUESTIONS, settings.categories).length;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TopBar title="Game Setup" icon="chevron-back" onIconPress={onBack} iconLabel="Back" />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive">
        <Section title="Who's arguing?" subtitle={`${players.length} of ${MAX_PLAYERS} players`}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Add a player"
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              submitBehavior="submit"
              onSubmitEditing={(e) => addPlayer(e.nativeEvent.text)}
              maxLength={20}
              keyboardAppearance="dark"
            />
            <Bouncy
              onPress={() => addPlayer()}
              disabled={!canAdd}
              style={[styles.addButton, { opacity: canAdd ? 1 : 0.4 }]}
              accessibilityLabel="Add player"
            >
              <Ionicons name="add" size={28} color={colors.navyDeep} />
            </Bouncy>
          </View>

          {players.length === 0 ? (
            <Text style={styles.hint}>Add at least one player. More is better: someone has to be wrong.</Text>
          ) : (
            <View style={{ gap: 8 }}>
              {players.map((player) => (
                <View key={player.id} style={styles.playerRow}>
                  <Avatar player={player} size={34} />
                  <Text style={styles.playerName} numberOfLines={1}>
                    {player.name}
                  </Text>
                  <Bouncy
                    onPress={() => setPlayers(players.filter((p) => p.id !== player.id))}
                    accessibilityLabel={`Remove ${player.name}`}
                  >
                    <Ionicons name="close-circle" size={24} color="rgba(255,255,255,0.4)" />
                  </Bouncy>
                </View>
              ))}
            </View>
          )}
        </Section>

        <Section title="Questions" subtitle="How many rounds to play">
          <OptionPicker
            options={ROUND_OPTIONS}
            value={settings.rounds}
            onChange={(rounds) => setSettings({ ...settings, rounds })}
            label={(n) => `${n}`}
          />
        </Section>

        <Section title="Debate timer" subtitle="Time to argue before voting">
          <OptionPicker
            options={TIMER_OPTIONS}
            value={settings.timerSeconds}
            onChange={(timerSeconds) => setSettings({ ...settings, timerSeconds })}
            label={(n) => `${n}s`}
          />
        </Section>

        <Section title="Categories" subtitle="Pick what to argue about">
          <View style={styles.grid}>
            {CATEGORIES.map((category) => {
              const on = settings.categories.includes(category.id);
              return (
                <View key={category.id} style={styles.categoryCell}>
                <Bouncy
                  onPress={() => toggleCategory(category.id)}
                  selected={on}
                  accessibilityLabel={category.title}
                  style={[styles.category, on && styles.categoryOn]}
                >
                  <Text style={{ fontSize: 18 }}>{category.emoji}</Text>
                  <Text style={styles.categoryText}>{category.title}</Text>
                  <Ionicons
                    name={on ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={on ? colors.yellow : 'rgba(255,255,255,0.3)'}
                  />
                </Bouncy>
                </View>
              );
            })}
          </View>
          <Text style={styles.hint}>{available} questions available</Text>
        </Section>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Start Game" disabled={players.length === 0} onPress={() => onStart(players, settings)} />
      </View>
    </KeyboardAvoidingView>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ gap: 2 }}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {title}
        </Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );
}

/** A row of chunky pill buttons for picking one value. */
function OptionPicker({
  options,
  value,
  onChange,
  label,
}: {
  options: number[];
  value: number;
  onChange: (value: number) => void;
  label: (value: number) => string;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <View key={option} style={{ flex: 1 }}>
            <Bouncy
              onPress={() => onChange(option)}
              selected={selected}
              accessibilityLabel={label(option)}
              style={[styles.option, { backgroundColor: selected ? colors.yellow : colors.surface }]}
            >
              <Text style={[styles.optionText, { color: selected ? colors.navyDeep : colors.white }]}>
                {label(option)}
              </Text>
            </Bouncy>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24, gap: 24 },
  sectionTitle: { fontFamily: fonts.black, fontSize: 22, color: colors.white },
  sectionSubtitle: { fontFamily: fonts.semiBold, fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  input: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.white,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: { fontFamily: fonts.semiBold, fontSize: 14, color: 'rgba(255,255,255,0.55)' },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  playerName: { flex: 1, fontFamily: fonts.extraBold, fontSize: 17, color: colors.white },
  option: { borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  optionText: { fontFamily: fonts.black, fontSize: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCell: { width: '48%', flexGrow: 1 },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: colors.surface,
  },
  categoryOn: { backgroundColor: 'rgba(255,214,59,0.15)', borderColor: 'rgba(255,214,59,0.7)' },
  categoryText: { flex: 1, fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
});
