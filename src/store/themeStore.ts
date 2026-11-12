import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultTheme } from "@/themes";

export type BackgroundMode = "aurora" | "deep" | "cobalt" | "ember";
export type RadiusStyle = "sharp" | "soft" | "round";
export type DockMode = "wide" | "compact" | "minimal";

interface ThemeState {
  themeId: string;
  accentId: string;
  density: "airy" | "balanced" | "compact";
  showGrid: boolean;
  use24HourTime: boolean;
  customAccent: string;
  backgroundMode: BackgroundMode;
  windowOpacity: number;
  windowBlur: number;
  radiusStyle: RadiusStyle;
  dockMode: DockMode;
  showWelcome: boolean;
  snapToGrid: boolean;
  showWindowLabels: boolean;
  setThemeId: (id: string) => void;
  setAccentId: (id: string) => void;
  setDensity: (density: ThemeState["density"]) => void;
  setShowGrid: (showGrid: boolean) => void;
  setUse24HourTime: (use24HourTime: boolean) => void;
  setCustomAccent: (customAccent: string) => void;
  setBackgroundMode: (backgroundMode: BackgroundMode) => void;
  setWindowOpacity: (windowOpacity: number) => void;
  setWindowBlur: (windowBlur: number) => void;
  setRadiusStyle: (radiusStyle: RadiusStyle) => void;
  setDockMode: (dockMode: DockMode) => void;
  setShowWelcome: (showWelcome: boolean) => void;
  setSnapToGrid: (snapToGrid: boolean) => void;
  setShowWindowLabels: (showWindowLabels: boolean) => void;
  resetAppearance: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: defaultTheme.id,
      accentId: "mint",
      density: "balanced",
      showGrid: true,
      use24HourTime: false,
      customAccent: "#82f7c5",
      backgroundMode: "aurora",
      windowOpacity: 86,
      windowBlur: 18,
      radiusStyle: "sharp",
      dockMode: "wide",
      showWelcome: true,
      snapToGrid: false,
      showWindowLabels: true,
      setThemeId: (id) => set({ themeId: id }),
      setAccentId: (accentId) => set({ accentId }),
      setDensity: (density) => set({ density }),
      setShowGrid: (showGrid) => set({ showGrid }),
      setUse24HourTime: (use24HourTime) => set({ use24HourTime }),
      setCustomAccent: (customAccent) => set({ customAccent, accentId: "custom" }),
      setBackgroundMode: (backgroundMode) => set({ backgroundMode }),
      setWindowOpacity: (windowOpacity) => set({ windowOpacity }),
      setWindowBlur: (windowBlur) => set({ windowBlur }),
      setRadiusStyle: (radiusStyle) => set({ radiusStyle }),
      setDockMode: (dockMode) => set({ dockMode }),
      setShowWelcome: (showWelcome) => set({ showWelcome }),
      setSnapToGrid: (snapToGrid) => set({ snapToGrid }),
      setShowWindowLabels: (showWindowLabels) => set({ showWindowLabels }),
      resetAppearance: () =>
        set({
          themeId: defaultTheme.id,
          accentId: "mint",
          density: "balanced",
          showGrid: true,
          use24HourTime: false,
          customAccent: "#82f7c5",
          backgroundMode: "aurora",
          windowOpacity: 86,
          windowBlur: 18,
          radiusStyle: "sharp",
          dockMode: "wide",
          showWelcome: true,
          snapToGrid: false,
          showWindowLabels: true,
        }),
    }),
    {
      name: "nova-exe-theme",
      version: 2,
      migrate: (persisted) => {
        const state = persisted as Partial<ThemeState>;
        return state.themeId === "midnight" ? { ...state, themeId: defaultTheme.id } : state;
      },
    }
  )
);
