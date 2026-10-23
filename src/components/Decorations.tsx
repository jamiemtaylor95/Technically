import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { Player } from '../game/types';
import { colors, fonts, playerColor } from '../theme';

/** The tilted "Technically!" wordmark with a yellow brush stroke behind it. */
export function TitleLogo({ size = 60 }: { size?: number }) {
  return (
    <View style={{ transform: [{ rotate: '-4deg' }], alignItems: 'center' }} accessibilityRole="header">
      <Svg
        width={size * 6.4}
        height={size * 0.42}
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        style={{ position: 'absolute', bottom: size * 0.05 }}
      >
        <Path d="M0 5.5 C30 1.5 70 2 100 0.5 L98.5 6 C70 7 30 7.5 2 10 Z" fill={colors.yellow} />
      </Svg>
      <Text
        style={[
          styles.logo,
          { fontSize: size, lineHeight: size * 1.2, textShadowOffset: { width: 3, height: 4 } },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        Technically!
      </Text>
    </View>
  );
}

/** A wobbly underline like the ones under the ad's taglines. */
export function Squiggle({ width, height = 8, strokeWidth = 4 }: { width: number; height?: number; strokeWidth?: number }) {
  return (
    <Svg width={width} height={height + strokeWidth} viewBox={`0 0 ${width} ${height + strokeWidth}`}>
      <Path
        d={`M${strokeWidth / 2} ${height} Q${width / 2} ${height + strokeWidth / 2} ${width - strokeWidth / 2} ${strokeWidth / 2}`}
        stroke={colors.yellow}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

/** A little burst of "excited" lines. */
export function SparkBurst({
  count = 3,
  spread = 70,
  length = 16,
  color = colors.yellow,
  rotate = 0,
}: {
  count?: number;
  spread?: number;
  length?: number;
  color?: string;
  rotate?: number;
}) {
  const box = length * 3;
  return (
    <View
      style={{ width: box, height: box, transform: [{ rotate: `${rotate}deg` }] }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: count }, (_, i) => {
        const angle = count > 1 ? -spread / 2 + (spread * i) / (count - 1) : 0;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: box / 2 - 2,
              top: box / 2 - length / 2,
              width: 4,
              height: length,
              borderRadius: 2,
              backgroundColor: color,
              transform: [{ rotate: `${angle}deg` }, { translateY: -length * 1.1 }],
            }}
          />
        );
      })}
    </View>
  );
}

function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

/** Colored circle with a player's initial. */
export function Avatar({ player, size = 36 }: { player: Player; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: playerColor(player.colorIndex),
        borderWidth: size > 30 ? 2 : 1.5,
        borderColor: 'rgba(255,255,255,0.85)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      accessibilityLabel={player.name}
    >
      <Text style={{ fontFamily: fonts.black, fontSize: size * 0.45, color: colors.navyDeep }}>
        {initialOf(player.name)}
      </Text>
    </View>
  );
}

/** Avatars overlapped in a row. */
export function AvatarStack({ players, size = 26 }: { players: Player[]; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', height: size }}>
      {players.map((p, i) => (
        <View key={p.id} style={{ marginLeft: i === 0 ? 0 : -size * 0.3 }}>
          <Avatar player={p} size={size} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontFamily: fonts.black,
    color: colors.white,
    textShadowColor: colors.navyDeep,
    textShadowRadius: 0.1,
    paddingHorizontal: 8,
  },
});
