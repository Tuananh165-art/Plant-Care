import { ColorSchemeName } from 'react-native';

export const palette = {
  light: {
    background: '#F7FAF7', surface: '#FFFFFF', text: '#162318', muted: '#536156',
    primary: '#146C3A', primaryText: '#FFFFFF', border: '#B9C8BC', danger: '#A32D2D', warning: '#8A4B00',
    primarySoft: '#DDF4E5', accent: '#EAF6EE', accentStrong: '#B7E3C6', success: '#1C7C45', dangerSoft: '#FBE7E5', warningSoft: '#FFF1D8', shadow: '#0A2512'
  },
  dark: {
    background: '#101713', surface: '#1B251E', text: '#F1F7F1', muted: '#B9C8BC',
    primary: '#72D69A', primaryText: '#062C16', border: '#718174', danger: '#FFB4AB', warning: '#FFDDB6',
    primarySoft: '#173E25', accent: '#213126', accentStrong: '#315F41', success: '#72D69A', dangerSoft: '#48211E', warningSoft: '#4B351D', shadow: '#000000'
  }
} as const;

export type Theme = { [Key in keyof typeof palette.light]: string };
export const getTheme = (scheme: ColorSchemeName): Theme => scheme === 'dark' ? palette.dark : palette.light;
