import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '../theme';

/** Navy gradient with soft blue and purple glows. */
export function Background() {
  return (
    <LinearGradient colors={[colors.navy, colors.navyDeep]} style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="blueGlow" cx="0%" cy="5%" r="70%">
            <Stop offset="0" stopColor={colors.blue} stopOpacity={0.35} />
            <Stop offset="1" stopColor={colors.blue} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="purpleGlow" cx="100%" cy="95%" r="70%">
            <Stop offset="0" stopColor={colors.purple} stopOpacity={0.28} />
            <Stop offset="1" stopColor={colors.purple} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#blueGlow)" />
        <Rect width="100%" height="100%" fill="url(#purpleGlow)" />
      </Svg>
    </LinearGradient>
  );
}
