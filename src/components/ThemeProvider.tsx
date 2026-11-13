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
  const sidebarMode = useThemeStore((s) => s.sidebarMode);
  const showWelcome = useThemeStore((s) => s.showWelcome);
  const snapToGrid = useThemeStore((s) => s.snapToGrid);
  const showWindowLabels = useThemeStore((s) => s.showWindowLabels);
  const theme = getThemeById(themeId);

  useEffect(() => {
    const root = document.documentElement;
    const radius = { sharp: "0px", soft: "14px", round: "24px" }[radiusStyle];
    root.style.setProperty("--gestalt-bg", theme.colors.bg);
    root.style.setProperty("--gestalt-surface", theme.colors.surface);
    root.style.setProperty("--gestalt-surface-alt", theme.colors.surfaceAlt);
    root.style.setProperty("--gestalt-text", theme.colors.text);
    root.style.setProperty("--gestalt-text-muted", theme.colors.textMuted);
    const monochrome = theme.id === "macintosh";
    root.style.setProperty("--gestalt-accent", monochrome ? "#111111" : accentId === "custom" ? customAccent : accents[accentId] ?? theme.colors.accent);
    root.style.setProperty("--gestalt-accent-text", monochrome ? "#ffffff" : "#08111f");
    root.style.setProperty("--gestalt-border", theme.colors.border);
    root.style.setProperty("--gestalt-shadow", theme.colors.shadow);
    root.style.setProperty("--gestalt-radius", radius ?? theme.borderRadius);
    root.style.setProperty("--gestalt-window-opacity", `${windowOpacity}%`);
    root.style.setProperty("--gestalt-window-blur", `${windowBlur}px`);
    root.style.setProperty("--gestalt-font", theme.fontFamily);
    root.style.setProperty("--gestalt-heading-font", theme.headingFontFamily);
    root.style.setProperty("--gestalt-cursor", theme.cursor);
    root.style.setProperty("--gestalt-page-bg", theme.background);
    root.dataset.windowStyle = theme.windowStyle;
    root.dataset.theme = theme.id;
    root.dataset.density = density;
    root.dataset.grid = showGrid ? "on" : "off";
    root.dataset.background = backgroundMode;
    root.dataset.dock = dockMode;
    root.dataset.sidebar = sidebarMode;
    root.dataset.welcome = showWelcome ? "on" : "off";
    root.dataset.snap = snapToGrid ? "on" : "off";
    root.dataset.windowLabels = showWindowLabels ? "on" : "off";
  }, [accentId, backgroundMode, customAccent, density, dockMode, radiusStyle, showGrid, showWelcome, showWindowLabels, sidebarMode, snapToGrid, theme, windowBlur, windowOpacity]);

  return <>{children}</>;
}
