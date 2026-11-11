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
  const customAccent = useThemeStore((s) => s.customAccent);
  const backgroundMode = useThemeStore((s) => s.backgroundMode);
  const windowOpacity = useThemeStore((s) => s.windowOpacity);
  const windowBlur = useThemeStore((s) => s.windowBlur);
  const radiusStyle = useThemeStore((s) => s.radiusStyle);
  const dockMode = useThemeStore((s) => s.dockMode);
  const showWelcome = useThemeStore((s) => s.showWelcome);
  const snapToGrid = useThemeStore((s) => s.snapToGrid);
  const showWindowLabels = useThemeStore((s) => s.showWindowLabels);
  const theme = getThemeById(themeId);

  useEffect(() => {
    const root = document.documentElement;
    const radius = { sharp: "6px", soft: "14px", round: "24px" }[radiusStyle];
    root.style.setProperty("--nova-bg", theme.colors.bg);
    root.style.setProperty("--nova-surface", theme.colors.surface);
    root.style.setProperty("--nova-surface-alt", theme.colors.surfaceAlt);
    root.style.setProperty("--nova-text", theme.colors.text);
    root.style.setProperty("--nova-text-muted", theme.colors.textMuted);
    root.style.setProperty("--nova-accent", accentId === "custom" ? customAccent : accents[accentId] ?? theme.colors.accent);
    root.style.setProperty("--nova-accent-text", "#08111f");
    root.style.setProperty("--nova-border", theme.colors.border);
    root.style.setProperty("--nova-shadow", theme.colors.shadow);
    root.style.setProperty("--nova-radius", radius ?? theme.borderRadius);
    root.style.setProperty("--nova-window-opacity", `${windowOpacity}%`);
    root.style.setProperty("--nova-window-blur", `${windowBlur}px`);
    root.style.setProperty("--nova-font", theme.fontFamily);
    root.style.setProperty("--nova-heading-font", theme.headingFontFamily);
    root.style.setProperty("--nova-cursor", theme.cursor);
    root.style.setProperty("--nova-page-bg", theme.background);
    root.dataset.windowStyle = theme.windowStyle;
    root.dataset.theme = theme.id;
    root.dataset.density = density;
    root.dataset.grid = showGrid ? "on" : "off";
    root.dataset.background = backgroundMode;
    root.dataset.dock = dockMode;
    root.dataset.welcome = showWelcome ? "on" : "off";
    root.dataset.snap = snapToGrid ? "on" : "off";
    root.dataset.windowLabels = showWindowLabels ? "on" : "off";
  }, [accentId, backgroundMode, customAccent, density, dockMode, radiusStyle, showGrid, showWelcome, showWindowLabels, snapToGrid, theme, windowBlur, windowOpacity]);

  return <>{children}</>;
}
