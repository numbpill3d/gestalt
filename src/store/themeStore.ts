import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultTheme } from "@/themes";

interface ThemeState {
  themeId: string;
  accentId: string;
  density: "airy" | "balanced" | "compact";
  showGrid: boolean;
  use24HourTime: boolean;
  setThemeId: (id: string) => void;
  setAccentId: (id: string) => void;
  setDensity: (density: ThemeState["density"]) => void;
  setShowGrid: (showGrid: boolean) => void;
  setUse24HourTime: (use24HourTime: boolean) => void;
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
      setThemeId: (id) => set({ themeId: id }),
      setAccentId: (accentId) => set({ accentId }),
      setDensity: (density) => set({ density }),
      setShowGrid: (showGrid) => set({ showGrid }),
      setUse24HourTime: (use24HourTime) => set({ use24HourTime }),
      resetAppearance: () =>
        set({
          themeId: defaultTheme.id,
          accentId: "mint",
          density: "balanced",
          showGrid: true,
          use24HourTime: false,
        }),
    }),
    { name: "nova-exe-theme" }
  )
);
