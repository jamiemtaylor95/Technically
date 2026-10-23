import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS, type GameSettings, type Player } from './types';

const KEYS = {
  players: 'players',
  settings: 'settings',
  seen: 'seenQuestionIDs',
};

async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function write(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Losing a saved preference isn't worth interrupting the game over.
  }
}

/** Remembers the last group, their settings, and which questions they've seen. */
export const storage = {
  loadPlayers: () => read<Player[]>(KEYS.players, []),
  savePlayers: (players: Player[]) => write(KEYS.players, players),

  loadSettings: async (): Promise<GameSettings> => ({
    ...DEFAULT_SETTINGS,
    ...(await read<Partial<GameSettings>>(KEYS.settings, {})),
  }),
  saveSettings: (settings: GameSettings) => write(KEYS.settings, settings),

  loadSeen: async () => new Set(await read<string[]>(KEYS.seen, [])),
  saveSeen: (seen: Set<string>) => write(KEYS.seen, [...seen]),
};
