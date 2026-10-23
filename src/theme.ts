import type { Side } from './game/types';

export const colors = {
  navy: '#142154',
  navyDeep: '#0A0F30',
  card: '#EDF0FC',
  surface: 'rgba(255,255,255,0.08)',
  stroke: 'rgba(255,255,255,0.14)',
  white: '#FFFFFF',
  muted: 'rgba(255,255,255,0.7)',
  faint: 'rgba(255,255,255,0.5)',

  yellow: '#FFD63B',
  blue: '#2E80FA',
  purple: '#9B5EE6',
  green: '#33CC7A',
  red: '#FA5C66',
  pink: '#F573CC',
  orange: '#FF9F43',
};

export const playerColors = [
  '#FF8C42',
  '#40C7D9',
  colors.pink,
  colors.green,
  colors.yellow,
  '#8C9EFF',
  colors.red,
  '#BFE659',
];

export function playerColor(index: number): string {
  const n = playerColors.length;
  return playerColors[((index % n) + n) % n];
}

export function sideColor(side: Side): string {
  return side === 'a' ? colors.blue : colors.purple;
}

export const fonts = {
  black: 'Nunito_900Black',
  extraBold: 'Nunito_800ExtraBold',
  bold: 'Nunito_700Bold',
  semiBold: 'Nunito_600SemiBold',
};
