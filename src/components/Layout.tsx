import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '../theme';
import { Bouncy } from './Button';

/** Slides and fades its children in when it mounts. */
export function SlideIn({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progress, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 4 }).start();
  }, [progress]);

  return (
    <Animated.View
      style={[
        { flex: 1 },
        style,
        {
          opacity: progress,
          transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** A top bar with a round icon button on the left and a centered title. */
export function TopBar({
  title,
  icon,
  onIconPress,
  iconLabel,
}: {
  title: string;
  icon: 'close' | 'chevron-back';
  onIconPress: () => void;
  iconLabel: string;
}) {
  return (
    <View style={styles.bar}>
      <Bouncy onPress={onIconPress} style={styles.iconButton} accessibilityLabel={iconLabel}>
        <Ionicons name={icon} size={22} color={colors.white} />
      </Bouncy>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.extraBold, fontSize: 16, color: 'rgba(255,255,255,0.85)' },
});
