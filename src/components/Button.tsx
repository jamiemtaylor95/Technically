import * as Haptics from 'expo-haptics';
import { useState, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '../theme';

/** Pressable that shrinks a little while held. */
export function Bouncy({
  onPress,
  disabled,
  style,
  children,
  accessibilityLabel,
  selected,
  haptic = true,
}: {
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  accessibilityLabel?: string;
  selected?: boolean;
  haptic?: boolean;
}) {
  const [scale] = useState(() => new Animated.Value(1));
  const animateTo = (value: number) =>
    Animated.spring(scale, { toValue: value, useNativeDriver: true, speed: 40, bounciness: 8 }).start();

  return (
    <Pressable
      onPress={() => {
        if (haptic) Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      onPressIn={() => animateTo(0.94)}
      onPressOut={() => animateTo(1)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, selected }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
  color = colors.yellow,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
}) {
  return (
    <Bouncy
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.primary,
        { backgroundColor: color, shadowColor: color, opacity: disabled ? 0.4 : 1 },
        disabled && { shadowOpacity: 0 },
      ]}
    >
      <Text style={styles.primaryText}>{title}</Text>
    </Bouncy>
  );
}

export function SecondaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Bouncy onPress={onPress} style={styles.secondary}>
      <Text style={styles.secondaryText}>{title}</Text>
    </Bouncy>
  );
}

const styles = StyleSheet.create({
  primary: {
    borderRadius: 999,
    paddingVertical: 17,
    alignItems: 'center',
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryText: {
    fontFamily: fonts.black,
    fontSize: 22,
    color: colors.navyDeep,
  },
  secondary: {
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  secondaryText: {
    fontFamily: fonts.black,
    fontSize: 18,
    color: colors.white,
  },
});
