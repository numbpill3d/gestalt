"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import { getThemeById } from "@/themes";

const accents: Record<string, string> = {
  mint: "#82f7c5",
  sky: "#8cc8ff",
  coral: "#ff9b8c",
  violet: "#c7a7ff",
  amber: "#ffd166",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeId = useThemeStore((s) => s.themeId);
  const accentId = useThemeStore((s) => s.accentId);
  const density = useThemeStore((s) => s.density);
  const showGrid = useThemeStore((s) => s.showGrid);
  const theme = getThemeById(themeId);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--nova-bg", theme.colors.bg);
    root.style.setProperty("--nova-surface", theme.colors.surface);
    root.style.setProperty("--nova-surface-alt", theme.colors.surfaceAlt);
    root.style.setProperty("--nova-text", theme.colors.text);
    root.style.setProperty("--nova-text-muted", theme.colors.textMuted);
    root.style.setProperty("--nova-accent", accents[accentId] ?? theme.colors.accent);
    root.style.setProperty("--nova-accent-text", "#08111f");
    root.style.setProperty("--nova-border", theme.colors.border);
    root.style.setProperty("--nova-shadow", theme.colors.shadow);
    root.style.setProperty("--nova-radius", theme.borderRadius);
    root.style.setProperty("--nova-font", theme.fontFamily);
    root.style.setProperty("--nova-heading-font", theme.headingFontFamily);
    root.style.setProperty("--nova-cursor", theme.cursor);
    root.style.setProperty("--nova-page-bg", theme.background);
    root.dataset.windowStyle = theme.windowStyle;
    root.dataset.theme = theme.id;
    root.dataset.density = density;
    root.dataset.grid = showGrid ? "on" : "off";
  }, [accentId, density, showGrid, theme]);

  return <>{children}</>;
}
