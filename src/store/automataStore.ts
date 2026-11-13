import { create } from "zustand";
import { persist } from "zustand/middleware";
import { gestaltStorage } from "@/store/persistStorage";

export type AutomataRule = "life" | "highlife" | "seeds" | "brian";
export type AutomataPalette = "mono" | "amber" | "green" | "ice";

interface AutomataState {
  rule: AutomataRule;
  speed: number;
  density: number;
  cellSize: number;
  palette: AutomataPalette;
  showGrid: boolean;
  running: boolean;
  seed: number;
  setRule: (rule: AutomataRule) => void;
  setSpeed: (speed: number) => void;
  setDensity: (density: number) => void;
  setCellSize: (cellSize: number) => void;
  setPalette: (palette: AutomataPalette) => void;
  setShowGrid: (showGrid: boolean) => void;
  setRunning: (running: boolean) => void;
  toggleRunning: () => void;
  reseed: () => void;
}

export const useAutomataStore = create<AutomataState>()(
  persist(
    (set) => ({
      rule: "life",
      speed: 8,
      density: 34,
      cellSize: 8,
      palette: "mono",
      showGrid: true,
      running: true,
      seed: 0,
      setRule: (rule) => set((state) => ({ rule, seed: state.seed + 1 })),
      setSpeed: (speed) => set({ speed }),
      setDensity: (density) => set((state) => ({ density, seed: state.seed + 1 })),
      setCellSize: (cellSize) => set((state) => ({ cellSize, seed: state.seed + 1 })),
      setPalette: (palette) => set({ palette }),
      setShowGrid: (showGrid) => set({ showGrid }),
      setRunning: (running) => set({ running }),
      toggleRunning: () => set((state) => ({ running: !state.running })),
      reseed: () => set((state) => ({ seed: state.seed + 1 })),
    }),
    { name: "gestalt-automata", storage: gestaltStorage("automata") }
  )
);
