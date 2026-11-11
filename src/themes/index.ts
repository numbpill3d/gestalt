import type { Theme } from "@/types/theme";

export const windows98: Theme = {
  id: "windows98",
  name: "Windows 98",
  tagline: "It's a beautiful day in the Recycle Bin.",
  colors: {
    bg: "#008080",
    surface: "#c0c0c0",
    surfaceAlt: "#dfdfdf",
    text: "#000000",
    textMuted: "#4b4b4b",
    accent: "#000080",
    accentText: "#ffffff",
    border: "#000000",
    shadow: "#404040",
  },
  borderRadius: "0px",
  fontFamily: '"MS Sans Serif", "Tahoma", sans-serif',
  headingFontFamily: '"MS Sans Serif", "Tahoma", sans-serif',
  cursor: "default",
  windowStyle: "win98",
  background: "#008080",
  soundPack: "win98",
};

export const midnight: Theme = {
  id: "midnight",
  name: "Midnight",
  tagline: "A calm command center for the open web.",
  colors: {
    bg: "#08111f",
    surface: "rgba(17, 29, 49, 0.86)",
    surfaceAlt: "rgba(27, 43, 69, 0.76)",
    text: "#e9f0ff",
    textMuted: "#8fa2c2",
    accent: "#82f7c5",
    accentText: "#08111f",
    border: "rgba(159, 188, 231, 0.2)",
    shadow: "rgba(0, 0, 0, 0.35)",
  },
  borderRadius: "18px",
  fontFamily: '"Inter", "Segoe UI", sans-serif',
  headingFontFamily: '"Inter", "Segoe UI", sans-serif',
  cursor: "default",
  windowStyle: "modern",
  background:
    "radial-gradient(circle at 16% 12%, rgba(58, 102, 160, 0.38), transparent 28%), radial-gradient(circle at 88% 84%, rgba(46, 143, 132, 0.22), transparent 30%), #08111f",
  soundPack: "none",
};

export const frutigerAero: Theme = {
  id: "frutiger-aero",
  name: "Frutiger Aero",
  tagline: "Glossy. Blue. Optimistic about technology.",
  colors: {
    bg: "#bfe6f5",
    surface: "rgba(255,255,255,0.55)",
    surfaceAlt: "rgba(255,255,255,0.8)",
    text: "#0b2e4a",
    textMuted: "#3a6a8a",
    accent: "#1a8fd1",
    accentText: "#ffffff",
    border: "rgba(255,255,255,0.6)",
    shadow: "rgba(15,80,120,0.35)",
  },
  borderRadius: "18px",
  fontFamily: '"Segoe UI", Verdana, sans-serif',
  headingFontFamily: '"Segoe UI", Verdana, sans-serif',
  cursor: "default",
  windowStyle: "aero",
  background:
    "linear-gradient(180deg, #eaf7ff 0%, #bfe6f5 35%, #8fd1e8 70%, #5db8d8 100%)",
  soundPack: "aero",
};

export const vaporwave: Theme = {
  id: "vaporwave",
  name: "Vaporwave",
  tagline: "A E S T H E T I C",
  colors: {
    bg: "#1a0b2e",
    surface: "#2d1b4e",
    surfaceAlt: "#3d2266",
    text: "#f8e8ff",
    textMuted: "#c9a3e8",
    accent: "#ff71ce",
    accentText: "#1a0b2e",
    border: "#01cdfe",
    shadow: "rgba(255,113,206,0.5)",
  },
  borderRadius: "2px",
  fontFamily: '"Courier New", monospace',
  headingFontFamily: '"Courier New", monospace',
  cursor: "crosshair",
  windowStyle: "vapor",
  background:
    "linear-gradient(180deg, #1a0b2e 0%, #3d1e6b 40%, #ff71ce 100%)",
  soundPack: "vapor",
};

export const neocities: Theme = {
  id: "neocities",
  name: "Neocities",
  tagline: "Under construction since 1999.",
  colors: {
    bg: "#000033",
    surface: "#ffff00",
    surfaceAlt: "#ffffff",
    text: "#000000",
    textMuted: "#660099",
    accent: "#ff00ff",
    accentText: "#ffffff",
    border: "#ff0000",
    shadow: "#000000",
  },
  borderRadius: "0px",
  fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
  headingFontFamily: '"Comic Sans MS", "Comic Sans", cursive',
  cursor: "default",
  windowStyle: "neocities",
  background: "#000033",
  soundPack: "neocities",
};

export const brutalist: Theme = {
  id: "brutalist",
  name: "Brutalist",
  tagline: "No gradients. No mercy.",
  colors: {
    bg: "#f2f2f2",
    surface: "#ffffff",
    surfaceAlt: "#eaeaea",
    text: "#000000",
    textMuted: "#555555",
    accent: "#ffe600",
    accentText: "#000000",
    border: "#000000",
    shadow: "#000000",
  },
  borderRadius: "0px",
  fontFamily: '"Courier New", monospace',
  headingFontFamily: '"Arial Black", sans-serif',
  cursor: "default",
  windowStyle: "brutalist",
  background: "#f2f2f2",
  soundPack: "none",
};

export const themes: Theme[] = [
  midnight,
  windows98,
  frutigerAero,
  vaporwave,
  neocities,
  brutalist,
];

export const defaultTheme = midnight;

export function getThemeById(id: string): Theme {
  return themes.find((t) => t.id === id) ?? defaultTheme;
}
