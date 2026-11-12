export type WindowStyle =
  | "modern"
  | "macintosh"
  | "win98"
  | "aero"
  | "vapor"
  | "neocities"
  | "brutalist";

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
  border: string;
  shadow: string;
}

export interface Theme {
  id: string;
  name: string;
  tagline: string;
  colors: ThemeColors;
  borderRadius: string;
  fontFamily: string;
  headingFontFamily: string;
  cursor: string;
  windowStyle: WindowStyle;
  background: string;
  backgroundSize?: string;
  soundPack: string;
}
