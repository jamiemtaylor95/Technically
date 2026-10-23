import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Bouncy, PrimaryButton } from '../components/Button';
import { LINKS } from '../config';
import { QUESTIONS } from '../game/questions';
import { colors, fonts } from '../theme';

export function AboutScreen({ onClose }: { onClose: () => void }) {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title} accessibilityRole="header">
        About
      </Text>

      <Text style={styles.body}>
        Technically! is a party game for people who love being right about ridiculous things. It has {QUESTIONS.length}{' '}
        questions, each with the fun fact behind the answer.
      </Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="lock-closed" size={18} color={colors.yellow} />
          <Text style={styles.cardTitle}>Your privacy</Text>
        </View>
        <Text style={styles.body}>
          Technically! doesn’t collect, share, or sell any data. There are no accounts, ads, or tracking. Player names
          and settings are saved only on this device so they’re ready for your next game.
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        <LinkRow icon="document-text" title="Privacy Policy" url={LINKS.privacyPolicy} />
        <LinkRow icon="help-buoy" title="Support" url={LINKS.support} />
      </View>

      <Text style={styles.version}>Version {version}</Text>

      <PrimaryButton title="Done" onPress={onClose} />
    </ScrollView>
  );
}

function LinkRow({
  icon,
  title,
  url,
}: {
  icon: 'document-text' | 'help-buoy';
  title: string;
  url: string;
}) {
  return (
    <Bouncy
      onPress={() => Linking.openURL(url).catch(() => {})}
      style={styles.link}
      accessibilityLabel={title}
    >
      <Ionicons name={icon} size={20} color={colors.white} />
      <Text style={styles.linkText}>{title}</Text>
      <Ionicons name="open-outline" size={18} color={colors.faint} />
    </Bouncy>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 32, gap: 20 },
  title: { fontFamily: fonts.black, fontSize: 34, color: colors.white },
  body: { fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 23, color: 'rgba(255,255,255,0.8)' },
  card: {
    padding: 16,
    gap: 8,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontFamily: fonts.black, fontSize: 18, color: colors.white },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  linkText: { flex: 1, fontFamily: fonts.extraBold, fontSize: 17, color: colors.white },
  version: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.faint, textAlign: 'center' },
});
